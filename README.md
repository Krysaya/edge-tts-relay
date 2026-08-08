# 听读台 · edge-tts 中转后端

浏览器直连微软 edge-tts 会被主动拦截（与翻墙无关）。这个后端部署在海外服务器，由服务端调用 edge-tts 合成语音，再返回给前端，从而绕开拦截、做到**零密钥自然嗓音**。

## 前端怎么用
听读台「语音模式」选 **☁ 中转语音**，把部署后得到的中转地址（如 `https://xxx.vercel.app`）填到「中转地址」即可。地址只存在你浏览器本地。

## 部署方式（任选其一）

### 方式 A：Vercel 网页一键部署（最简单，免信用卡）
1. 把本 `relay/` 目录内容推到一个 GitHub 仓库（新建仓库，把这几个文件传上去）。
2. 打开 https://vercel.com ，用 GitHub 登录。
3. `Add New → Project`，导入刚才的仓库，直接 `Deploy`（不用改任何配置）。
4. 部署完得到地址，如 `https://edge-tts-relay-xxx.vercel.app`。把这个地址填进听读台即可。

### 方式 B：本地命令行部署
```bash
cd relay
npm install
npx vercel        # 按提示用浏览器登录，一路回车
```
部署成功会打印线上地址。

### 本地自测（不部署也能跑）
```bash
cd relay
npm install
node server.js    # 启动 http://localhost:3000
# 另开终端测试：
curl -X POST http://localhost:3000/api/tts \
  -H 'Content-Type: application/json' \
  -d '{"text":"你好，这是测试","voice":"zh-CN-XiaoxiaoNeural","rate":"+0%"}' \
  --output test.mp3
```
能生成 `test.mp3` 就说明链路通。

## 说明
- 中转地址只存浏览器本地，不上传任何服务器。
- Vercel 免费额度对个人听书足够；函数超时 10 秒，单段文本建议别太长（听读台已按段落切片）。
- Vercel 服务器在海外，你手机**翻墙**连它（正常 HTTPS）最稳；国内直连偶尔抽风时翻墙即可。
- 若某次合成失败，前端会自动回退系统嗓音；后端是独立请求，重试通常就好。
