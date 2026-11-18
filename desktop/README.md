# VNS Studio · 桌面版（Electron）

## 结构

```
desktop/
  package.json        打包配置（版本号由 release.ps1 自动同步）
  main.js             主进程：窗口、菜单、另存为对话框、录屏权限
  app/index.html      应用本体（由 VNS.new.html 复制而来，请勿手改）
  app/fonts/          可选：放 zpix.woff2 后离线也有像素字体
  build/icon.ico      图标（由 make-icon.js 生成）
  scripts/afterPack.js 打包后写入图标与版本信息
  make-icon.js        生成 icon.ico
  sync-version.js     从 HTML 读版本号并写进 package.json
  patch-font.js       把远程字体换成本地文件
```

## 发布新版本

在项目根目录执行：

```powershell
powershell -ExecutionPolicy Bypass -File .\release.ps1
```

它会：

1. 从 `VNS.new.html` 读版本号（`v7.1` → `7.1.0`）并同步到 `package.json`
2. 复制 `VNS.new.html` → `desktop/app/index.html`
3. 生成图标
4. 打包 NSIS 安装包 → `release\VNS-Studio-Setup-x.y.z.exe`
5. 复制一份到桌面

网页版（VibeDrop / GitHub Pages）仍按原流程单独发布，两边共用同一份 `VNS.new.html`。

## 说明

- 安装包**未签名**，Windows 首次运行会提示“未知发布者”，点“更多信息 → 仍要运行”。
- 安装位置：`%LOCALAPPDATA%\Programs\VNS Studio`（当前用户，无需管理员）。
- 数据保存在 Electron 的 userData 目录：
  `%APPDATA%\vns-studio`（菜单「帮助 → 数据目录」可直接打开）。
  **浏览器版的数据不会自动迁移**，用「导入」把工程 JSON 拉过来即可。
- 字体默认走线上（jsDelivr）。想离线也用像素字体，把 `zpix.woff2` 放进
  `desktop/app/fonts/`，`release.ps1` 会自动改成本地引用。
- 导出工程 / 导出游戏会弹「另存为」；导出视频需允许录制屏幕（已在主进程放行）。
- 流程图「独立窗口」在桌面版是真正的第二个窗口，可拖到副屏。

## 开发调试

```powershell
cd desktop
npm start            # 直接运行
npm run selftest     # 无界面自检，打印版本号与页面标题
npm run dist         # 只打包
```
