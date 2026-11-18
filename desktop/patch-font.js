/* 把远程字体替换成本地文件（仅在 fonts/zpix.woff2 存在时调用） */
const fs = require('fs');
const p = 'desktop/app/index.html';
let t = fs.readFileSync(p, 'utf8');
const local = "@font-face{font-family:'Zpix';src:url('fonts/zpix.woff2') format('woff2');font-display:swap}";
t = t.replace(/@font-face\{font-family:'Zpix';[^}]*\}/, local);
fs.writeFileSync(p, t, 'utf8');
console.log('font -> local');
