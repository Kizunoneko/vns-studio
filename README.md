# 视觉小说编辑器 · VNS Studio

一个 **单文件** 的网页版视觉小说 / 互动游戏编辑器。不需要安装、不需要服务器，打开 `index.html` 就能用；作品可以导出成一张独立的 HTML 分发。

- 在线版（GitHub Pages）：**https://kizunoneko.github.io/vns-studio/**
- 桌面版（Windows 安装包）：**[downloads/VNS-Studio-Setup-7.2.0.exe](downloads/VNS-Studio-Setup-7.2.0.exe)**
- 作者：@Teasssss ｜ 辅助制作工具：Deepseek
- 当前版本：**v7.2**（2026-11-19）

---

## 快速开始

**网页版**

1. 打开 https://kizunoneko.github.io/vns-studio/ （或下载 `index.html` 双击打开）
2. 首次进入会让你选「字体风格 + 起始内容」，选 **互动游戏示例** 或 **视觉小说示例** 可以直接试玩
3. 改坏了不要紧：设置 → 📖 示例剧本，随时拉回来

**桌面版（Windows）**

1. 下载 [VNS-Studio-Setup-7.2.0.exe](downloads/VNS-Studio-Setup-7.2.0.exe)
2. 双击安装（装到当前用户目录，不需要管理员；未签名，首次运行点「更多信息 → 仍要运行」）
3. 桌面 / 开始菜单会出现「VNS Studio」

---

## 主要功能

### 剧本与编辑器
- 类 Ren'Py 的轻量语法：`@bg` `@cg` `@show` `@hide` `@bgm` `@sfx` `@wait` `@jump` `@label` `@get` `@give` `@use` `@set` `@add` `@check` `@input` `@textcolor` `@fx` `@timer` `@when` `@only` `@hideall` `@end` 等
- 文本编辑 / 条目编辑 / 按节点编辑 三种视图，实时高亮
- 快捷插入面板（台词、立绘、选项、特效、角色显隐…），插入前有左侧预览
- 撤销 / 重做（最近 5 次）、从光标处开始播放

### 素材
- 背景 / CG 分开管理；CG 默认隐藏立绘
- 素材面板支持搜索、筛选（已关联 / 未关联 / 有热点 / 未使用）、按名称或使用次数排序
- CG 按关联角色分组；一键把 CG 加成该角色的表情差分
- 角色立绘 + 表情差分 + 说话差分；批量导入会先列出名字再入库
- 互动场景制作器：拖框画热点，自动生成可跑的标签骨架

### 流程图
- 程序框图式：开始 → 剧情框 → 菱形判定 → 六边形选项
- 节点可拖动、可标注、可拖 ⇢ 连线；未接入的分支会标「⚠ 未接入」并可一键接上
- 「⛶ 独立窗口」可开第二个窗口看流程图（可编辑），窗口内支持拖动平移、滚轮/双指缩放
- 点节点编辑整段分支；点六边形只编辑选项部分

### 演出与导出
- 选项限时（`@timer`）、条件跳转（`@check` / `@when` / `@has`）
- 热点触发次数、需要道具、地点提示
- 玩家侧：存档 / 对话历史 / 设置面板（音量、静音、音频诊断）
- 开始界面（封面、标题、按钮自定义）、结局判定、片尾致谢
- 导出：**独立 HTML 游戏**、工程 JSON、选择项导出、录制视频

---

## 桌面版额外说明

- **自动更新**：启动 6 秒后静默检查（6 小时内不重复）；发现新版本会弹窗，「立即更新」会自动下载并拉起安装程序。菜单 **帮助 → 检查更新…** 可手动检查。
- 更新源：`update.json`（随网页版一起发布）
- 数据目录：`%APPDATA%\vns-studio`（菜单 **帮助 → 数据目录** 直接打开）
- 网页版的历史数据不会自动迁移，用「导入」把工程 JSON 拉过来即可
- 导出工程 / 导出游戏会弹「另存为」；导出视频需要允许录制屏幕

### 自己打包

```powershell
# 需要 Node.js 20+
powershell -ExecutionPolicy Bypass -File .\release.ps1
```

脚本会：读版本号 → 同步 `desktop/app/index.html` → 生成图标 → 打包 NSIS 安装包 → 复制安装包到 `gitsite/downloads/` 并生成 `update.json` → 复制一份到桌面。打包完记得把 `gitsite` 推送上去。

桌面版源码在 [`desktop/`](desktop/)，细节见 [desktop/README.md](desktop/README.md)。

---

## 许可与致谢

- 本工具**免费开源**：如果你为它付过费，请立即退款并举报。
- 界面像素字体使用 [Zpix（最像素）](https://github.com/SolidZORO/zpix-pixel-font)，作者声明个人 / 教育免费、商业使用需授权——所以**没有**打进安装包，而是在线加载；离线时回落到系统等宽字体。想离线也有像素字体，把 `zpix.woff2` 放到 `desktop/app/fonts/` 后重新打包即可（请自行确认授权）。
- 感谢所有把故事讲完的人。
