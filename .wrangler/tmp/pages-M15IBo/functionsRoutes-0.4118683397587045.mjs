import { onRequestPost as __api_auth_login_js_onRequestPost } from "F:\\MCQsolve\\functions\\api\\auth\\login.js"
import { onRequestPost as __api_auth_logout_js_onRequestPost } from "F:\\MCQsolve\\functions\\api\\auth\\logout.js"
import { onRequestGet as __api_auth_me_js_onRequestGet } from "F:\\MCQsolve\\functions\\api\\auth\\me.js"
import { onRequestPost as __api_auth_signup_js_onRequestPost } from "F:\\MCQsolve\\functions\\api\\auth\\signup.js"
import { onRequestPost as __api_posts_create_js_onRequestPost } from "F:\\MCQsolve\\functions\\api\\posts\\create.js"
import { onRequestGet as __api_posts_detail_js_onRequestGet } from "F:\\MCQsolve\\functions\\api\\posts\\detail.js"
import { onRequestPost as __api_posts_submit_js_onRequestPost } from "F:\\MCQsolve\\functions\\api\\posts\\submit.js"
import { onRequestGet as __api_practice_history_js_onRequestGet } from "F:\\MCQsolve\\functions\\api\\practice\\history.js"
import { onRequestGet as __api_posts_index_js_onRequestGet } from "F:\\MCQsolve\\functions\\api\\posts\\index.js"
import { onRequestGet as __sitemap_xml_js_onRequestGet } from "F:\\MCQsolve\\functions\\sitemap.xml.js"

export const routes = [
    {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_js_onRequestPost],
    },
  {
      routePath: "/api/auth/logout",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_logout_js_onRequestPost],
    },
  {
      routePath: "/api/auth/me",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_me_js_onRequestGet],
    },
  {
      routePath: "/api/auth/signup",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_signup_js_onRequestPost],
    },
  {
      routePath: "/api/posts/create",
      mountPath: "/api/posts",
      method: "POST",
      middlewares: [],
      modules: [__api_posts_create_js_onRequestPost],
    },
  {
      routePath: "/api/posts/detail",
      mountPath: "/api/posts",
      method: "GET",
      middlewares: [],
      modules: [__api_posts_detail_js_onRequestGet],
    },
  {
      routePath: "/api/posts/submit",
      mountPath: "/api/posts",
      method: "POST",
      middlewares: [],
      modules: [__api_posts_submit_js_onRequestPost],
    },
  {
      routePath: "/api/practice/history",
      mountPath: "/api/practice",
      method: "GET",
      middlewares: [],
      modules: [__api_practice_history_js_onRequestGet],
    },
  {
      routePath: "/api/posts",
      mountPath: "/api/posts",
      method: "GET",
      middlewares: [],
      modules: [__api_posts_index_js_onRequestGet],
    },
  {
      routePath: "/sitemap.xml",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__sitemap_xml_js_onRequestGet],
    },
  ]