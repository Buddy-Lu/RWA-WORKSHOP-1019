# 03｜看懂台股合約與批次建立

跟著老師看程式；這一關不用輸入私鑰，也不用自己執行部署。

先看 [StockToken.sol](../../onchain/contracts/StockToken.sol) 的 `mint`／`redeem`：付款、讀價格、更新儲備、發幣。再看 Factory 如何重複建立這種合約。

打開 [StockFactory.sol](../../onchain/contracts/StockFactory.sol) 的 `createStock`，再看 [deploy.js](../../onchain/scripts/deploy.js) 的 `for (const s of STOCKS)`。每次呼叫建立一個 StockToken，再等待交易，最後記錄地址。

不需要全班各自部署 12 檔。講師準備好結果；同學觀察兩檔地址不同、依賴同一 TWD/Oracle，以及 `deployed.json` 如何送給前端。完整部署留到課後延伸，課堂只跟著老師看這幾段。

## 這一關完成了嗎？

- [ ] 我能指出：每個 createStock 建立一份合約，部署腳本逐筆送交易。

卡住先看 [常見問題](faq.md)。

[← 上一步](02-token.md) · [下一步 →](04-frontend.md)
