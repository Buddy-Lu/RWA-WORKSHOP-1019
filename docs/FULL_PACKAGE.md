# 完整網站資料包

解壓縮後先雙擊根目錄的 **START-HERE.html**，可直接在瀏覽器閱讀，不需要啟動伺服器。

Windows：安裝 Node.js 24 → `01-install.cmd` → `02-start.cmd` → `03-build.cmd` → 依指南部署到 Vercel。

macOS/Linux：在根目錄依序執行 `node scripts/student-start.cjs install`、`node scripts/student-start.cjs start`；另開終端機執行 `node scripts/student-start.cjs build`。

## 這包包含什麼

- 完整 React 網站、Vercel 行情 API、部署設定。
- Solidity 合約、部署腳本、feeder、keeper、合約測試。
- Remix 發幣範例、課堂操作步驟與完整教學文件。
- 公開 Sepolia 地址與 ABI；不包含私鑰、實際 .env、node_modules 或 .git。

## 兩種使用方式

1. **先做出同款網站**：依首頁三個啟動檔操作，使用原有公開合約地址。你能修改介面，無法取得老師的管理權限。共用合約的價格、餘額、IPO 狀態可能改變，不能保證下載後所有交易都成功。
2. **建立自己的完整環境**：自行部署合約，使用自己的測試錢包，另外執行 feeder／keeper。以下步驟會送 Sepolia 交易並消耗測試 ETH，請完成基本操作後再做。

## 進階：自己的合約與鏈下服務

在根目錄開終端機：

```text
cd onchain
npm ci
npm test
```

將 `onchain/.env.example` 複製為同資料夾的 `.env`。在本機編輯填入自己的 Sepolia 測試錢包 PRIVATE_KEY 與 RPC URL。私鑰不可提交到 GitHub，也不可放進前端或 Vercel 的 VITE_ 變數。

確認測試錢包有 Sepolia ETH，再於 `onchain` 執行：

```text
npm run deploy:sepolia
```

這會建立合約、逐筆建立多檔股票、準備測試流動性與 IPO，需要多筆交易。等待整段成功；若中途失敗先檢查錯誤，重新執行會建立另一套合約。成功後腳本會更新 `onchain/deployed.json` 與 `frontend/src/deployed.json`，所以網站會指向你自己的地址。提交這兩份公開地址設定，重新部署 Vercel。

把新 `onchain/deployed.json` 的 `contracts.oracle.address` 填入本機 `.env` 的 ORACLE_ADDRESS。部署者有初始餵價權限；若使用另一個 feeder 帳戶，需先由管理者授權。仍在 `onchain` 中執行：

```text
npm run feed:sepolia
```

保持終端機執行。預設每 60 秒抓 TWSE 並寫入鏈上；RPC、外部行情與 gas 都會影響成功率。鏈上更新時間不等於原始行情時間，請留意後備價格。

Keeper 是選配的借貸清算示範。另開終端機，進入 `onchain`，使用有測試 ETH 與測試 TWD 的測試帳戶，再執行：

```text
npm run keeper:sepolia
```

它讀取 `deployed.json` 的借貸合約地址，預設每 30 秒查健康因子，符合條件就發送授權與清算交易。它不是只有查詢，執行會動用該帳戶資金。腳本共用 `.env` 的 PRIVATE_KEY；想分開帳戶，需使用分離的執行環境。已知清算與輪詢限制見 [檢查報告](FINAL_REVIEW_1019.md)。

若也要讓課堂精簡網頁使用新合約，在根目錄執行 `node scripts/sync-workshop-config.mjs`。

## 出問題時

| 現象 | 下一步 |
|---|---|
| 點檔案找不到 node | 安裝 Node.js 24，重開檔案總管／終端機 |
| 安裝套件失敗 | 檢查網路與終端機錯誤，再執行 01-install.cmd |
| 5173 被占用 | 關掉之前啟動的視窗，或在該視窗按 Ctrl+C |
| Vercel 找不到 package.json | Root Directory 必須選 frontend |
| Vercel 有畫面但無行情 API | 部署 frontend 原始碼，不能只上傳 dist |
| stale price | 由有權限的 feeder 更新 Oracle；重新部署網站不會修復 |
| 頁面有行情，買入卻用不同價格 | 網站行情 API 與鏈上 Oracle 是兩條獨立資料路徑 |

參考：[Vercel Vite](https://vercel.com/docs/frameworks/frontend/vite)、[CLI 部署](https://vercel.com/docs/cli/deploy)。
