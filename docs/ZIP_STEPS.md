# ZIP 一步一步操作｜Windows

已能開啟本機網站：直接從第 2 頁開始。每個指令框逐行執行，成功後再往下。

## 1｜開啟網站

1. 安裝 Node.js 24：https://nodejs.org/en/download
2. 下載 ZIP → 按右鍵 →「解壓縮全部」。
3. 打開解壓後的資料夾，找到 01-install.cmd。
4. 雙擊 01-install.cmd，等到出現 Ready。
5. 雙擊 02-start.cmd，保留開啟的黑色視窗。
6. 瀏覽器開啟 http://127.0.0.1:5173。

完成：網站首頁出現。

如果找不到 node：重新安裝 Node.js，再關閉並重開檔案總管。

## 2｜填入你的 .env

1. 準備專用測試錢包，MetaMask 切換 Sepolia。
2. 確認該帳戶有 Sepolia 測試 ETH。
3. 在專案資料夾裡，打開 onchain 資料夾。
4. 點檔案總管上方網址列，輸入 powershell，按 Enter。
5. 在新視窗逐行貼上：

```powershell
if (!(Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

6. 記事本內容改成下方格式；已填好的私鑰請保留。

```dotenv
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=換成你的測試錢包私鑰
ORACLE_ADDRESS=
FEED_INTERVAL_MS=60000
EXTRA_CODES=
ETHERSCAN_API_KEY=
```

7. 把「換成你的測試錢包私鑰」替換成實際私鑰。
8. 按 Ctrl+S 儲存，關閉記事本。

完成：設定檔位於 onchain/.env，檔名不是 .env.txt。

只用專用測試帳戶。私鑰不要貼給別人、不要上傳 GitHub、不要放進 Vercel。

## 3｜部署自己的幣

位置：沿用上一頁的 onchain 終端機。

1. 逐行執行，等上一行完成再執行下一行：

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run deploy:sepolia
```

2. 等待部署完成，不要關閉視窗。
3. 確認最後出現「已寫入 deployed.json」。
4. 檢查這兩個檔案已更新：

```text
onchain/deployed.json
frontend/src/deployed.json
```

完成：終端機列出多檔股票地址，並顯示已寫入兩份地址檔。

若出現 insufficient funds：補充該測試錢包的 Sepolia ETH。
若部署中斷：先保留錯誤訊息並排除原因；不要反覆重跑，重跑會再建立一套合約。

## 4｜啟動自動餵價

位置：onchain 終端機。

1. 執行這一行，複製顯示的 0x 開頭地址：

```powershell
node -e "console.log(require('./deployed.json').contracts.oracle.address)"
```

2. 開啟設定檔：

```powershell
notepad .env
```

3. 把剛才的地址貼到 ORACLE_ADDRESS= 後方。
4. 按 Ctrl+S 儲存，關閉記事本。
5. 執行：

```powershell
npm.cmd run feed:sepolia
```

6. 看到「餵價」和「tx 0x...」後，保留這個視窗。
7. 再開一個 onchain 終端機，執行：

```powershell
node --require dotenv/config scripts/preflight.js
```

8. 確認 stale 是 false；等下一筆餵價成功，再執行一次。
9. 確認 lastSubmittedAt 往後更新，並人工核對股價與來源日期。

完成：有成功餵價交易，兩次檢查的寫入時間不同。

餵價視窗不要關閉、電腦不要休眠。若出現 Oracle: not feeder，先核對 Oracle 地址與私鑰是否使用同一套部署者。

## 5｜測試買入自己的代幣

1. 保留餵價視窗。
2. 在原本網站的黑色視窗按 Ctrl+C 停止網站。
3. 回根目錄，再雙擊 02-start.cmd。
4. 重新整理網站，連接 MetaMask，確認 Sepolia。
5. 到穩定幣頁領取測試 TWD，等待交易成功。
6. 到交易頁選台積電，第一次輸入整數 1 股。
7. 點買入，依錢包提示先確認授權，再確認買入。
8. 確認交易成功，檢查 TWD 和股票代幣餘額。
9. 要測試贖回，使用剛取得的少量股票代幣，再核對收據與餘額。

完成：買入／贖回有成功交易收據，餘額跟著改變。

看到 stale price：回第 4 頁檢查餵價，不要一直重送交易。

暫時跳過借貸、keeper、IPO 管理提領；這些功能有已確認的未修問題。

## 6｜把網站放到 Vercel

1. 回根目錄，雙擊 03-build.cmd。
2. 等到出現 Build passed。
3. 打開 frontend 資料夾，在網址列輸入 powershell，按 Enter。
4. 執行：

```powershell
npx.cmd vercel
```

5. 若詢問是否安裝 CLI，輸入 y。
6. 按提示登入你的 Vercel 帳號。
7. 選自己的帳號／團隊；第一次選建立新專案。
8. 專案目錄使用目前的 frontend，目錄填 . 即可。
9. 核對部署設定：

```text
Framework: Vite
Install Command: npm ci
Build Command: npm run build
Output Directory: dist
```

10. 開啟回傳的預覽網址，確認首頁可開啟。
11. 在同一個 frontend 終端機執行正式部署：

```powershell
npx.cmd vercel --prod
```

12. 保存正式網址，重新確認錢包網路是 Sepolia。
13. 開啟「你的網址/api/twse」，確認有行情 JSON；若只有 {}，先檢查行情來源。

完成：正式網站網址可開啟，並能讀取你新部署的合約。

先不要填 AI key，也不要在 Vercel 填 PRIVATE_KEY。保留本機 feeder 視窗繼續餵價。

若改用 GitHub 匯入 Vercel：Root Directory 選 frontend，並先把新的 frontend/src/deployed.json 提交到自己的 repo。
