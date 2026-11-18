const { app, BrowserWindow, session, dialog, Menu, desktopCapturer, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const SELFTEST = process.argv.includes('--selftest');
const APP_HTML = path.join(__dirname, 'app', 'index.html');

// 单实例：第二次启动时聚焦已有窗口
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
}

app.setAppUserModelId('com.teasssss.vnsstudio');

function buildMenu(win) {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '打开导出的工程（.json）…',
          accelerator: 'CmdOrCtrl+O',
          click: () => win.webContents.executeJavaScript(
            "(function(){var b=document.getElementById('btnImport');if(b)b.click();})()"
          )
        },
        {
          label: '打包导出工程…',
          accelerator: 'CmdOrCtrl+S',
          click: () => win.webContents.executeJavaScript(
            "(function(){var b=document.getElementById('btnExport');if(b)b.click();})()"
          )
        },
        { type: 'separator' },
        { role: 'quit', label: '退出' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectAll', label: '全选' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新载入' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '实际大小' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '数据目录（备份 / 存档）',
          click: () => shell.openPath(app.getPath('userData'))
        },
        {
          label: '关于 VNS Studio',
          click: () => {
            dialog.showMessageBox(win, {
              type: 'info',
              title: '关于 VNS Studio',
              message: 'VNS Studio',
              detail:
                '像素风视觉小说 / 互动游戏编辑器\n\n作者：@Teasssss\n辅助制作工具：Deepseek\n\n本作使用免费开源的工具制作 · 如你为此付费，请立即退款并举报',
              buttons: ['好']
            });
          }
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 640,
    backgroundColor: '#0a0a0e',
    title: 'VNS Studio',
    icon: path.join(__dirname, 'build', 'icon.ico'),
    show: !SELFTEST,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });

  // 流程图「独立窗口」：允许 window.open 打开新窗口
  win.webContents.setWindowOpenHandler(() => {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        width: 1280,
        height: 860,
        minWidth: 720,
        minHeight: 520,
        backgroundColor: '#08080c',
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'build', 'icon.ico'),
        webPreferences: { contextIsolation: true, nodeIntegration: false }
      }
    };
  });

  win.loadFile(APP_HTML);
  if (!SELFTEST) win.once('ready-to-show', () => win.show());

  win.webContents.on('did-finish-load', async () => {
    if (!SELFTEST) return;
    try {
      const info = await win.webContents.executeJavaScript(
        "(function(){var v=document.getElementById('aboutVer');return {ver:v?v.textContent:'none', chars:document.body?document.body.className:'', title:document.title};})()"
      );
      console.log('SELFTEST_OK ' + JSON.stringify(info));
    } catch (e) {
      console.log('SELFTEST_FAIL ' + e.message);
    }
    setTimeout(() => app.quit(), 300);
  });

  return win;
}

// 导出文件：弹出「另存为」，而不是静默存到下载目录
function setupDownloadHandler() {
  session.defaultSession.on('will-download', async (event, item) => {
    const name = item.getFilename() || 'export.bin';
    const ext = path.extname(name).replace('.', '').toLowerCase();
    const filters = ext === 'html' ? [{ name: '网页', extensions: ['html'] }]
      : ext === 'json' ? [{ name: '工程文件', extensions: ['json'] }]
      : ext === 'webm' ? [{ name: '视频', extensions: ['webm'] }]
      : [];
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: '保存导出文件',
      defaultPath: path.join(app.getPath('documents'), name),
      filters
    });
    if (canceled || !filePath) {
      item.cancel();
      return;
    }
    item.setSavePath(filePath);
  });
}

// 导出视频：允许录制屏幕
function setupCapture() {
  try {
    session.defaultSession.setDisplayMediaRequestHandler(async (request, callback) => {
      try {
        const sources = await desktopCapturer.getSources({ types: ['screen'] });
        callback({ video: sources[0], audio: 'loopback' });
      } catch (e) {
        callback({});
      }
    }, { useSystemPicker: false });
  } catch (e) {
    // 旧版 Electron 没有该 API 时忽略
  }
  session.defaultSession.setPermissionRequestHandler((wc, permission, cb) => cb(true));
}

app.whenReady().then(() => {
  setupDownloadHandler();
  setupCapture();
  const win = createWindow();
  buildMenu(win);

  app.on('second-instance', () => {
    const wins = BrowserWindow.getAllWindows();
    if (wins.length) {
      const w = wins[0];
      if (w.isMinimized()) w.restore();
      w.focus();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
