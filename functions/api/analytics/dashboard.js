import { jsonResponse } from '../utils.js';

const ADMIN_SECRET_KEY = "mcqsolve_admin_secret_key"; // Change in production

export async function onRequestGet(context) {
  try {
    const { env, request } = context;
    const { DB } = env;

    // Check authorization key
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    
    if (token !== ADMIN_SECRET_KEY) {
      return jsonResponse({ error: "Unauthorized. Invalid Admin Key." }, 401);
    }

    // Parse query parameters
    const url = new URL(request.url);
    const range = url.searchParams.get("range") || "7d"; // 1d, 3d, 7d, custom
    const startDateParam = url.searchParams.get("startDate"); // YYYY-MM-DD
    const endDateParam = url.searchParams.get("endDate"); // YYYY-MM-DD

    let thresholdSql = "";
    let thresholdParams = [];
    let isHourly = false;

    if (range === "1d") {
      thresholdSql = "created_at >= datetime('now', '-1 day')";
      isHourly = true;
    } else if (range === "3d") {
      thresholdSql = "created_at >= datetime('now', '-3 days')";
    } else if (range === "7d") {
      thresholdSql = "created_at >= datetime('now', '-7 days')";
    } else if (range === "custom" && startDateParam && endDateParam) {
      thresholdSql = "created_at >= ? AND created_at <= ?";
      thresholdParams = [`${startDateParam} 00:00:00`, `${endDateParam} 23:59:59`];
    } else {
      // Default to 7 days if invalid params
      thresholdSql = "created_at >= datetime('now', '-7 days')";
    }

    // 1. Total Users Count
    const totalUsersResult = await DB.prepare("SELECT COUNT(*) as count FROM users").first();
    const totalUsers = totalUsersResult ? totalUsersResult.count : 0;

    // 2. Active Users Count (Unique users with practice sessions in range)
    const activeUsersQuery = `
      SELECT COUNT(DISTINCT user_id) as count 
      FROM practice_sessions 
      WHERE ${thresholdSql}
    `;
    const activeUsersStmt = DB.prepare(activeUsersQuery);
    const activeUsersResult = await (thresholdParams.length > 0 
      ? activeUsersStmt.bind(...thresholdParams).first()
      : activeUsersStmt.first());
    const activeUsers = activeUsersResult ? activeUsersResult.count : 0;

    // 3. Total Page Views in Range
    const totalViewsQuery = `
      SELECT COUNT(*) as count 
      FROM site_visits 
      WHERE ${thresholdSql}
    `;
    const totalViewsStmt = DB.prepare(totalViewsQuery);
    const totalViewsResult = await (thresholdParams.length > 0 
      ? totalViewsStmt.bind(...thresholdParams).first()
      : totalViewsStmt.first());
    const totalViews = totalViewsResult ? totalViewsResult.count : 0;

    // 4. Traffic Timeline (grouped by day/hour)
    let trafficQuery = "";
    if (isHourly) {
      trafficQuery = `
        SELECT strftime('%Y-%m-%d %H:00:00', created_at) as time_bucket, COUNT(*) as count 
        FROM site_visits 
        WHERE ${thresholdSql}
        GROUP BY time_bucket 
        ORDER BY time_bucket ASC
      `;
    } else {
      trafficQuery = `
        SELECT date(created_at) as time_bucket, COUNT(*) as count 
        FROM site_visits 
        WHERE ${thresholdSql}
        GROUP BY time_bucket 
        ORDER BY time_bucket ASC
      `;
    }
    const trafficStmt = DB.prepare(trafficQuery);
    const { results: trafficData } = await (thresholdParams.length > 0
      ? trafficStmt.bind(...thresholdParams).all()
      : trafficStmt.all());

    // 5. Top Visited Paths
    const topPathsQuery = `
      SELECT path, COUNT(*) as count 
      FROM site_visits 
      WHERE ${thresholdSql}
      GROUP BY path 
      ORDER BY count DESC 
      LIMIT 10
    `;
    const topPathsStmt = DB.prepare(topPathsQuery);
    const { results: topPaths } = await (thresholdParams.length > 0
      ? topPathsStmt.bind(...thresholdParams).all()
      : topPathsStmt.all());

    // 6. User List (showing email, created_at, password_hash, and total practice tests)
    const { results: usersList } = await DB.prepare(`
      SELECT u.id, u.email, u.password_hash, u.created_at, COUNT(p.id) as total_tests 
      FROM users u 
      LEFT JOIN practice_sessions p ON u.id = p.user_id 
      GROUP BY u.id 
      ORDER BY u.created_at DESC
    `).all();

    return jsonResponse({
      totalUsers,
      activeUsers,
      totalViews,
      trafficData: trafficData || [],
      topPaths: topPaths || [],
      usersList: usersList || []
    }, 200);

  } catch (err) {
    return jsonResponse({ error: `Dashboard API failed: ${err.message}` }, 500);
  }
}
