# 操作卡住了？

先確認：現在在哪一關、哪個網路、使用哪個合約地址。把錯誤訊息給老師看即可，不提供私鑰或助記詞。

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

[回課程首頁](../../README.md)
