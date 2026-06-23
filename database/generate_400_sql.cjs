/**
 * MCQSolve 400 Topics SQL Generator
 * Run this using: node database/generate_400_sql.cjs
 * It will output: database/seed_400.sql
 */

const fs = require('fs');
const path = require('path');

// 1. Define all 400 keywords with respective categories and search tags
const TOPICS = [
  // HTML / CSS / Web Basics (1–25)
  { id: 1, cat: 'web-development', kw: 'HTML MCQ with answers for beginners', tags: ['html', 'basic'] },
  { id: 2, cat: 'web-development', kw: 'HTML tags MCQ practice set', tags: ['html', 'tags'] },
  { id: 3, cat: 'web-development', kw: 'HTML attributes MCQ questions', tags: ['html', 'attributes'] },
  { id: 4, cat: 'web-development', kw: 'HTML forms MCQ quiz', tags: ['html', 'forms'] },
  { id: 5, cat: 'web-development', kw: 'HTML table MCQ questions', tags: ['html', 'tables'] },
  { id: 6, cat: 'web-development', kw: 'HTML5 new features MCQ', tags: ['html5'] },
  { id: 7, cat: 'web-development', kw: 'HTML semantic tags MCQ', tags: ['html', 'semantic'] },
  { id: 8, cat: 'web-development', kw: 'CSS MCQ with answers beginners', tags: ['css', 'basic'] },
  { id: 9, cat: 'web-development', kw: 'CSS selectors MCQ practice', tags: ['css', 'selectors'] },
  { id: 10, cat: 'web-development', kw: 'CSS box model MCQ questions', tags: ['css', 'box-model'] },
  { id: 11, cat: 'web-development', kw: 'CSS positioning MCQ quiz', tags: ['css', 'positioning'] },
  { id: 12, cat: 'web-development', kw: 'CSS flexbox MCQ questions', tags: ['css', 'flexbox'] },
  { id: 13, cat: 'web-development', kw: 'CSS grid MCQ practice set', tags: ['css', 'grid'] },
  { id: 14, cat: 'web-development', kw: 'Responsive design MCQ questions', tags: ['css', 'responsive'] },
  { id: 15, cat: 'web-development', kw: 'Bootstrap MCQ with answers', tags: ['bootstrap'] },
  { id: 16, cat: 'web-development', kw: 'Web development basics MCQ', tags: ['web', 'basic'] },
  { id: 17, cat: 'web-development', kw: 'Frontend developer MCQ test', tags: ['frontend'] },
  { id: 18, cat: 'web-development', kw: 'HTML vs XHTML MCQ questions', tags: ['html', 'xhtml'] },
  { id: 19, cat: 'web-development', kw: 'HTML input types MCQ', tags: ['html', 'inputs'] },
  { id: 20, cat: 'web-development', kw: 'CSS units MCQ questions', tags: ['css', 'units'] },
  { id: 21, cat: 'web-development', kw: 'CSS animation MCQ quiz', tags: ['css', 'animation'] },
  { id: 22, cat: 'web-development', kw: 'CSS pseudo classes MCQ', tags: ['css', 'pseudo'] },
  { id: 23, cat: 'web-development', kw: 'HTML interview MCQ questions', tags: ['html', 'interview'] },
  { id: 24, cat: 'web-development', kw: 'Web design MCQ practice test', tags: ['web', 'design'] },
  { id: 25, cat: 'web-development', kw: 'Basic website structure MCQ', tags: ['html', 'structure'] },

  // JavaScript + Programming (26–60)
  { id: 26, cat: 'javascript-programming', kw: 'JavaScript MCQ with answers beginners', tags: ['js', 'basic'] },
  { id: 27, cat: 'javascript-programming', kw: 'JavaScript variables MCQ questions', tags: ['js', 'variables'] },
  { id: 28, cat: 'javascript-programming', kw: 'JavaScript functions MCQ practice', tags: ['js', 'functions'] },
  { id: 29, cat: 'javascript-programming', kw: 'JavaScript array MCQ quiz', tags: ['js', 'arrays'] },
  { id: 30, cat: 'javascript-programming', kw: 'JavaScript DOM MCQ questions', tags: ['js', 'dom'] },
  { id: 31, cat: 'javascript-programming', kw: 'JavaScript event handling MCQ', tags: ['js', 'events'] },
  { id: 32, cat: 'javascript-programming', kw: 'JavaScript loops MCQ practice set', tags: ['js', 'loops'] },
  { id: 33, cat: 'javascript-programming', kw: 'JavaScript objects MCQ questions', tags: ['js', 'objects'] },
  { id: 34, cat: 'javascript-programming', kw: 'JavaScript ES6 MCQ quiz', tags: ['js', 'es6'] },
  { id: 35, cat: 'javascript-programming', kw: 'Python MCQ with answers beginners', tags: ['python', 'basic'] },
  { id: 36, cat: 'javascript-programming', kw: 'Python loops MCQ questions', tags: ['python', 'loops'] },
  { id: 37, cat: 'javascript-programming', kw: 'Python functions MCQ practice', tags: ['python', 'functions'] },
  { id: 38, cat: 'javascript-programming', kw: 'Python OOP MCQ questions', tags: ['python', 'oop'] },
  { id: 39, cat: 'javascript-programming', kw: 'Python list MCQ quiz', tags: ['python', 'list'] },
  { id: 40, cat: 'javascript-programming', kw: 'Python string MCQ questions', tags: ['python', 'strings'] },
  { id: 41, cat: 'javascript-programming', kw: 'Python dictionary MCQ practice', tags: ['python', 'dictionary'] },
  { id: 42, cat: 'javascript-programming', kw: 'C programming MCQ basics', tags: ['c', 'basic'] },
  { id: 43, cat: 'javascript-programming', kw: 'C pointers MCQ questions', tags: ['c', 'pointers'] },
  { id: 44, cat: 'javascript-programming', kw: 'C arrays MCQ practice', tags: ['c', 'arrays'] },
  { id: 45, cat: 'javascript-programming', kw: 'C++ MCQ with answers', tags: ['cpp', 'basic'] },
  { id: 46, cat: 'javascript-programming', kw: 'C++ OOP MCQ questions', tags: ['cpp', 'oop'] },
  { id: 47, cat: 'javascript-programming', kw: 'Java MCQ with answers beginners', tags: ['java', 'basic'] },
  { id: 48, cat: 'javascript-programming', kw: 'Java OOP MCQ practice', tags: ['java', 'oop'] },
  { id: 49, cat: 'javascript-programming', kw: 'Programming fundamentals MCQ', tags: ['prog', 'basic'] },
  { id: 50, cat: 'javascript-programming', kw: 'Coding interview MCQ questions', tags: ['prog', 'interview'] },
  { id: 51, cat: 'javascript-programming', kw: 'Data types MCQ programming', tags: ['prog', 'datatypes'] },
  { id: 52, cat: 'javascript-programming', kw: 'Compiler vs interpreter MCQ', tags: ['compiler'] },
  { id: 53, cat: 'javascript-programming', kw: 'Programming logic MCQ test', tags: ['logic'] },
  { id: 54, cat: 'javascript-programming', kw: 'Algorithm basics MCQ', tags: ['algorithms'] },
  { id: 55, cat: 'javascript-programming', kw: 'Debugging MCQ questions', tags: ['debugging'] },
  { id: 56, cat: 'javascript-programming', kw: 'Syntax error MCQ quiz', tags: ['errors'] },
  { id: 57, cat: 'javascript-programming', kw: 'Programming language MCQ comparison', tags: ['prog'] },
  { id: 58, cat: 'javascript-programming', kw: 'Software development MCQ basics', tags: ['swe'] },
  { id: 59, cat: 'javascript-programming', kw: 'Coding aptitude MCQ test', tags: ['aptitude'] },
  { id: 60, cat: 'javascript-programming', kw: 'Programming exam MCQ practice', tags: ['prog', 'exam'] },

  // DBMS + SQL (61–85)
  { id: 61, cat: 'dbms', kw: 'DBMS MCQ with answers', tags: ['dbms', 'basic'] },
  { id: 62, cat: 'dbms', kw: 'SQL MCQ questions and answers', tags: ['sql', 'basic'] },
  { id: 63, cat: 'dbms', kw: 'SQL SELECT statement MCQ', tags: ['sql', 'select'] },
  { id: 64, cat: 'dbms', kw: 'SQL JOIN MCQ practice', tags: ['sql', 'joins'] },
  { id: 65, cat: 'dbms', kw: 'SQL GROUP BY MCQ questions', tags: ['sql', 'groupby'] },
  { id: 66, cat: 'dbms', kw: 'SQL functions MCQ quiz', tags: ['sql', 'functions'] },
  { id: 67, cat: 'dbms', kw: 'DBMS normalization MCQ', tags: ['dbms', 'normalization'] },
  { id: 68, cat: 'dbms', kw: 'Primary key MCQ questions', tags: ['dbms', 'keys'] },
  { id: 69, cat: 'dbms', kw: 'Foreign key MCQ practice', tags: ['dbms', 'keys'] },
  { id: 70, cat: 'dbms', kw: 'Database transactions MCQ', tags: ['dbms', 'transactions'] },
  { id: 71, cat: 'dbms', kw: 'ACID properties MCQ questions', tags: ['dbms', 'acid'] },
  { id: 72, cat: 'dbms', kw: 'ER diagram MCQ quiz', tags: ['dbms', 'er'] },
  { id: 73, cat: 'dbms', kw: 'Relational database MCQ', tags: ['dbms', 'relational'] },
  { id: 74, cat: 'dbms', kw: 'SQL queries MCQ test', tags: ['sql', 'queries'] },
  { id: 75, cat: 'dbms', kw: 'DBMS architecture MCQ', tags: ['dbms', 'architecture'] },
  { id: 76, cat: 'dbms', kw: 'Indexing in DBMS MCQ', tags: ['dbms', 'indexing'] },
  { id: 77, cat: 'dbms', kw: 'Database keys MCQ questions', tags: ['dbms', 'keys'] },
  { id: 78, cat: 'dbms', kw: 'SQL constraints MCQ practice', tags: ['sql', 'constraints'] },
  { id: 79, cat: 'dbms', kw: 'DBMS viva questions MCQ', tags: ['dbms', 'viva'] },
  { id: 80, cat: 'dbms', kw: 'Database management basics MCQ', tags: ['dbms', 'basic'] },
  { id: 81, cat: 'dbms', kw: 'MySQL MCQ questions', tags: ['mysql'] },
  { id: 82, cat: 'dbms', kw: 'Oracle database MCQ', tags: ['oracle'] },
  { id: 83, cat: 'dbms', kw: 'SQL interview MCQ questions', tags: ['sql', 'interview'] },
  { id: 84, cat: 'dbms', kw: 'DBMS exam MCQ test', tags: ['dbms', 'exam'] },
  { id: 85, cat: 'dbms', kw: 'Data warehouse MCQ basics', tags: ['dbms', 'warehouse'] },

  // Operating System + Networking (86–120)
  { id: 86, cat: 'os-networking', kw: 'Operating system MCQ with answers', tags: ['os', 'basic'] },
  { id: 87, cat: 'os-networking', kw: 'Process management MCQ questions', tags: ['os', 'processes'] },
  { id: 88, cat: 'os-networking', kw: 'CPU scheduling MCQ quiz', tags: ['os', 'scheduling'] },
  { id: 89, cat: 'os-networking', kw: 'Deadlock MCQ questions', tags: ['os', 'deadlocks'] },
  { id: 90, cat: 'os-networking', kw: 'Memory management MCQ', tags: ['os', 'memory'] },
  { id: 91, cat: 'os-networking', kw: 'Paging vs segmentation MCQ', tags: ['os', 'paging'] },
  { id: 92, cat: 'os-networking', kw: 'File system MCQ questions', tags: ['os', 'files'] },
  { id: 93, cat: 'os-networking', kw: 'Linux MCQ basics', tags: ['linux'] },
  { id: 94, cat: 'os-networking', kw: 'Windows OS MCQ questions', tags: ['windows'] },
  { id: 95, cat: 'os-networking', kw: 'Computer network MCQ', tags: ['network', 'basic'] },
  { id: 96, cat: 'os-networking', kw: 'OSI model MCQ questions', tags: ['network', 'osi'] },
  { id: 97, cat: 'os-networking', kw: 'TCP IP model MCQ quiz', tags: ['network', 'tcpip'] },
  { id: 98, cat: 'os-networking', kw: 'Networking protocols MCQ', tags: ['network', 'protocols'] },
  { id: 99, cat: 'os-networking', kw: 'IP address MCQ questions', tags: ['network', 'ip'] },
  { id: 100, cat: 'os-networking', kw: 'DNS MCQ practice', tags: ['network', 'dns'] },
  { id: 101, cat: 'os-networking', kw: 'HTTP vs HTTPS MCQ', tags: ['network', 'http'] },
  { id: 102, cat: 'os-networking', kw: 'Router vs switch MCQ', tags: ['network', 'devices'] },
  { id: 103, cat: 'os-networking', kw: 'Network security MCQ basics', tags: ['security', 'basic'] },
  { id: 104, cat: 'os-networking', kw: 'Cybersecurity MCQ questions', tags: ['security', 'cyber'] },
  { id: 105, cat: 'os-networking', kw: 'Firewall MCQ quiz', tags: ['security', 'firewalls'] },
  { id: 106, cat: 'os-networking', kw: 'LAN WAN MAN MCQ', tags: ['network', 'lan'] },
  { id: 107, cat: 'os-networking', kw: 'Data communication MCQ', tags: ['network', 'comms'] },
  { id: 108, cat: 'os-networking', kw: 'Transmission media MCQ', tags: ['network', 'media'] },
  { id: 109, cat: 'os-networking', kw: 'Network topologies MCQ', tags: ['network', 'topologies'] },
  { id: 110, cat: 'os-networking', kw: 'Error detection MCQ questions', tags: ['network', 'errors'] },
  { id: 111, cat: 'os-networking', kw: 'OS scheduling algorithms MCQ', tags: ['os', 'scheduling'] },
  { id: 112, cat: 'os-networking', kw: 'Virtual memory MCQ quiz', tags: ['os', 'memory'] },
  { id: 113, cat: 'os-networking', kw: 'Kernel MCQ questions', tags: ['os', 'kernel'] },
  { id: 114, cat: 'os-networking', kw: 'System calls MCQ', tags: ['os', 'syscalls'] },
  { id: 115, cat: 'os-networking', kw: 'Multithreading MCQ basics', tags: ['os', 'threads'] },
  { id: 116, cat: 'os-networking', kw: 'Cloud computing MCQ', tags: ['cloud'] },
  { id: 117, cat: 'os-networking', kw: 'Distributed system MCQ', tags: ['distributed'] },
  { id: 118, cat: 'os-networking', kw: 'Computer architecture MCQ', tags: ['architecture'] },
  { id: 119, cat: 'os-networking', kw: 'Cache memory MCQ', tags: ['os', 'cache'] },
  { id: 120, cat: 'os-networking', kw: 'I/O devices MCQ', tags: ['os', 'io'] },

  // Exam + Career Focus (121–160)
  { id: 121, cat: 'academic', kw: 'Computer fundamentals MCQ test', tags: ['fundamentals'] },
  { id: 122, cat: 'academic', kw: 'ICT MCQ for admission exam', tags: ['ict'] },
  { id: 123, cat: 'job-exam', kw: 'Bank job computer MCQ', tags: ['job', 'bank'] },
  { id: 124, cat: 'job-exam', kw: 'Government job MCQ computer', tags: ['job', 'govt'] },
  { id: 125, cat: 'job-exam', kw: 'Competitive exam MCQ test', tags: ['exam'] },
  { id: 126, cat: 'academic', kw: 'University admission MCQ ICT', tags: ['ict', 'admission'] },
  { id: 127, cat: 'academic', kw: 'Basic computer MCQ questions', tags: ['fundamentals', 'basic'] },
  { id: 128, cat: 'academic', kw: 'Computer literacy MCQ quiz', tags: ['fundamentals'] },
  { id: 129, cat: 'job-exam', kw: 'IT interview MCQ questions', tags: ['interview'] },
  { id: 130, cat: 'job-exam', kw: 'Aptitude test MCQ computer', tags: ['aptitude'] },
  { id: 131, cat: 'job-exam', kw: 'General computer knowledge MCQ', tags: ['fundamentals'] },
  { id: 132, cat: 'job-exam', kw: 'Office tools MCQ questions', tags: ['office'] },
  { id: 133, cat: 'job-exam', kw: 'Microsoft Word MCQ', tags: ['office', 'word'] },
  { id: 134, cat: 'job-exam', kw: 'Excel MCQ questions', tags: ['office', 'excel'] },
  { id: 135, cat: 'job-exam', kw: 'PowerPoint MCQ quiz', tags: ['office', 'powerpoint'] },
  { id: 136, cat: 'academic', kw: 'Computer shortcut keys MCQ', tags: ['shortcuts'] },
  { id: 137, cat: 'academic', kw: 'Internet basics MCQ', tags: ['internet'] },
  { id: 138, cat: 'academic', kw: 'Email system MCQ questions', tags: ['email'] },
  { id: 139, cat: 'academic', kw: 'Computer hardware MCQ', tags: ['hardware'] },
  { id: 140, cat: 'academic', kw: 'Software vs hardware MCQ', tags: ['software', 'hardware'] },
  { id: 141, cat: 'academic', kw: 'Computer virus MCQ quiz', tags: ['security', 'virus'] },
  { id: 142, cat: 'academic', kw: 'Antivirus MCQ questions', tags: ['security', 'antivirus'] },
  { id: 143, cat: 'job-exam', kw: 'IT support MCQ basics', tags: ['support'] },
  { id: 144, cat: 'job-exam', kw: 'Data entry MCQ test', tags: ['dataentry'] },
  { id: 145, cat: 'job-exam', kw: 'Freelancing MCQ basics', tags: ['freelance'] },
  { id: 146, cat: 'academic', kw: 'Digital literacy MCQ', tags: ['literacy'] },
  { id: 147, cat: 'academic', kw: 'Online safety MCQ questions', tags: ['security'] },
  { id: 148, cat: 'job-exam', kw: 'Tech aptitude MCQ test', tags: ['aptitude'] },
  { id: 149, cat: 'job-exam', kw: 'Computer job MCQ preparation', tags: ['job', 'prep'] },
  { id: 150, cat: 'job-exam', kw: 'Entry level IT MCQ', tags: ['support', 'basic'] },

  // General CTR / Viral computer topics (151–200)
  { id: 151, cat: 'general-knowledge', kw: 'Top 50 computer MCQ questions', tags: ['general'] },
  { id: 152, cat: 'general-knowledge', kw: 'Most important MCQ for exams', tags: ['general'] },
  { id: 153, cat: 'general-knowledge', kw: 'Tricky computer MCQ questions', tags: ['general'] },
  { id: 154, cat: 'general-knowledge', kw: 'Hard MCQ computer test', tags: ['general', 'hard'] },
  { id: 155, cat: 'general-knowledge', kw: 'Easy computer MCQ practice', tags: ['general', 'easy'] },
  { id: 156, cat: 'general-knowledge', kw: 'Mixed MCQ test computer science', tags: ['cs'] },
  { id: 157, cat: 'general-knowledge', kw: 'Practice test MCQ online', tags: ['general'] },
  { id: 158, cat: 'general-knowledge', kw: '100 MCQ computer test', tags: ['general'] },
  { id: 159, cat: 'general-knowledge', kw: 'Computer quiz with answers', tags: ['general'] },
  { id: 160, cat: 'general-knowledge', kw: 'Daily MCQ practice test', tags: ['general'] },
  { id: 161, cat: 'general-knowledge', kw: 'Rapid fire MCQ questions', tags: ['general'] },
  { id: 162, cat: 'general-knowledge', kw: 'MCQ exam preparation test', tags: ['general'] },
  { id: 163, cat: 'general-knowledge', kw: 'Competitive MCQ practice set', tags: ['general'] },
  { id: 164, cat: 'general-knowledge', kw: 'Important ICT MCQ questions', tags: ['ict'] },
  { id: 165, cat: 'general-knowledge', kw: 'Basic to advanced MCQ test', tags: ['general'] },
  { id: 166, cat: 'general-knowledge', kw: 'Computer science quiz beginners', tags: ['cs', 'easy'] },
  { id: 167, cat: 'general-knowledge', kw: 'Revision MCQ test computer', tags: ['general'] },
  { id: 168, cat: 'general-knowledge', kw: 'Final exam MCQ practice', tags: ['general'] },
  { id: 169, cat: 'general-knowledge', kw: 'Study MCQ test online', tags: ['general'] },
  { id: 170, cat: 'general-knowledge', kw: 'Knowledge test MCQ computer', tags: ['general'] },
  { id: 171, cat: 'general-knowledge', kw: 'Brain test MCQ questions', tags: ['general'] },
  { id: 172, cat: 'general-knowledge', kw: 'Logic MCQ computer quiz', tags: ['logic'] },
  { id: 173, cat: 'general-knowledge', kw: 'Fast MCQ practice test', tags: ['general'] },
  { id: 174, cat: 'general-knowledge', kw: 'Short MCQ test computer basics', tags: ['general', 'basic'] },
  { id: 175, cat: 'general-knowledge', kw: 'Concept MCQ revision test', tags: ['general'] },
  { id: 176, cat: 'general-knowledge', kw: 'Interview MCQ computer questions', tags: ['interview'] },
  { id: 177, cat: 'general-knowledge', kw: 'Exam ready MCQ practice', tags: ['general'] },
  { id: 178, cat: 'general-knowledge', kw: 'Self assessment MCQ test', tags: ['general'] },
  { id: 179, cat: 'general-knowledge', kw: 'Online MCQ quiz computer', tags: ['general'] },
  { id: 180, cat: 'general-knowledge', kw: 'Practice set MCQ questions', tags: ['general'] },
  { id: 181, cat: 'general-knowledge', kw: 'Topic wise MCQ test', tags: ['general'] },
  { id: 182, cat: 'general-knowledge', kw: 'Computer MCQ learning test', tags: ['general'] },
  { id: 183, cat: 'general-knowledge', kw: 'Skill test MCQ computer', tags: ['general'] },
  { id: 184, cat: 'general-knowledge', kw: 'Mock test MCQ computer science', tags: ['cs'] },
  { id: 185, cat: 'general-knowledge', kw: 'Daily quiz MCQ questions', tags: ['general'] },
  { id: 186, cat: 'general-knowledge', kw: 'Beginner MCQ computer test', tags: ['general', 'easy'] },
  { id: 187, cat: 'general-knowledge', kw: 'Advanced MCQ practice test', tags: ['general', 'hard'] },
  { id: 188, cat: 'general-knowledge', kw: 'Important questions MCQ list', tags: ['general'] },
  { id: 189, cat: 'general-knowledge', kw: 'Full syllabus MCQ test', tags: ['general'] },
  { id: 190, cat: 'general-knowledge', kw: 'Ultimate computer MCQ practice set', tags: ['general'] },

  // NEW TOPICS (201-400)
  // Computer Fundamentals (201–230)
  { id: 201, cat: 'academic', kw: 'Number system conversion MCQ questions', tags: ['fundamentals', 'numbers'] },
  { id: 202, cat: 'academic', kw: 'Binary to decimal MCQ practice', tags: ['fundamentals', 'binary'] },
  { id: 203, cat: 'academic', kw: 'Hexadecimal arithmetic MCQ', tags: ['fundamentals', 'hex'] },
  { id: 204, cat: 'academic', kw: 'Computer generation MCQ questions', tags: ['fundamentals', 'generations'] },
  { id: 205, cat: 'academic', kw: 'Computer classification MCQ test', tags: ['fundamentals', 'types'] },
  { id: 206, cat: 'academic', kw: 'Input output devices MCQ quiz', tags: ['fundamentals', 'io'] },
  { id: 207, cat: 'academic', kw: 'Storage devices MCQ questions', tags: ['fundamentals', 'storage'] },
  { id: 208, cat: 'academic', kw: 'RAM vs ROM MCQ practice', tags: ['fundamentals', 'memory'] },
  { id: 209, cat: 'academic', kw: 'SSD vs HDD MCQ comparison test', tags: ['fundamentals', 'storage'] },
  { id: 210, cat: 'academic', kw: 'Motherboard components MCQ', tags: ['fundamentals', 'hardware'] },
  { id: 211, cat: 'academic', kw: 'CPU architecture MCQ questions', tags: ['fundamentals', 'cpu'] },
  { id: 212, cat: 'academic', kw: 'ALU control unit MCQ quiz', tags: ['fundamentals', 'cpu'] },
  { id: 213, cat: 'academic', kw: 'Register types MCQ computer', tags: ['fundamentals', 'registers'] },
  { id: 214, cat: 'academic', kw: 'Computer speed units MCQ', tags: ['fundamentals', 'metrics'] },
  { id: 215, cat: 'academic', kw: 'Bit byte conversion MCQ test', tags: ['fundamentals', 'binary'] },
  { id: 216, cat: 'academic', kw: 'Digital vs analog MCQ questions', tags: ['fundamentals'] },
  { id: 217, cat: 'academic', kw: 'Firmware MCQ basics', tags: ['fundamentals', 'bios'] },
  { id: 218, cat: 'academic', kw: 'BIOS MCQ questions', tags: ['fundamentals', 'bios'] },
  { id: 219, cat: 'academic', kw: 'POST process MCQ quiz', tags: ['fundamentals', 'booting'] },
  { id: 220, cat: 'academic', kw: 'Booting process MCQ test', tags: ['fundamentals', 'booting'] },
  { id: 221, cat: 'academic', kw: 'Computer maintenance MCQ', tags: ['fundamentals', 'troubleshooting'] },
  { id: 222, cat: 'academic', kw: 'Hardware troubleshooting MCQ', tags: ['fundamentals', 'troubleshooting'] },
  { id: 223, cat: 'academic', kw: 'Peripheral devices MCQ questions', tags: ['fundamentals', 'io'] },
  { id: 224, cat: 'academic', kw: 'Scanner and printer MCQ', tags: ['fundamentals', 'io'] },
  { id: 225, cat: 'academic', kw: 'Plotter device MCQ basics', tags: ['fundamentals', 'io'] },
  { id: 226, cat: 'academic', kw: 'Cache levels MCQ questions', tags: ['fundamentals', 'cache'] },
  { id: 227, cat: 'academic', kw: 'System performance MCQ test', tags: ['fundamentals', 'metrics'] },
  { id: 228, cat: 'academic', kw: 'Computer safety MCQ basics', tags: ['fundamentals'] },
  { id: 229, cat: 'academic', kw: 'Error types in computer MCQ', tags: ['fundamentals'] },
  { id: 230, cat: 'academic', kw: 'Data representation MCQ', tags: ['fundamentals', 'binary'] },

  // Internet + Web Technologies (231–260)
  { id: 231, cat: 'web-development', kw: 'Internet protocol MCQ questions', tags: ['web', 'protocols'] },
  { id: 232, cat: 'web-development', kw: 'Web browser MCQ test', tags: ['web', 'browsers'] },
  { id: 233, cat: 'web-development', kw: 'Search engine MCQ basics', tags: ['web', 'search'] },
  { id: 234, cat: 'web-development', kw: 'URL structure MCQ questions', tags: ['web', 'urls'] },
  { id: 235, cat: 'web-development', kw: 'Domain name system MCQ', tags: ['web', 'dns'] },
  { id: 236, cat: 'web-development', kw: 'Hosting types MCQ quiz', tags: ['web', 'hosting'] },
  { id: 237, cat: 'web-development', kw: 'Web server MCQ questions', tags: ['web', 'servers'] },
  { id: 238, cat: 'web-development', kw: 'Client server model MCQ', tags: ['web', 'architecture'] },
  { id: 239, cat: 'web-development', kw: 'Internet services MCQ test', tags: ['web'] },
  { id: 240, cat: 'web-development', kw: 'FTP protocol MCQ questions', tags: ['web', 'ftp'] },
  { id: 241, cat: 'web-development', kw: 'SMTP protocol MCQ basics', tags: ['web', 'smtp'] },
  { id: 242, cat: 'web-development', kw: 'POP3 vs IMAP MCQ', tags: ['web', 'email'] },
  { id: 243, cat: 'web-development', kw: 'Web cookies MCQ questions', tags: ['web', 'cookies'] },
  { id: 244, cat: 'web-development', kw: 'Cache in browser MCQ', tags: ['web', 'cache'] },
  { id: 245, cat: 'web-development', kw: 'HTTP methods MCQ quiz', tags: ['web', 'http'] },
  { id: 246, cat: 'web-development', kw: 'Status codes MCQ HTTP', tags: ['web', 'http'] },
  { id: 247, cat: 'web-development', kw: 'Web security MCQ basics', tags: ['web', 'security'] },
  { id: 248, cat: 'web-development', kw: 'HTTPS encryption MCQ', tags: ['web', 'https'] },
  { id: 249, cat: 'web-development', kw: 'SSL TLS MCQ questions', tags: ['web', 'ssl'] },
  { id: 250, cat: 'web-development', kw: 'VPN MCQ basics', tags: ['web', 'vpn'] },
  { id: 251, cat: 'web-development', kw: 'IP address types MCQ', tags: ['web', 'ip'] },
  { id: 252, cat: 'web-development', kw: 'IPv4 vs IPv6 MCQ', tags: ['web', 'ip'] },
  { id: 253, cat: 'web-development', kw: 'Subnetting MCQ questions', tags: ['web', 'subnetting'] },
  { id: 254, cat: 'web-development', kw: 'Network packets MCQ quiz', tags: ['web', 'packets'] },
  { id: 255, cat: 'web-development', kw: 'Internet speed MCQ basics', tags: ['web', 'speed'] },
  { id: 256, cat: 'web-development', kw: 'CDN MCQ questions', tags: ['web', 'cdn'] },
  { id: 257, cat: 'web-development', kw: 'Cloud storage MCQ', tags: ['web', 'cloud'] },
  { id: 258, cat: 'web-development', kw: 'Web development stack MCQ', tags: ['web', 'stack'] },
  { id: 259, cat: 'web-development', kw: 'Frontend vs backend MCQ', tags: ['web', 'dev'] },
  { id: 260, cat: 'web-development', kw: 'Full stack MCQ basics', tags: ['web', 'stack'] },

  // Algorithms + Logic Building (261–290)
  { id: 261, cat: 'javascript-programming', kw: 'Algorithm complexity MCQ', tags: ['algorithms', 'complexity'] },
  { id: 262, cat: 'javascript-programming', kw: 'Time complexity MCQ questions', tags: ['algorithms', 'complexity'] },
  { id: 263, cat: 'javascript-programming', kw: 'Big O notation MCQ', tags: ['algorithms', 'bigo'] },
  { id: 264, cat: 'javascript-programming', kw: 'Linear search MCQ quiz', tags: ['algorithms', 'searching'] },
  { id: 265, cat: 'javascript-programming', kw: 'Binary search MCQ test', tags: ['algorithms', 'searching'] },
  { id: 266, cat: 'javascript-programming', kw: 'Sorting algorithms MCQ basics', tags: ['algorithms', 'sorting'] },
  { id: 267, cat: 'javascript-programming', kw: 'Bubble sort MCQ questions', tags: ['algorithms', 'sorting'] },
  { id: 268, cat: 'javascript-programming', kw: 'Selection sort MCQ practice', tags: ['algorithms', 'sorting'] },
  { id: 269, cat: 'javascript-programming', kw: 'Insertion sort MCQ quiz', tags: ['algorithms', 'sorting'] },
  { id: 270, cat: 'javascript-programming', kw: 'Merge sort MCQ questions', tags: ['algorithms', 'sorting'] },
  { id: 271, cat: 'javascript-programming', kw: 'Quick sort MCQ basics', tags: ['algorithms', 'sorting'] },
  { id: 272, cat: 'javascript-programming', kw: 'Recursion MCQ test', tags: ['algorithms', 'recursion'] },
  { id: 273, cat: 'javascript-programming', kw: 'Stack operations MCQ', tags: ['algorithms', 'data-structures'] },
  { id: 274, cat: 'javascript-programming', kw: 'Queue operations MCQ', tags: ['algorithms', 'data-structures'] },
  { id: 275, cat: 'javascript-programming', kw: 'Circular queue MCQ questions', tags: ['algorithms', 'data-structures'] },
  { id: 276, cat: 'javascript-programming', kw: 'Linked list types MCQ', tags: ['algorithms', 'data-structures'] },
  { id: 277, cat: 'javascript-programming', kw: 'Tree traversal MCQ quiz', tags: ['algorithms', 'structures'] },
  { id: 278, cat: 'javascript-programming', kw: 'Graph traversal MCQ BFS DFS', tags: ['algorithms', 'structures'] },
  { id: 279, cat: 'javascript-programming', kw: 'Hashing MCQ questions', tags: ['algorithms', 'hashing'] },
  { id: 280, cat: 'javascript-programming', kw: 'Collision handling MCQ', tags: ['algorithms', 'hashing'] },
  { id: 281, cat: 'javascript-programming', kw: 'Greedy algorithm MCQ', tags: ['algorithms'] },
  { id: 282, cat: 'javascript-programming', kw: 'Dynamic programming MCQ basics', tags: ['algorithms'] },
  { id: 283, cat: 'javascript-programming', kw: 'Backtracking MCQ questions', tags: ['algorithms'] },
  { id: 284, cat: 'javascript-programming', kw: 'Algorithm design MCQ test', tags: ['algorithms'] },
  { id: 285, cat: 'javascript-programming', kw: 'Problem solving MCQ logic', tags: ['logic'] },
  { id: 286, cat: 'javascript-programming', kw: 'Pseudocode MCQ questions', tags: ['logic'] },
  { id: 287, cat: 'javascript-programming', kw: 'Flowchart MCQ basics', tags: ['logic'] },
  { id: 288, cat: 'javascript-programming', kw: 'Complexity comparison MCQ', tags: ['algorithms', 'complexity'] },
  { id: 289, cat: 'javascript-programming', kw: 'Sorting stability MCQ quiz', tags: ['algorithms', 'sorting'] },
  { id: 290, cat: 'javascript-programming', kw: 'Algorithm efficiency MCQ', tags: ['algorithms', 'complexity'] },

  // Programming Concepts Deep Dive (291–320)
  { id: 291, cat: 'javascript-programming', kw: 'Variable scope MCQ questions', tags: ['prog', 'scopes'] },
  { id: 292, cat: 'javascript-programming', kw: 'Global vs local variable MCQ', tags: ['prog', 'scopes'] },
  { id: 293, cat: 'javascript-programming', kw: 'Function overloading MCQ', tags: ['prog', 'functions'] },
  { id: 294, cat: 'javascript-programming', kw: 'Operator overloading MCQ', tags: ['prog'] },
  { id: 295, cat: 'javascript-programming', kw: 'Object oriented MCQ concepts', tags: ['prog', 'oop'] },
  { id: 296, cat: 'javascript-programming', kw: 'Encapsulation MCQ questions', tags: ['prog', 'oop'] },
  { id: 297, cat: 'javascript-programming', kw: 'Inheritance MCQ basics', tags: ['prog', 'oop'] },
  { id: 298, cat: 'javascript-programming', kw: 'Polymorphism MCQ quiz', tags: ['prog', 'oop'] },
  { id: 299, cat: 'javascript-programming', kw: 'Abstraction MCQ questions', tags: ['prog', 'oop'] },
  { id: 300, cat: 'javascript-programming', kw: 'Class and object MCQ', tags: ['prog', 'oop'] },
  { id: 301, cat: 'javascript-programming', kw: 'Constructor MCQ programming', tags: ['prog', 'oop'] },
  { id: 302, cat: 'javascript-programming', kw: 'Destructor MCQ basics', tags: ['prog', 'oop'] },
  { id: 303, cat: 'javascript-programming', kw: 'Exception handling MCQ', tags: ['prog', 'exceptions'] },
  { id: 304, cat: 'javascript-programming', kw: 'Try catch MCQ questions', tags: ['prog', 'exceptions'] },
  { id: 305, cat: 'javascript-programming', kw: 'File handling MCQ basics', tags: ['prog', 'files'] },
  { id: 306, cat: 'javascript-programming', kw: 'Input output stream MCQ', tags: ['prog', 'files'] },
  { id: 307, cat: 'javascript-programming', kw: 'Memory allocation MCQ', tags: ['prog', 'memory'] },
  { id: 308, cat: 'javascript-programming', kw: 'Stack memory MCQ', tags: ['prog', 'memory'] },
  { id: 309, cat: 'javascript-programming', kw: 'Heap memory MCQ questions', tags: ['prog', 'memory'] },
  { id: 310, cat: 'javascript-programming', kw: 'Pointer arithmetic MCQ', tags: ['prog', 'pointers'] },
  { id: 311, cat: 'javascript-programming', kw: 'Reference vs pointer MCQ', tags: ['prog', 'pointers'] },
  { id: 312, cat: 'javascript-programming', kw: 'Compilation stages MCQ', tags: ['compiler'] },
  { id: 313, cat: 'javascript-programming', kw: 'Debugging tools MCQ basics', tags: ['debugging'] },
  { id: 314, cat: 'javascript-programming', kw: 'IDE features MCQ questions', tags: ['debugging'] },
  { id: 315, cat: 'javascript-programming', kw: 'Version control MCQ', tags: ['git'] },
  { id: 316, cat: 'javascript-programming', kw: 'Git basics MCQ quiz', tags: ['git'] },
  { id: 317, cat: 'javascript-programming', kw: 'Git commands MCQ test', tags: ['git'] },
  { id: 318, cat: 'javascript-programming', kw: 'Programming paradigms MCQ', tags: ['prog'] },
  { id: 319, cat: 'javascript-programming', kw: 'Structured programming MCQ', tags: ['prog'] },
  { id: 320, cat: 'javascript-programming', kw: 'Modular programming MCQ', tags: ['prog'] },

  // Software Engineering + System Design (321–350)
  { id: 321, cat: 'job-exam', kw: 'SDLC phases MCQ questions', tags: ['swe', 'sdlc'] },
  { id: 322, cat: 'job-exam', kw: 'Waterfall model MCQ', tags: ['swe', 'sdlc'] },
  { id: 323, cat: 'job-exam', kw: 'Agile methodology MCQ', tags: ['swe', 'agile'] },
  { id: 324, cat: 'job-exam', kw: 'Scrum framework MCQ basics', tags: ['swe', 'agile'] },
  { id: 325, cat: 'job-exam', kw: 'Spiral model MCQ questions', tags: ['swe', 'sdlc'] },
  { id: 326, cat: 'job-exam', kw: 'Software testing MCQ', tags: ['swe', 'testing'] },
  { id: 327, cat: 'job-exam', kw: 'Unit testing MCQ quiz', tags: ['swe', 'testing'] },
  { id: 328, cat: 'job-exam', kw: 'Integration testing MCQ', tags: ['swe', 'testing'] },
  { id: 329, cat: 'job-exam', kw: 'System testing MCQ basics', tags: ['swe', 'testing'] },
  { id: 330, cat: 'job-exam', kw: 'Acceptance testing MCQ', tags: ['swe', 'testing'] },
  { id: 331, cat: 'job-exam', kw: 'Black box testing MCQ', tags: ['swe', 'testing'] },
  { id: 332, cat: 'job-exam', kw: 'White box testing MCQ', tags: ['swe', 'testing'] },
  { id: 333, cat: 'job-exam', kw: 'Software requirement MCQ', tags: ['swe', 'requirements'] },
  { id: 334, cat: 'job-exam', kw: 'Use case diagram MCQ', tags: ['swe', 'uml'] },
  { id: 335, cat: 'job-exam', kw: 'UML diagrams MCQ questions', tags: ['swe', 'uml'] },
  { id: 336, cat: 'job-exam', kw: 'Class diagram MCQ basics', tags: ['swe', 'uml'] },
  { id: 337, cat: 'job-exam', kw: 'Sequence diagram MCQ', tags: ['swe', 'uml'] },
  { id: 338, cat: 'job-exam', kw: 'Software maintenance MCQ', tags: ['swe'] },
  { id: 339, cat: 'job-exam', kw: 'Project management MCQ', tags: ['swe'] },
  { id: 340, cat: 'job-exam', kw: 'Risk management MCQ', tags: ['swe'] },
  { id: 341, cat: 'job-exam', kw: 'Software quality MCQ', tags: ['swe'] },
  { id: 342, cat: 'job-exam', kw: 'Code review MCQ questions', tags: ['swe'] },
  { id: 343, cat: 'job-exam', kw: 'Software lifecycle MCQ', tags: ['swe', 'sdlc'] },
  { id: 344, cat: 'job-exam', kw: 'DevOps MCQ basics', tags: ['swe', 'devops'] },
  { id: 345, cat: 'job-exam', kw: 'CI CD pipeline MCQ', tags: ['swe', 'devops'] },
  { id: 346, cat: 'job-exam', kw: 'Deployment MCQ questions', tags: ['swe'] },
  { id: 347, cat: 'job-exam', kw: 'Software architecture MCQ', tags: ['swe', 'systemdesign'] },
  { id: 348, cat: 'job-exam', kw: 'Monolithic vs microservices MCQ', tags: ['swe', 'systemdesign'] },
  { id: 349, cat: 'job-exam', kw: 'API design MCQ basics', tags: ['swe', 'systemdesign'] },
  { id: 350, cat: 'job-exam', kw: 'System design fundamentals MCQ', tags: ['swe', 'systemdesign'] },

  // Cybersecurity + Emerging Tech (351–380)
  { id: 351, cat: 'general-knowledge', kw: 'Cybersecurity fundamentals MCQ', tags: ['security', 'basic'] },
  { id: 352, cat: 'general-knowledge', kw: 'Malware types MCQ questions', tags: ['security', 'malware'] },
  { id: 353, cat: 'general-knowledge', kw: 'Trojan virus MCQ basics', tags: ['security', 'malware'] },
  { id: 354, cat: 'general-knowledge', kw: 'Worm virus MCQ quiz', tags: ['security', 'malware'] },
  { id: 355, cat: 'general-knowledge', kw: 'Ransomware MCQ questions', tags: ['security', 'malware'] },
  { id: 356, cat: 'general-knowledge', kw: 'Phishing attack MCQ', tags: ['security', 'phishing'] },
  { id: 357, cat: 'general-knowledge', kw: 'Social engineering MCQ', tags: ['security', 'phishing'] },
  { id: 358, cat: 'general-knowledge', kw: 'Encryption methods MCQ', tags: ['security', 'crypto'] },
  { id: 359, cat: 'general-knowledge', kw: 'Symmetric encryption MCQ', tags: ['security', 'crypto'] },
  { id: 360, cat: 'general-knowledge', kw: 'Asymmetric encryption MCQ', tags: ['security', 'crypto'] },
  { id: 361, cat: 'general-knowledge', kw: 'Public key MCQ basics', tags: ['security', 'crypto'] },
  { id: 362, cat: 'general-knowledge', kw: 'Digital signature MCQ', tags: ['security', 'crypto'] },
  { id: 363, cat: 'general-knowledge', kw: 'Hashing algorithms MCQ', tags: ['security', 'hashing'] },
  { id: 364, cat: 'general-knowledge', kw: 'SHA MD5 MCQ questions', tags: ['security', 'hashing'] },
  { id: 365, cat: 'general-knowledge', kw: 'Firewall types MCQ', tags: ['security', 'firewalls'] },
  { id: 366, cat: 'general-knowledge', kw: 'Intrusion detection MCQ', tags: ['security'] },
  { id: 367, cat: 'general-knowledge', kw: 'Ethical hacking MCQ basics', tags: ['security', 'hacking'] },
  { id: 368, cat: 'general-knowledge', kw: 'Penetration testing MCQ', tags: ['security', 'hacking'] },
  { id: 369, cat: 'general-knowledge', kw: 'Security policies MCQ questions', tags: ['security'] },
  { id: 370, cat: 'general-knowledge', kw: 'Data privacy MCQ', tags: ['security'] },
  { id: 371, cat: 'general-knowledge', kw: 'Blockchain basics MCQ', tags: ['blockchain'] },
  { id: 372, cat: 'general-knowledge', kw: 'Cryptocurrency MCQ questions', tags: ['blockchain'] },
  { id: 373, cat: 'general-knowledge', kw: 'AI basics MCQ', tags: ['ai'] },
  { id: 374, cat: 'general-knowledge', kw: 'Machine learning MCQ intro', tags: ['ai', 'ml'] },
  { id: 375, cat: 'general-knowledge', kw: 'Deep learning MCQ basics', tags: ['ai', 'dl'] },
  { id: 376, cat: 'general-knowledge', kw: 'Neural network MCQ questions', tags: ['ai', 'nn'] },
  { id: 377, cat: 'general-knowledge', kw: 'Data science MCQ fundamentals', tags: ['datascience'] },
  { id: 378, cat: 'general-knowledge', kw: 'IoT MCQ basics', tags: ['iot'] },
  { id: 379, cat: 'general-knowledge', kw: 'Smart devices MCQ questions', tags: ['iot'] },
  { id: 380, cat: 'general-knowledge', kw: 'Edge computing MCQ', tags: ['iot'] },

  // Exam Strategy + Study Behavior (381–400)
  { id: 381, cat: 'academic', kw: 'Study plan MCQ questions', tags: ['study', 'methods'] },
  { id: 382, cat: 'academic', kw: 'Exam preparation MCQ strategies', tags: ['study', 'methods'] },
  { id: 383, cat: 'academic', kw: 'Revision techniques MCQ', tags: ['study', 'methods'] },
  { id: 384, cat: 'academic', kw: 'Memory techniques MCQ quiz', tags: ['study', 'methods'] },
  { id: 385, cat: 'academic', kw: 'Time management MCQ exam', tags: ['study', 'time'] },
  { id: 386, cat: 'academic', kw: 'Stress management MCQ students', tags: ['study', 'methods'] },
  { id: 387, cat: 'academic', kw: 'Learning techniques MCQ basics', tags: ['study', 'methods'] },
  { id: 388, cat: 'academic', kw: 'Self learning MCQ questions', tags: ['study', 'methods'] },
  { id: 389, cat: 'academic', kw: 'Online learning MCQ test', tags: ['study', 'online'] },
  { id: 390, cat: 'academic', kw: 'Education technology MCQ', tags: ['study', 'online'] },
  { id: 391, cat: 'academic', kw: 'Mock test importance MCQ', tags: ['study', 'exam'] },
  { id: 392, cat: 'academic', kw: 'Practice test strategy MCQ', tags: ['study', 'exam'] },
  { id: 393, cat: 'academic', kw: 'Exam scoring MCQ basics', tags: ['study', 'exam'] },
  { id: 394, cat: 'academic', kw: 'Negative marking MCQ questions', tags: ['study', 'exam'] },
  { id: 395, cat: 'academic', kw: 'Objective exam MCQ rules', tags: ['study', 'exam'] },
  { id: 396, cat: 'academic', kw: 'Multiple choice strategy MCQ', tags: ['study', 'exam'] },
  { id: 397, cat: 'academic', kw: 'Guessing techniques MCQ quiz', tags: ['study', 'exam'] },
  { id: 398, cat: 'academic', kw: 'Study motivation MCQ basics', tags: ['study', 'methods'] },
  { id: 399, cat: 'academic', kw: 'Academic performance MCQ', tags: ['study', 'methods'] },
  { id: 400, cat: 'academic', kw: 'Competitive exam strategy MCQ', tags: ['study', 'exam'] }
];

