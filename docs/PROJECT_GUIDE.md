# 課後：完整專案指南

如果你正在上課，先回 [學生首頁](../README.md)。這裡適合已完成課堂操作、想繼續讀完整應用的人。

## 選一個方向開始

| 目標 | 入口 |
|---|---|
| 先看整個系統怎麼連起來 | [架構導讀](01_FormosaX架構與程式碼導讀.md) |
| 找某個函式在哪裡 | [檔案與函式索引](02_全檔案與函式索引.md) |
| 搞懂餵價與清算 | [預言機原理速讀](ORACLE_EXPLAINED.md) |
| 知道目前有哪些限制 | [檢查報告](FINAL_REVIEW_1019.md) |

## 三個程式資料夾

- `workshop/`：課堂用的短合約與精簡 HTML／ethers 網頁。
- `onchain/`：完整智能合約、部署腳本、feeder、keeper 與本機測試。
- `frontend/`：完整 React／wagmi／viem 應用；與課堂精簡網頁是兩份不同介面。

## 跑完整 React 應用

需要 Node.js 22.12+，本庫使用 Node.js 24 驗證。終端機先在儲存庫根目錄，再執行：

```bash
cd frontend
npm ci
npm run dev
```

依終端機顯示的網址開網頁。本機 Vite 外掛支援 `/api/twse`、`/api/history`、`/api/valuation`；外部行情需要網路。AI 評語需要伺服器程序的 API key，未設定時可使用其他功能，不要把 secret 放進 VITE_ 變數。

## 跑本機合約測試

另外開終端機，從儲存庫根目錄開始：

```bash
cd onchain
npm ci
npm test
```

本機測試不用私鑰或 Sepolia ETH，也不會送測試網交易。測試包含已知限制的重現案例，通過不代表所有限制已修復。

## 開始改程式前

這是測試網原型，沒有串接實股或銀行保管。現有部署地址只是一份快照，Oracle 可能過期，儲備也可能不足。先讀檢查報告，再做自己的測試；不要把示範數值當成即時行情。

依賴的授權檔保留在各 vendor 目錄。官方資料見 [來源](SOURCES.md)。

[回學生首頁](../README.md)
