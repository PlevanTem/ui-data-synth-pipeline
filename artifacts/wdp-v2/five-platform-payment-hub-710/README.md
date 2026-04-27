# Case: five-platform-payment-hub-710

**来源**：用户 query（index 710）— 单页 HTML5：美团 / 京东 / 拼多多 / 滴滴 / 携程 五合一支付前台模板，文档体说明与六类订单—支付能力矩阵。

## 本地预览

在 **`02-build/`** 启动静态服务：

```bash
cd artifacts/wdp-v2/five-platform-payment-hub-710/02-build
python -m http.server 8765
```

浏览器打开：`http://127.0.0.1:8765/`

## 摘要

- **权威设计**：`01-brief/design-brief.md`
- **交付物**：`02-build/index.html`（Tailwind CDN + 原生 JS，单文件）
- **评估状态**：见 `03-eval/loop-state.json`

## 评估截图（备忘）

若 Cursor MCP `browser_take_screenshot` 超时或本机无法下载 Playwright 浏览器，可在联网环境执行 `npx playwright install chromium` 后，对 `http://127.0.0.1:<PORT>/` 使用 `npx playwright screenshot` 或测试用例自行导出 `03-eval/screenshots/`。