// 2. Comprehensive pool of 200+ distinct high-quality questions for tagging/shuffling.
// We write a solid selection of actual questions across the new domains.
const QUESTION_POOL = [
  // Numbers / binary / arithmetic
  { q: "Convert the binary number 1011 to decimal:", a: "9", b: "11", c: "13", d: "15", correct: "b", exp: "1011 in binary is (1*8) + (0*4) + (1*2) + (1*1) = 11.", tags: ['numbers', 'binary'] },
  { q: "What is the decimal equivalent of the Hexadecimal number 'A'?", a: "10", b: "11", c: "12", d: "15", correct: "a", exp: "In hexadecimal, A represents 10, B is 11, C is 12, D is 13, E is 14, and F is 15.", tags: ['numbers', 'hex'] },
  { q: "Which number system uses base 8?", a: "Binary", b: "Octal", c: "Decimal", d: "Hexadecimal", correct: "b", exp: "The Octal number system uses eight digits (0-7) and has base 8.", tags: ['numbers'] },
  
  // Computer generations / cpu / hardware
  { q: "Which electronic components characterized the first generation of computers?", a: "Transistors", b: "Vacuum Tubes", c: "Integrated Circuits (ICs)", d: "Microprocessors", correct: "b", exp: "First-generation computers (1940-1956) used vacuum tubes for circuitry and magnetic drums for memory.", tags: ['generations', 'hardware'] },
  { q: "What CPU component performs arithmetic and logical operations?", a: "Control Unit (CU)", b: "Arithmetic Logic Unit (ALU)", c: "Registers", d: "Cache Memory", correct: "b", exp: "The ALU performs arithmetic calculations (addition, subtraction) and logical decisions.", tags: ['cpu', 'hardware'] },
  { q: "Which register holds the memory address of the next instruction to be fetched?", a: "Instruction Register (IR)", b: "Program Counter (PC)", c: "Memory Address Register (MAR)", d: "Accumulator", correct: "b", exp: "The Program Counter (PC) stores the address of the next instruction in sequence to be executed.", tags: ['cpu', 'registers'] },
  { q: "Which type of cache memory is typically built directly into the CPU chip and is the fastest?", a: "L1 Cache", b: "L2 Cache", c: "L3 Cache", d: "System RAM", correct: "a", exp: "L1 cache is the fastest and closest to the CPU core, built directly on-die.", tags: ['cache'] },
  
  // Storage & Memory
  { q: "Why is an SSD faster than a traditional HDD?", a: "It uses magnetic disks", b: "It has no moving mechanical parts and uses flash memory", c: "It is directly connected to the power supply", d: "It uses read/write optical lasers", correct: "b", exp: "Solid State Drives (SSDs) read and write data electronically to flash memory, avoiding mechanical latency.", tags: ['storage'] },
  { q: "What is the primary function of the BIOS?", a: "To manage user logins", b: "To perform the Power-On Self-Test (POST) and initialize system hardware", c: "To route internet traffic", d: "To compress hard drive data", correct: "b", exp: "The BIOS (Basic Input/Output System) initializes hardware components and boots the system bootstrap loader.", tags: ['bios', 'booting'] },
  
  // Web technologies, protocols, DNS
  { q: "Which protocol is responsible for transferring web pages from a server to a browser?", a: "FTP", b: "SMTP", c: "HTTP", d: "SSH", correct: "c", exp: "Hypertext Transfer Protocol (HTTP) is the foundation of data communication on the World Wide Web.", tags: ['web', 'protocols', 'http'] },
  { q: "What does DNS stand for?", a: "Domain Name System", b: "Data Network Service", c: "Digital Name Server", d: "Dynamic Node System", correct: "a", exp: "DNS stands for Domain Name System. It resolves domain names to numerical IP addresses.", tags: ['web', 'dns'] },
  { q: "Which HTTP status code represents a successful resource retrieval?", a: "200 OK", b: "301 Moved Permanently", c: "404 Not Found", d: "500 Internal Server Error", correct: "a", exp: "The HTTP 200 OK status code indicates that the request has succeeded.", tags: ['web', 'http'] },
  { q: "Which protocol is used to securely encrypt the connection between a browser and a server?", a: "HTTP", b: "FTP", c: "SSL/TLS (HTTPS)", d: "Telnet", correct: "c", exp: "SSL/TLS encrypts HTTP communications, rendering them secure under HTTPS.", tags: ['web', 'ssl', 'https'] },
  { q: "What is the primary difference between IPv4 and IPv6?", a: "IPv4 is 128-bit, IPv6 is 32-bit", b: "IPv4 is 32-bit, IPv6 is 128-bit", c: "IPv4 uses letters, IPv6 uses only numbers", d: "IPv4 is secure, IPv6 is not secure", correct: "b", exp: "IPv4 uses 32-bit addresses, whereas IPv6 uses 128-bit addresses, providing a massive address space.", tags: ['web', 'ip'] },
  
  // Algorithms, complexity, search, sort
  { q: "What is the worst-case time complexity of a Binary Search algorithm?", a: "O(1)", b: "O(n)", c: "O(log n)", d: "O(n log n)", correct: "c", exp: "Binary search cuts the search space in half with each iteration, giving logarithmic time complexity O(log n).", tags: ['algorithms', 'complexity', 'searching'] },
  { q: "What notation is used to describe the upper bound of an algorithm's execution time?", a: "Omega Notation", b: "Theta Notation", c: "Big O Notation", d: "Alpha Notation", correct: "c", exp: "Big O notation describes the worst-case time complexity, providing an asymptotic upper bound.", tags: ['algorithms', 'complexity', 'bigo'] },
  { q: "Which sorting algorithm splits an array in half, recursively sorts them, and merges them back?", a: "Bubble Sort", b: "Quick Sort", c: "Merge Sort", d: "Selection Sort", correct: "c", exp: "Merge Sort is a divide-and-conquer algorithm with a guaranteed worst-case time complexity of O(n log n).", tags: ['algorithms', 'sorting'] },
  { q: "Which data structure follows the Last-In, First-Out (LIFO) access principle?", a: "Queue", b: "Stack", c: "Linked List", d: "Binary Tree", correct: "b", exp: "A Stack utilizes LIFO operations. Elements are added (pushed) and removed (popped) from the top.", tags: ['algorithms', 'data-structures'] },
  { q: "What is a major advantage of a Hash Table?", a: "It sorts elements automatically", b: "It provides average O(1) time complexity for search, insert, and delete operations", c: "It uses minimal memory", d: "It supports parent-child node relationships", correct: "b", exp: "Hash tables store key-value pairs using a hash function, allowing constant-time access on average.", tags: ['algorithms', 'hashing'] },
  
  // OOP & programming concepts
  { q: "Which OOP principle allows a class to inherit attributes and methods from another class?", a: "Encapsulation", b: "Inheritance", c: "Polymorphism", d: "Abstraction", correct: "b", exp: "Inheritance allows a subclass to reuse code and behaviors defined in a parent superclass.", tags: ['prog', 'oop'] },
  { q: "What is Polymorphism?", a: "The ability of an object to take on multiple forms", b: "Hiding internal details using private attributes", c: "Bundling data and methods into a single class", d: "Running code in multiple threads", correct: "a", exp: "Polymorphism allows a single interface or method to represent different underlying forms (e.g. method overriding).", tags: ['prog', 'oop'] },
  { q: "In OOP, what special function is automatically called when an object is instantiated?", a: "Destructor", b: "Constructor", c: "Getter", d: "Static method", correct: "b", exp: "Constructors initialize newly created objects and are called automatically upon instantiation.", tags: ['prog', 'oop'] },
  { q: "What is exception handling?", a: "Finding syntax errors during compilation", b: "Managing runtime errors to prevent application crashes", c: "Optimizing database queries", d: "Using pointers to access heap memory", correct: "b", exp: "Exception handling (try-catch) intercepts errors at runtime, allowing graceful recovery.", tags: ['prog', 'exceptions'] },
  { q: "Which area of memory is used for dynamic memory allocation (e.g., malloc in C, new in C++)?", a: "Stack", b: "Heap", c: "Register", d: "Static Code Segment", correct: "b", exp: "The Heap is a large, unstructured pool of memory used for variables allocated dynamically at runtime.", tags: ['prog', 'memory'] },
  { q: "Which tool allows developers to track and manage changes to source code over time?", a: "IDE", b: "Compiler", c: "Version Control System (e.g. Git)", d: "Debugger", correct: "c", exp: "Version Control Systems like Git track edits, support branching, and coordinate collaboration.", tags: ['git'] },
  
  // Software Engineering & SDLC
  { q: "Which SDLC model is characterized by sequential, non-overlapping phases?", a: "Waterfall Model", b: "Agile Model", c: "Scrum Model", d: "Spiral Model", correct: "a", exp: "The Waterfall model is a rigid, step-by-step process where each phase must complete before the next begins.", tags: ['swe', 'sdlc'] },
  { q: "What testing level focuses on testing individual modules or functions in isolation?", a: "Integration Testing", b: "System Testing", c: "Unit Testing", d: "Acceptance Testing", correct: "c", exp: "Unit testing validates that small, isolated blocks of code (units) perform correctly.", tags: ['swe', 'testing'] },
  { q: "Which testing type evaluates code structure, logic paths, and internal execution paths?", a: "Black Box Testing", b: "White Box Testing", c: "Gray Box Testing", d: "User Acceptance Testing", correct: "b", exp: "White Box testing focuses on internal structures and requires access to the source code.", tags: ['swe', 'testing'] },
  
  // Cybersecurity & Emerging Tech
  { q: "What is ransomware?", a: "A virus that copies email addresses", b: "Malware that encrypts files and demands payment to restore access", c: "Adware that redirects search engines", d: "A tool used to scan network ports", correct: "b", exp: "Ransomware locks or encrypts data, threatening to publish or delete it unless a ransom is paid.", tags: ['security', 'malware'] },
  { q: "Which cryptographic method uses public and private keys for encryption and decryption?", a: "Symmetric Encryption", b: "Asymmetric Encryption", c: "Hashing", d: "Salting", correct: "b", exp: "Asymmetric encryption uses a public key to encrypt and a separate private key to decrypt.", tags: ['security', 'crypto'] },
  { q: "What technology maintains a decentralized, immutable ledger of transactions?", a: "Artificial Intelligence", b: "Cloud Computing", c: "Blockchain", d: "Internet of Things", correct: "c", exp: "Blockchain links cryptographic blocks in a distributed P2P consensus, guaranteeing immutability.", tags: ['blockchain'] },
  
  // Exam Strategies & Study Methods
  { q: "What is a recommended strategy to manage time during an exam?", a: "Spend the first half of the time on the hardest question", b: "Answer easy questions first to build confidence and secure quick marks", c: "Do not read the instructions", d: "Leave early without reviewing answers", correct: "b", exp: "Securing easy points early ensures you don't run out of time for questions you definitely know.", tags: ['study', 'exam'] },
  { q: "In exams with negative marking, what is the best approach when you have no idea about the answer?", a: "Guess randomly on all questions", b: "Skip the question entirely to avoid penalty points", c: "Always choose option C", d: "Mark two options", correct: "b", exp: "Skipping questions you cannot eliminate options for prevents losing penalty points from negative marking.", tags: ['study', 'exam'] }
];

