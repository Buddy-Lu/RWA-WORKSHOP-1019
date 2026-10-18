# RWA WORKSHOP 1019

清大 RWA 工作坊｜120 分鐘｜講師 Cake

從區塊鏈名詞、錢包與 Remix 發幣，走到台股代幣的工廠合約、批次部署與前端操作。這份儲存庫包含完整 FormosaX 程式，以及適合課堂跟做的精簡教材。全程使用測試資產；專案尚未串接真實股票或銀行託管。

## 上課先開這裡

| 我想做什麼 | 入口 |
|---|---|
| 跟著老師一步一步操作 | [學生操作手冊](docs/STUDENT_LABS.md) |
| 看每頁講稿、提問與操作時機 | [兩小時逐頁講稿](docs/TEACHER_SCRIPT.md) |
| 對照目前 Canva 頁碼 | [頁碼與程式對照](docs/SLIDE_CODE_MAP.md) |
| 下載全部檔案 | [Download ZIP](https://github.com/112650024/RWA-WORKSHOP-1019/archive/refs/heads/main.zip) |
| 用 Remix 發自己的幣 | [ClassToken.sol](workshop/contracts/ClassToken.sol) |
| 啟動課堂精簡前端 | [workshop/](workshop/README.md) |
| 看完整 React 網站 | [frontend/](frontend/) |
| 看完整合約、腳本與測試 | [onchain/](onchain/) |
| 課前驗收、故障排除 | [講師準備清單](docs/TEACHER_SETUP.md) |

## 課程安排

| 時間 | 單元 | 課堂成果 |
|---|---|---|
| 00–15 | 區塊鏈基本名詞介紹 | 看懂帳本、共識、合約、Gas、L1/L2 |
| 15–25 | RWA 現實世界資產代幣化 | 分清代幣、價格、資產權利與儲備 |
| 25–45 | 智能合約與錢包實作 | 安裝 MetaMask，確認課程帳戶與 Sepolia |
| 45–70 | ERC-20 與 Remix 發幣 | 發行 1,000 枚，轉 10 枚並查餘額 |
| 70–75 | 休息 | 協助未完成者，準備平台示範 |
| 75–105 | 台股代幣化平台實作 | Factory、逐筆部署、前端 approve／mint |
| 105–112 | 預言機與 DeFi 整合 | 理解餵價、LTV、健康因子與清算 |
| 112–120 | 儲備、權限與風險檢驗 | 檢查兌付缺口，含 3 分鐘問答 |

## 取得教材

安裝 Node.js 22.12+（本次驗證用 Node.js 24），以及 Git；也可直接下載 ZIP 解壓縮。

```bash
git clone https://github.com/112650024/RWA-WORKSHOP-1019.git
cd RWA-WORKSHOP-1019
node workshop/frontend/serve.mjs
```

瀏覽器開啟 http://127.0.0.1:4173。精簡前端已附 ethers，不需要 npm install。它連接 Sepolia；請先用 Remix + MetaMask 在同一測試網部署自己的 ClassToken。Remix VM 適合無測試 ETH 的備援練習，但 VM 的地址不能直接給這個 Sepolia 前端使用。

## 跑完整專案

前端（只啟動網站，不會自動部署合約）：

```bash
cd frontend
npm ci
npm run dev
```

合約（本機測試不需要私鑰或測試 ETH）：

```bash
cd onchain
npm ci
npm test
```

上述兩段均從儲存庫根目錄開始。完整 React 前端的 `/api` 由 Vercel serverless 提供，單獨 `npm run dev` 不會啟動該 API；完整行情和 AI 評語請用 Vercel 環境，合約操作另依 RPC 與測試網狀態。課堂先用精簡前端完成合約讀寫。

## 程式結構

```text
onchain/contracts/    TWD、Oracle、StockToken、Factory、LendingPool、IPO
onchain/scripts/      部署、餵價、清算、驗證、Uniswap 設定
onchain/test/         原專案測試與課程情境驗證
frontend/src/         React / wagmi / viem 完整應用
frontend/api/         TWSE、歷史價格、估值評語 serverless functions
workshop/contracts/  課程 ERC-20、ABI、固定版本 OpenZeppelin
workshop/frontend/   HTML / ethers 精簡操作介面
docs/                講稿、學生操作、準備清單、程式導讀
docs/original/       舊版文件與報告來源，內容可能早於本次教材
```

`deployed.json` 與 `workshop/frontend/config.js` 是公開部署快照，不代表課堂當天鏈上價格仍有效。講師更新部署後執行 `node scripts/sync-workshop-config.mjs` 同步課堂地址。不要把 `.env`、私鑰或助記詞傳到 GitHub。

本課的「批次」是腳本逐筆呼叫 `createStock`，每檔是獨立交易。測試 TWD 的儲備欄位是合約記帳，並非銀行查核。StockToken 的價格上漲不會自動補入兌付資金。

第三方程式授權保留在各 vendor 目錄；完整原專案保留原有授權聲明。參考資料請看 [SOURCES.md](docs/SOURCES.md)。
