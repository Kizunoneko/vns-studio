# 视觉小说编辑器 · VNS Studio

一个**单文件**的网页版视觉小说 / 互动游戏编辑器。不需要安装、不需要服务器，打开 `index.html` 就能用；作品可以导出成一张独立的 HTML 分发给任何人。

- 在线试玩（GitHub Pages）：**https://kizunoneko.github.io/vns-studio/**
- 作者：@Teasssss
- 辅助制作工具：DeepSeek
- 当前版本：**v6.0.3**

---

## 快速开始

1. 下载 `index.html`
2. 双击用浏览器打开（推荐 Chrome / Edge / Safari 最新版）
3. 首次进入会询问「字体风格 + 起始内容」，选 **互动游戏示例** 或 **视觉小说示例** 即可直接试玩

也可以直接访问在线版：https://kizunoneko.github.io/vns-studio/

## 主要功能

### 剧本
- 类 Ren'Py 的轻量语法：`@bg` `@show` `@bgm` `@wait` `@jump` `@check` …
- 语法高亮、行号、条目化编辑、按节点编辑、撤销 / 重做
- **选中即预览**：点条目 / 文本行 / 素材卡片，舞台立刻刷新到那一句

### 素材
- 角色立绘（含表情与说话差分）、背景、CG、拼接场景
- 支持 **GIF / APNG / 动态 WebP**
- 互动场景制作器：拖框画可点区域，自动生成剧本分支

### 演出
- 对话框位置（上 / 中 / 下）、隐藏对话框、打字机效果、文字颜色与抖动特效
- 自定义对话框外观（CSS 模板 + 实时预览）
- 致谢表：4 种排版 + 固定制作工具条目
- 四套界面主题（像素 / 深夜 / 纸片 / 赛博）+ 自定义 CSS

### 发布
- **🎬 开始界面**：可开关的封面，标题 / 背景 / 按钮全部可自定义，按钮支持图片（常态 + 按下）
- **💾 存档**：3 个档位，保存场景、立绘、变量、物品
- **📖 对话历史**：最多记录 400 句
- 导出工程 JSON / 导出可玩游戏 HTML / 导出视频（webm）

### 音频
- BGM / 音效，支持音量、淡入、循环与停止
- 播放器内可一键静音
- 音频库带进度条，可播放 / 暂停 / 跳转试听

## 语法速查

```text
@bg 教室                切换背景（fade / black）
@cg 告白                显示 CG
@show 小明 左 微笑      立绘登场（位置 / 表情）
@hide 小明 / @hideall
@bgm 曲名 0.5 fade 2    背景音乐（音量 / 淡入秒数）
@sfx 开门               音效
@dialogpos top          对话框位置
@dialogbox off          只留文字
@textcolor #ff6b6b      文字颜色
@fx screen-shake on 800 特效
@wait                   等待点击
@get 钥匙 / @has 钥匙 -> door_open
@check 密码 == 1234 -> ok
@jump 标签名 / @end 结局

小明: 台词内容
小明[微笑]: 带表情的台词
这是一行旁白
- 选项 A -> 标签1
```

## 本地使用

整个工具就是一个 HTML 文件，没有构建步骤：

```bash
git clone https://github.com/Kizunoneko/vns-studio.git
cd vns-studio
# 直接双击 index.html，或起一个静态服务器：
npx serve .
```

## 在线版部署

仓库根目录的 `index.html` 就是可玩的在线版。在仓库 **Settings → Pages** 里选择 `main` 分支根目录，即可得到 https://kizunoneko.github.io/vns-studio/ 。

## 许可

代码可自由使用与修改；如需商用或二次分发，请保留「关于作者」中的署名。
