/* 从 VNS.new.html 读版本号并同步到 desktop/package.json */
const fs = require('fs');

const html = fs.readFileSync('VNS.new.html', 'utf8');
const m = html.match(/id="aboutVer"[^>]*>v([0-9.]+)</);
if (!m) {
  console.error('cannot read version from VNS.new.html');
  process.exit(1);
}
const parts = m[1].split('.');
while (parts.length < 3) parts.push('0');
const version = parts.slice(0, 3).join('.');

const pkgPath = 'desktop/package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.version = version;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('version -> ' + version);
