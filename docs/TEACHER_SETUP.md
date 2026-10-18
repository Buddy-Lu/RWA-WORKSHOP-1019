# 講師課前準備與操作順序

## 上課前一天

- 開 [學生手冊](STUDENT_LABS.md)，在新資料夾下載教材，完整走一次 Remix 發幣、轉帳與精簡前端。
- 教室投影使用目前 Canva 副本；對照 [頁碼表](SLIDE_CODE_MAP.md)，跳過保留的 9 頁舊內容。講稿已按 40 頁教學順序安排。
- 準備測試錢包和少量 Sepolia ETH。不要投影助記詞、私鑰或 `.env`。
- 對 `onchain/deployed.json` 的地址確認鏈別、合約 code、管理者權限、pause 狀態、Oracle 價格時效、測試 TWD 與儲備。檔案本身只證明曾保存這組地址。
- 若換了部署，執行 `node scripts/sync-workshop-config.mjs`；同步後精簡前端仍是 Sepolia 專用。
- 準備兩檔 Factory 的輸出，課堂不讓全班等待 12 檔重部署。
- 單獨測試教室網路、MetaMask、Remix 和測試 ETH 取得方式。備援採 Remix VM；平台部分改講師示範。

## 本機驗證

從根目錄開終端機：

```bash
cd onchain
npm ci
npm test
```

另一個從根目錄開的終端機：

```bash
cd frontend
npm ci
npm run build
```

測試使用本機 Hardhat，不需要帳戶私鑰，也不會送 Sepolia 交易。看到單元測試通過，不代表既有測試網部署當天仍有資金或新價格。

## 只有需要重新部署時才做

在 `onchain` 複製 `.env.example` 成 `.env`，填自己的測試錢包私鑰與 Sepolia RPC。範例 RPC 中的「你的KEY」是佔位字，必須替換或使用公開 RPC。私鑰只留本機。

```bash
cd onchain
npm run deploy:sepolia
```

這個指令會送出多筆 Sepolia 交易，建立新合約，並覆寫 `onchain/deployed.json` 與 `frontend/src/deployed.json`。課堂進行中不要隨意重跑。它還會初始化價格、借貸流動性與 IPO；行情失敗時可能使用寫在程式裡的 fallback 價格，不能把 fallback 當即時報價。

回根目錄執行：

```bash
node scripts/sync-workshop-config.mjs
```

把新 Oracle 地址放進自己的 `.env` 後，才執行 `npm run feed:sepolia`。需要清算示範時另外執行 `npm run keeper:sepolia`，先確認腳本讀取的合約地址、簽署權限與資金。這些不是網站啟動後自動運作的背景服務。

原本 `deploy.js` 針對 Sepolia 產生設定，請勿直接拿它作本機 localhost 教材部署；輸出的 chainId 與 explorer 是 Sepolia 值。單元測試是完整離線鏈情境的入口。

## 教室三個終端機

1. 學生操作：根目錄 `node workshop/frontend/serve.mjs`，瀏覽 `http://127.0.0.1:4173`。
2. 完整應用展示：`frontend` 內 `npm run dev`。Vite 本機不啟動 Vercel `/api`，完整行情／AI 評語依 Vercel 執行環境。
3. 如需即時餵價：`onchain` 內 `npm run feed:sepolia`。只有講師執行，不請學生輸入講師私鑰。

要結束本機服務，在該終端機按 Ctrl+C。不要關閉正在等待錢包確認的視窗後又重送同樣操作。

## 場控與備援

| 時點 | 確認成果 | 落後時的替代 |
|---|---|---|
| 38 分鐘 | 同學能找到公開地址 | 同桌共用操作者 |
| 62 分鐘 | ClassToken 已部署 | Remix VM，記錄為 VM 成果 |
| 70 分鐘 | 完成一次轉帳與查餘額 | 略過進階 transferFrom |
| 99 分鐘 | 前端連線並完成 approve | 講師展示額度與餘額變化 |
| 105 分鐘 | 至少看完一次 mint 成功收據 | 使用本機測試說明合約結果 |
| 112 分鐘 | 說得出 Oracle 與儲備不同 | 優先保留儲備缺口例子 |

## 已知範圍

本庫保留完整原型，包括 IPO、Swap 與 AI 估值。兩小時主課不要求同學操作這些功能；它們也未因整理教材而成為正式金融系統。第三方套件存在過時／peer dependency 警告，課堂使用鎖定版本；請勿以本次 build 與測試通過替代安全稽核。

原始文件在 `docs/original/`，保留開發背景，優先依本庫新教材理解目前課程。原 BSOS PDF、舊簡報二進位檔與私人環境設定未公開打包；完整應用與課程原始碼均保留。
