# 學生操作手冊

上課時保持三個視窗：老師的簡報、這份手冊、Remix。需要前端時再開本機網站。

## Lab 1｜錢包與測試網（第三單元）

1. 從 [MetaMask 官方網站](https://metamask.io/download) 進入瀏覽器商店安裝。使用個人測試錢包，不使用存放真實資產的帳戶。
2. 依錢包流程建立帳戶並自行保存復原資料。不要把助記詞、私鑰貼到聊天室、表單、GitHub 或投影畫面。
3. 顯示測試網並切到 **Sepolia，chain ID 11155111**。
4. 複製自己的公開帳戶地址。它可供同學轉課程幣；它不是等等部署出來的 token 合約地址。
5. 依講師當天安排取得少量 Sepolia ETH。沒有測試 ETH 時先做 Remix VM 發幣，不必購買 ETH。

完成檢查：能指出目前網路、公開地址、測試 ETH 餘額；知道 token 和 gas 分開計算。

## Lab 2｜用 Remix 發行 1,000 枚課程幣（第四單元）

### A. 放入完整程式

開啟 [Remix](https://remix.ethereum.org)，建立 `ClassToken.sol`，貼入 [這份完整原始碼](../workshop/contracts/ClassToken.sol)。不要只抄簡報上的節錄。

編譯器選 0.8.24；optimizer 開啟、200 runs；EVM target 選 Paris。import 使用固定版本 OpenZeppelin 5.0.2。若線上 import 失敗，把 `workshop/contracts/vendor/` 一併上傳 Remix，改用 `./vendor/token/ERC20/ERC20.sol`。

### B. 部署

1. 編譯 ClassToken，確認沒有錯誤。
2. Deploy & Run 選擇 **ClassToken**，不是 import 進來的其他合約。
3. 主流程選 **Browser Extension**，確認 MetaMask 是 Sepolia。Value 保持 **0**。
4. constructor 填 `name_ = NTHU Token`、`symbol_ = NTHU`、`wholeSupply = 1000`。
5. 按 Deploy，核對錢包請求後確認，等部署完成。記下新出現的 **合約地址**。

備援：選 Remix VM，使用預載測試帳戶完成同樣動作。此環境不需要 MetaMask 確認，結果只在 VM；後續要接 Sepolia 前端，必須重新在 Sepolia 部署。

### C. 查詢

| 函式 | 輸入 | 預期結果 |
|---|---|---|
| name | 無 | NTHU Token |
| symbol | 無 | NTHU |
| decimals | 無 | 18 |
| totalSupply | 無 | 1000000000000000000000 |
| balanceOf | 部署者地址 | 1000000000000000000000 |

`1000 × 10^18` 是原始整數，代表 1,000 枚。constructor 的 wholeSupply 已幫你乘好精度，部署參數只填 1000。

### D. 轉 10 枚

在 **同一個 ClassToken 合約** 呼叫 `transfer`：to 填同學公開地址（VM 就用第二個 VM 帳戶），amount 填 `10000000000000000000`。交易完成後查雙方 `balanceOf`。

在只有這一次轉帳的假設下，A 有 990 枚、B 有 10 枚、總供給仍為 1,000。gas 由發送帳戶的 ETH 支付，不從這 10 枚課程幣中扣。

### E. 授權示範（選做）

A 在同一合約 `approve(B, 25000000000000000000)`，`allowance(A,B)` 變成 25 枚，雙方餘額不變。切 B 帳戶呼叫 `transferFrom(A,B,5000000000000000000)` 後，A 有 985、B 有 15、剩餘額度 20。不要換成 B 自己部署的另一份 token。

## Lab 3｜前端讀取自己的幣（第五單元）

下載整份儲存庫，終端機切到解壓縮後的根目錄：

```bash
node workshop/frontend/serve.mjs
```

開 http://127.0.0.1:4173，按連接錢包；確認 Sepolia。貼上自己的 ClassToken 合約地址，讀取名稱、供給與自己的餘額。若做過上述一次轉帳，部署者預期為 990。

轉帳區填收款帳戶與 `10`，前端會用 `parseUnits` 換成最小單位。這裡不要再填 10^19。交易成功後確認 receipt 與新餘額。

程式閱讀順序：[index.html](../workshop/frontend/index.html) → [config.js](../workshop/frontend/config.js) → [app.js](../workshop/frontend/app.js)。找到 `connected`、`showClass`、`receipt` 三個函式。

## Lab 4｜台股代幣鑄造與贖回（第五單元）

這一段使用講師準備的 StockToken，與你自己的 ClassToken 不同。地址、Oracle 價格及測試資金由講師課前確認。

1. 在股票區選標的，先查詢價格與餘額。
2. 領取測試 TWD；例如輸入 5000，這個領取函式接受整元。
3. 買入付款欄填 1000 TWD，按「步驟 1：授權金額」。交易完成後，TWD 餘額不應因此減少；可代扣額度變 1000。
4. 按「步驟 2：買入鑄造」。等成功收據，再查 TWD 與股票餘額。
5. 假設鏈上每股價格剛好 1000 TWD，此次買入約 1 股；實際結果以執行時的 Oracle 為準。價格不同時不要硬對 1 股。
6. 講師示範輸入持有股數做贖回。StockToken 自己的 `redeem` 會燒呼叫者的幣，這條路徑不用先 approve 股票。

記錄：付款、授權額度、交易 hash、股票餘額。**不要記錄私鑰。**

## Lab 5｜讀 Factory 與部署迴圈（講師帶做）

打開 [StockFactory.sol](../onchain/contracts/StockFactory.sol) 的 `createStock`，再看 [deploy.js](../onchain/scripts/deploy.js) 的 `for (const s of STOCKS)`。每次呼叫建立一個 StockToken，再等待交易，最後記錄地址。

不需要全班各自部署 12 檔。講師準備好結果；同學觀察兩檔地址不同、依賴同一 TWD/Oracle，以及 `deployed.json` 如何送給前端。課後部署指令與環境設定在 [準備清單](TEACHER_SETUP.md)。

## 交作業的最小內容

- 使用的網路、自己的公開帳戶、ClassToken 合約地址。
- 一次部署與一次轉帳的交易 hash（VM 可用畫面與餘額紀錄替代）。
- 轉帳前後雙方餘額；解釋為什麼總供給沒變。
- 回答：approve 後是否扣款？價格上漲會自動補儲備嗎？

## 常見問題

| 現象 | 處理 |
|---|---|
| 網頁沒有錢包 | 安裝擴充套件、解鎖後重新整理，確認同一瀏覽器 |
| 無法送交易 | 查 Sepolia ETH 是否足夠；只有 TWD 不夠付 gas |
| 查不到自己的幣 | 核對網路、合約地址，不能拿帳戶地址或 VM 地址代替 |
| import 失敗 | 使用附帶 vendor，檢查編譯器版本 |
| `stale price` | 通知講師更新 Oracle；重整前端不會更新鏈上價格 |
| `insufficient reserve` | 停下檢查儲備；不要一直重送交易 |
| 授權成功但買入失敗 | approve 是另一筆交易，額度可能仍存在；查原因再操作 |
| 完整網站沒有行情 | 本機已有 API 外掛；查 `/api/twse` 回應、外部行情來源與網路。精簡前端價格則來自鏈上 Oracle |
| Node 指令無法辨識 | 安裝 Node.js 後重開終端機 |

參考：[Remix 部署文件](https://remix-ide.readthedocs.io/en/latest/run.html)、[MetaMask 安裝文件](https://support.metamask.io/start/getting-started-with-metamask/)。