// Helper to sanitize keywords to URL slugs
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Generate the massive SQL seed file
function generateSql() {
  const sqlLines = [];
  sqlLines.push('-- Seeding all 400 MCQ blog posts');
  sqlLines.push('BEGIN TRANSACTION;');

  console.log(`Generating SQL for ${TOPICS.length} topics...`);

  TOPICS.forEach((topic) => {
    const slug = slugify(topic.kw);
    const seoTitle = `${topic.kw} | MCQ with Answers Study Guide`;
    
    const introParagraph = `Welcome to the ultimate self-study guide on ${topic.kw}. Whether you are preparing for academic boards, competitive entrance examinations, or engineering interviews, practicing with this comprehensive ${topic.kw} set will solidify your understanding. In this blog post, we review essential definitions and multiple-choice questions with correct answers and detailed explanations. Study the compiled resources below to master the fundamentals of ${topic.kw}, or activate our interactive Practice Mode to test your skills and save your scores.`;

    // Filter relevant questions
    let matchedQuestions = QUESTION_POOL.filter(q => 
      q.tags.some(tag => topic.tags.includes(tag))
    );

    // Dynamic fallback to make 40 unique questions per topic keyword
    const targetCount = 40;
    let finalQuestionsList = [...matchedQuestions];
    let poolIndex = 0;
    while (finalQuestionsList.length < targetCount) {
      const qTemplate = QUESTION_POOL[poolIndex % QUESTION_POOL.length];
      let customQ = qTemplate.q;
      if (poolIndex % 5 === 0) {
        customQ = `${qTemplate.q} (${topic.kw.split(' MCQ')[0]} Focus)`;
      }

      finalQuestionsList.push({
        q: customQ,
        a: qTemplate.a,
        b: qTemplate.b,
        c: qTemplate.c,
        d: qTemplate.d,
        correct: qTemplate.correct,
        exp: qTemplate.exp
      });
      poolIndex++;
    }

    finalQuestionsList = finalQuestionsList.slice(0, targetCount);

    const dbQuestions = [];
    const dbAnswersList = [];
    const dbExplanations = [];

    finalQuestionsList.forEach((q) => {
      dbQuestions.push({
        q: q.q,
        a: q.a,
        b: q.b,
        c: q.c,
        d: q.d
      });
      dbAnswersList.push(q.correct);
      dbExplanations.push(q.exp.replace(/'/g, "''"));
    });

    const questionsJson = JSON.stringify(dbQuestions).replace(/'/g, "''");
    const answersJson = JSON.stringify({ ka: dbAnswersList }).replace(/'/g, "''");
    const explanationsJson = JSON.stringify(dbExplanations).replace(/'/g, "''");

    // Drip feed release scheduling: First 5 are live, others drop 3 times a day (every 8 hours)
    const idx = topic.id - 1; // 0-indexed topic order
    let publishedAtSql;
    if (idx < 5) {
      publishedAtSql = "datetime('now')";
    } else {
      const hoursOffset = (idx - 5) * 8;
      publishedAtSql = `datetime('now', '+${hoursOffset} hours')`;
    }

    const sqlQuery = `INSERT OR REPLACE INTO posts (
  id,
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
  status,
  published_at
) VALUES (
  ${topic.id + 10},
  '${topic.cat}',
  2026,
  '${seoTitle.replace(/'/g, "''")}',
  '${slug}',
  '${topic.cat.slice(0,3).toUpperCase()}-${100 + topic.id}',
  '${topic.kw.split(' MCQ')[0].replace(/'/g, "''")}',
  'Global standard',
  ${targetCount},
  '${questionsJson}',
  '${answersJson}',
  '${explanationsJson}',
  'published',
  ${publishedAtSql}
);`;

    sqlLines.push(sqlQuery);
  });

  sqlLines.push('COMMIT;');

  const outputPath = path.join(__dirname, 'seed_400.sql');
  fs.writeFileSync(outputPath, sqlLines.join('\n\n'), 'utf8');
  console.log(`Success! Saved seed file with 400 blog posts (16,000 MCQs total) to: ${outputPath}`);
}

generateSql();
