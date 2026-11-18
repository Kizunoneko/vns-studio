/* 打包后给自己写图标 / 版本信息（绕过 winCodeSign 的符号链接权限问题） */
const path = require('path');
const fs = require('fs');

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== 'win32') return;
  const rcedit = require('rcedit');
  const appOutDir = context.appOutDir;
  const productName = context.packager.appInfo.productFilename; // 例如 "VNS Studio"
  const exePath = path.join(appOutDir, productName + '.exe');
  if (!fs.existsSync(exePath)) {
    console.log('[afterPack] 找不到 exe:', exePath);
    return;
  }
  const icon = path.join(__dirname, '..', 'build', 'icon.ico');
  const version = context.packager.appInfo.version;
  await rcedit(exePath, {
    icon: fs.existsSync(icon) ? icon : undefined,
    'file-version': version + '.0',
    'product-version': version,
    'version-string': {
      CompanyName: 'Teasssss',
      FileDescription: 'VNS Studio · 视觉小说编辑器',
      ProductName: 'VNS Studio',
      LegalCopyright: '© 2026 Teasssss',
      OriginalFilename: productName + '.exe'
    }
  });
  console.log('[afterPack] 已写入图标与版本信息:', productName + '.exe');
};
