# Answer Me

一个互动音频播放器，包含4个可点击的方块按钮。

## 功能特性

- 浅黄色背景设计
- 4个互动方块按钮：
  - 回答我
  - look in my eyes
  - tell me why?
  - 能能能
- 点击播放对应音频文件
- 响应式设计，支持移动设备

## 开发

首先安装依赖：

```bash
npm install
```

然后运行开发服务器：

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 音频文件

将音频文件放置在 `public/audio/` 目录下，并更新 `src/app/page.tsx` 中的 `audioSrc` 路径。

## 构建

```bash
npm run build
npm start
```