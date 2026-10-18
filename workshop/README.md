# 清大 RWA 課堂素材

搭配七單元實作簡報。全程使用測試網與測試資產。這是精簡教學骨架；完整平台在本庫根目錄的 `onchain/` 與 `frontend/`。第一次操作請看 [學生手冊](../docs/STUDENT_LABS.md)。

## Lab 02：Remix 發行自己的 ERC-20

開啟 https://remix.ethereum.org，將 `contracts/ClassToken.sol` 貼進同名檔案。

- Solidity compiler：0.8.24；optimizer：200 runs；EVM target：Paris。
- 已固定 OpenZeppelin 5.0.2。初次編譯需要 Remix 解析該 import。
- 如果依賴下載失敗，把 `contracts/vendor` 整個目錄放進 Remix，將 import 改成 `./vendor/token/ERC20/ERC20.sol`。
- 部署參數：`"NTHU Token", "NTHU", 1000`。wholeSupply 是整枚數量，合約會乘以 10^18。
- 主流程：Remix 的 Browser Extension 環境，錢包切 Sepolia，先準備測試 ETH。constructor 不接收 ETH，value 保持 0。
- 備援：Remix VM。此時幣只存在 VM，地址不能直接拿到 Sepolia 前端使用。

查 name、symbol、decimals、totalSupply、balanceOf(部署帳戶)。初始 1000 枚的原始值是 `1000000000000000000000`。轉 10 枚給同學，原始數量是 `10000000000000000000`。

有限授權示例：Alice 轉 10 枚給 Bob 後餘額 990；approve Bob 25 枚不改餘額，allowance 變 25。若由 Bob 在同一 token 合約 transferFrom(Alice, Bob, 5e18)，Alice 變 985、Bob 變 15、額度剩 20。進階代扣由講師示範即可。

ClassToken 沒有額外公開 mint 入口。`ClassToken.abi.json` 是本次編譯取得的 ABI。這個 token 不能直接替代 FormosaX 的 TWD 或 StockToken。

## Lab 03：啟動精簡前端

需電腦有 Node.js。將終端機切到這份素材的根目錄，執行：

```text
node frontend/serve.mjs
```

開啟 http://127.0.0.1:4173，按連接錢包並確認 Sepolia。前端只在本機 127.0.0.1 提供服務，Ctrl+C 結束。

先填自己的 ClassToken 地址，讀名稱、供給與餘額，轉帳欄輸入一般數字 10，程式會 parseUnits 換算。ClassToken 必須部署在 Sepolia；VM 地址不適用。

再操作股票區塊：讀價格與餘額 → 領測試 TWD → 填付款金額 → 授權 → 買入 → 檢查 receipt 與餘額。贖回欄輸入股票代幣數量。mint 按執行時 oracle 價換算，這個合約沒有鎖定取得股數參數。

`frontend/config.js` 內建本機 FormosaX 的 Sepolia 部署快照，含 TWD 與兩檔股票地址。講師須課前確認合約存在、owner／pause 狀態、oracle 價格時效、測試 ETH 與資金；也可以替換成自己的新部署。快照不代表當天鏈上狀態已確認。

這份骨架用純 HTML、JavaScript、ethers 6.13.4；原專案使用 React/Vite/wagmi/viem，兩者示範相同的地址／ABI／讀寫概念。骨架分開 approve 與 mint 按鈕，方便停下解釋授權。

## 多資產部署的原專案參考

`contracts/*.reference.txt` 保留 StockFactory、StockToken、PriceOracle、deploy.js 與 stocks.js 的本機原始碼作為閱讀資料。這些不是可獨立部署完整專案的壓縮版，依賴、TWD 與完整設定請回原專案查看。

現有 StockFactory 每次 createStock 建立一檔，deploy.js 在迴圈裡逐筆送交易並 wait；課堂以兩檔展示。ABI／地址輸出到 deployed.json，前端再依設定讀寫。沒有單筆交易建立全部股票的 createStocks 函式。

## 驗證範圍與來源

ClassToken 已用 Solidity 0.8.24、OpenZeppelin 5.0.2 編譯，附 ABI。前端已做語法與模擬錢包讀取檢查。未使用使用者真實錢包，未執行 Sepolia 部署、轉帳或買賣。課前仍須以講師測試帳戶走完整條流程。

OpenZeppelin 和 ethers 的授權文件附在各 vendor 目錄。主要參考：

- https://remix-ide.readthedocs.io/en/latest/run.html
- https://remix-ide.readthedocs.io/en/latest/import.html
- https://github.com/OpenZeppelin/openzeppelin-contracts/tree/v5.0.2
- https://docs.ethers.org/v6/getting-started/
- FormosaX 本機版本 f2b0172，位於 本儲存庫。
