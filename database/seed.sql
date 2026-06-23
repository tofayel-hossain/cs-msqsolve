-- Seed Sample Data for MCQSolve Global
-- Run this SQL in your Cloudflare D1 database after schema creation

-- 1. Seed HTML/CSS Web Development Questions
INSERT OR IGNORE INTO posts (
    category, 
    year, 
    title, 
    slug, 
    subject_code, 
    subject, 
    board, 
    mcq_count, 
    questions, 
    answers, 
    explanations, 
    status
) VALUES (
    'web-development',
    2026,
    'HTML5 & CSS3 Essentials Practice Test',
    'html5-css3-essentials-practice-test',
    'CS-101',
    'Web Development Essentials',
    'W3C General',
    3,
    '[{"q":"Which HTML5 element is used to display a line break?","a":"<break>","b":"<lb>","c":"<br>","d":"<hr>"},{"q":"What is the correct CSS syntax to bold text?\\n```css\\np {\\n  font-weight: bold;\\n}\\n```","a":"p {text-size: bold;}","b":"p {font-weight: bold;}","c":"p {font: bold;}","d":"p {style: bold;}"},{"q":"Which CSS property controls the size of text?","a":"font-style","b":"text-size","c":"font-size","d":"text-style"}]',
    '{"ka":["c","b","c"]}',
    '["The <br> tag is an empty tag used to insert a single line break.","The font-weight property determines the boldness of the font.","The font-size property sets the size of the font in CSS."]',
    'published'
);

-- 2. Seed General Knowledge Questions
INSERT OR IGNORE INTO posts (
    category, 
    year, 
    title, 
    slug, 
    subject_code, 
    subject, 
    board, 
    mcq_count, 
    questions, 
    answers, 
    explanations, 
    status
) VALUES (
    'general-knowledge',
    2026,
    'World Geography & International Affairs',
    'world-geography-international-affairs',
    'GK-202',
    'General Knowledge',
    'Global Board',
    3,
    '[{"q":"Which is the largest ocean on Earth?","a":"Atlantic Ocean","b":"Indian Ocean","c":"Pacific Ocean","d":"Arctic Ocean"},{"q":"Which country is known as the Land of the Rising Sun?","a":"China","b":"Japan","c":"South Korea","d":"Thailand"},{"q":"What is the capital of Australia?","a":"Sydney","b":"Melbourne","c":"Canberra","d":"Brisbane"}]',
    '{"ka":["c","b","c"]}',
    '["The Pacific Ocean is the largest and deepest of Earth''s oceanic divisions.","Japan is often referred to as the Land of the Rising Sun because it lies to the east of China.","Canberra is the capital city of Australia, founded in 1913 as a compromise between Sydney and Melbourne."]',
    'published'
);
