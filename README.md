# RWA WORKSHOP 1019

### 今天，做出你的第一個代幣

你會發行自己的代幣、轉給同學，再用網頁操作它。後半段跟著老師看台股代幣如何定價、鑄造與贖回。

**第一次來？直接點 [01 準備錢包](workshop/steps/01-wallet.md)。上課跟著下面的順序走即可。**

## 跟著老師做到哪一步？

| 步驟 | 現在要做什麼 | 完成後會看到 |
|---|---|---|
| **[01 準備錢包 →](workshop/steps/01-wallet.md)** | 安裝 MetaMask，確認測試帳戶與 Sepolia | 找到自己的公開地址 |
| **[02 發行與轉帳 →](workshop/steps/02-token.md)** | 複製完整程式到 Remix，發 1,000 枚、轉 10 枚 | 自己 990 枚、同學 10 枚 |
| **[03 看懂台股合約 →](workshop/steps/03-factory.md)** | 跟老師看 StockToken、Factory 與部署迴圈 | 知道一檔股票為什麼有一個合約地址 |
| **[04 啟動操作網頁 →](workshop/steps/04-frontend.md)** | 下載教材，啟動網頁，貼上自己的合約地址 | 網頁顯示自己的代幣餘額 |
| **[05 體驗台股代幣 →](workshop/steps/05-stock.md)** | 等老師確認環境後，授權 TWD、買入並查結果 | 分清「授權」和「真的扣款」 |
| **[完成：記錄成果 →](workshop/steps/06-finish.md)** | 記下地址、交易與餘額，回答三個問題 | 留下自己完成的作品紀錄 |

第 03 步跟著看程式即可。第 05 步使用老師準備的測試合約，等老師宣布開始再操作。

## 上課先準備

- 一台能安裝瀏覽器擴充套件的電腦。
- 打開 [Remix](https://remix.ethereum.org)；錢包安裝從 [MetaMask 官方入口](https://metamask.io/download) 開始。
- 到第 04 步才需要 Node.js 與下載教材；前兩步可以直接在瀏覽器完成。

全程使用測試資產。助記詞與私鑰由你自己保存，不交給老師或同學。沒有測試 ETH 時，先依老師指示用 Remix VM；VM 的代幣不會出現在 Sepolia。

## 下載完整網站資料包

**只要照步驟做：[簡易操作說明](docs/ZIP_STEPS.md) · [簡易 PDF](docs/ZIP_STEPS.pdf)。解壓縮後也可開 ZIP-STEPS.html。**

想做出同款完整網站並部署 Vercel？[下載完整 ZIP](https://github.com/112650024/RWA-WORKSHOP-1019/releases/download/student-kit-1019/RWA-WORKSHOP-1019-Full.zip)，解壓縮後先開 **START-HERE.html**。Windows 依序點 **01-install.cmd → 02-start.cmd → 03-build.cmd**；只需先安裝 Node.js 24。

內含完整程式與課堂教材；[進階部署說明](docs/FULL_PACKAGE.md) 包含自己的合約、feeder 與 keeper 設定。Vercel 的 Root Directory 選 **frontend**。

## 常用入口

[完整發幣程式](workshop/contracts/ClassToken.sol) · [下載教材 ZIP](https://github.com/112650024/RWA-WORKSHOP-1019/archive/refs/heads/main.zip) · [操作卡住了？](workshop/steps/faq.md)

下載 ZIP 後請先解壓縮。第 04 步會教你在哪裡輸入指令；不需要先把整個專案研究完。

<details>
<summary>課後想繼續研究：完整程式與原理</summary>

| 想了解什麼 | 從這裡開始 |
|---|---|
| feeder、keeper、Oracle 是什麼 | [平台原理速讀](docs/ORACLE_EXPLAINED.md) |
| 台股代幣如何買入／贖回 | [StockToken.sol](onchain/contracts/StockToken.sol) |
| 如何建立多檔股票代幣 | [StockFactory.sol](onchain/contracts/StockFactory.sol) → [deploy.js](onchain/scripts/deploy.js) |
| 課堂網頁如何呼叫合約 | [workshop/frontend/app.js](workshop/frontend/app.js) |
| 完整 React 應用與合約測試 | [課後專案指南](docs/PROJECT_GUIDE.md) |
| 完整資料索引 | [文件目錄](docs/README.md) |

本專案是教學原型，未串接真實股票或銀行託管；完整平台仍有待改善的限制，詳見課後專案指南。

</details>
