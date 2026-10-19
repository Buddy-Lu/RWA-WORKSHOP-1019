# 04｜用網頁操作自己的幣

到這一關才下載教材。準備 Node.js，並拿出第 02 關的 Sepolia 合約地址。

1. [下載教材 ZIP](https://github.com/112650024/RWA-WORKSHOP-1019/archive/refs/heads/main.zip)，**先解壓縮**。
2. 打開解壓後的 `RWA-WORKSHOP-1019-main` 資料夾，應看見 `README.md`、`workshop`、`frontend`、`onchain`。
3. Windows：在這個資料夾的檔案總管網址列輸入 `powershell` 後按 Enter。macOS：開終端機，輸入 `cd `，拖入這個資料夾後按 Enter。
4. 輸入 `node --version`。若顯示找不到指令，請先安裝 Node.js 22.12+，再重開終端機。
5. 在剛才的終端機輸入下列指令；**不用 npm install，也不用進根目錄的 frontend 資料夾**：

```bash
node workshop/frontend/serve.mjs
```

開 http://127.0.0.1:4173，按連接錢包；確認 Sepolia。貼上自己的 ClassToken 合約地址，讀取名稱、供給與自己的餘額。若做過上述一次轉帳，部署者預期為 990。

轉帳區填收款帳戶與 `10`，前端會用 `parseUnits` 換成最小單位。這裡不要再填 10^19。交易成功後確認 receipt 與新餘額。

程式閱讀順序：[index.html](../frontend/index.html) → [config.js](../frontend/config.js) → [app.js](../frontend/app.js)。找到 `connected`、`showClass`、`receipt` 三個函式。

看到終端機顯示 `Open http://127.0.0.1:4173` 後再開網頁。操作期間保留終端機，結束時按 Ctrl+C。不要直接雙擊 index.html。

## 這一關完成了嗎？

- [ ] 網頁讀得到我的代幣名稱與餘額，並能查到一筆轉帳結果。

卡住先看 [常見問題](faq.md)。

[← 上一步](03-factory.md) · [下一步 →](05-stock.md)
