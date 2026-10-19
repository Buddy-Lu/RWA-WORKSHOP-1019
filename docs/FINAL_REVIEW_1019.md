# 10/19 最終測試前檢查

這是課前程式與教材檢查，不是完整安全稽核。檢查了目前 Canva 46 頁內容、課堂主路徑、合約／部署／餵價／前端，並重跑測試。下列「已重現」代表有測試證據；「靜態發現」代表依原始碼判斷，尚未用真實錢包逐項操作。

## 先處理：現有測試網價格已過期

唯讀查詢 Sepolia 區塊 **11945161**，區塊時間 **2026-10-19 10:17:48 台北時間**。這不是後續價格的保證。

| 標的 | Oracle 價格 | 最後鏈上寫入時間（台北） | maxPriceAge | 暫停 | 記帳 TWD 儲備 | 發行量 |
|---|---:|---|---|---|---:|---:|
| 2330 | 2400 | 2026-06-16 22:40:36 | 30 天 | 否 | 617440 | 261 |
| 2317 | 269 | 2026-06-16 22:40:36 | 30 天 | 否 | 2845 | 10 |

兩筆都超過 30 天，正常鑄造／贖回會在 `pricePerShare()` 的 `stale price` 檢查被擋。即使前端仍能顯示 Oracle 原始數字，也不代表可以交易。`usePrices()` 目前讀取 latestPrice 後忽略 updatedAt。

2330 若只按這個舊報價計算，261 × 2400 = 626400 TWD，記帳儲備少 8960 TWD；這是全部供給的靜態兌付缺口，不代表每筆小額贖回都必然失敗。實際測試必須重新取得有效價格，再看儲備。

已確認 Oracle owner 仍是授權 feeder。**沒有使用私鑰，沒有替使用者更新價格、部署或送交易。**

重新唯讀檢查：在 `onchain` 執行 `node scripts/preflight.js`。該工具不讀 `.env`，可透過程序環境 `SEPOLIA_RPC_URL` 指定 RPC，預設使用公開節點。

## 程式問題與處理狀態

| 優先度 | 發現 | 證據／影響 | 本次狀態 |
|---|---|---|---|
| 課前阻擋 | 舊部署價格過期 | 上述鏈上唯讀結果；鑄贖會 revert | 待講師以有權限帳戶餵價 |
| 高 | IPO 提領「未售出庫存」會包含尚未 claim 的配額 | `ownerReclaimUnsold` 用 totalShares - sharesSold，但 sharesSold 只在 claim 增加；又改掉 totalShares，改變 entitlement | 本機已重現，未改已部署合約；課堂避開這項管理操作 |
| 高 | 舊來源價格可能被寫成新的 updatedAt | feeder 可取昨收／收盤後備，Oracle 每次寫入都用 block.timestamp；沒有來源報價時間 | 已重現時間戳語意，尚未改資料模型 |
| 中 | 前端宣稱「1:1 實股擔保」「鏈上免手續費」 | 實際只有測試 TWD 記帳，交易有 gas | 已修正課程庫的 Dashboard／Trade 文案；未部署 Vercel |
| 中 | 買入數量／成本紀錄可能與實際鑄造不同 | Trade 先讀 pps，approve 後再 mint；價格變動時仍 recordBuy 原輸入股數 | 本機重現付款1000、價格改1250，只鑄0.8股；未修改交易介面或合約滑點設計 |
| 中 | 輸入小數股數會在 BigInt(shares) 出錯 | number 欄未限定整數，程式僅檢查 <=0 | 靜態發現；最終測試先用正整數股數 |
| 中 | feeder 慢輪次可能重疊、首輪失敗會停止啟動 | async feedOnce + setInterval 未做互斥；第一次 await feedOnce 外沒有 catch | 靜態發現；本次未改排程。不要同時開多個 feeder |
| 中 | keeper 可能為不足值抵押代償過多 | liquidate 只截斷 seize，不同步降低 pay；keeper 預設用全部債務或帳戶餘額代償 | 靜態發現；需另測多抵押／深度下跌情境 |
| 中 | keeper 可能漏掉舊借款人 | 只回掃120000區塊，getLogs失敗會略過 | 靜態發現；不保證全市場自動清算 |

新增 `onchain/test/audit-findings.test.js` 的三項測試是**重現已知限制**，斷言目前會出現的問題行為。它們通過不表示這些問題已修復。總計 23 項測試通過，包含既有20項與新增3項。

核對過 `useTx` 使用的已安裝 wagmi 實作：`waitForTransactionReceipt` 會在 reverted receipt 丟出錯誤，因此沒有把「沒有手寫 receipt.status」直接列為失敗交易誤報的 bug。

另外，`usePrices()` 在歷史API不可用時會使用合成走勢線，初始價格也有fallback。授課時不可把每一條畫面曲線都稱為真實逐筆成交。完整前端的市場資訊與精簡前端直接讀StockToken的路徑不同。

## 簡報檢查與已完成調整

使用者確認後刪除了檢查時的第7、18、19、20、22頁（ERC-20重複頁、BitoPro／幣安入金提幣等），保留第3頁活動介紹。目前 Canva **41頁**，講稿與頁碼表已同步。

主課的 TWD 6位／股票18位、LTV 50%、清算門檻65%、HF 1.625／0.975、儲備缺口、pause／KYC限制，均與目前原型對得上。仍應注意：

- 現在第17頁：Remix VM 是備援畫面，與 Sepolia 是不同環境，講稿已說明。
- 現在第22頁：官方部署截圖示例是 Owner 合約；課程實際選 ClassToken。這張是介面示意，不能照圖選 Owner，講稿已明示。
- 現在第31頁：updatedAt 是本合約最後寫入時間，不是 TWSE 資料原始時間，不能單靠它證明市場報價新鮮。
- 「挖礦」頁用 PoW/PoS比較；Ethereum 目前使用 PoS，不應說仍靠 PoW 挖礦。
- Factory 批次部署是逐筆交易；Oracle 的 updatePrices 則可把一批價格寫在同一筆交易，兩種批次不要混淆。
- 原版圖解中的「智能合約取代機構」只能當流程簡化，RWA 仍需要鏈下保管與權利安排。

## 之前教材的更正

前一版 README／學生手冊／課前清單寫「Vite 不會執行 /api」，不符合這份專案；`vite.config.ts` 已實作三個本機 API 路徑。本次已更正。AI API 需要伺服器程序環境中的 key，不能放進 VITE_ 前端變數。

PriceOracle 原註解寫「Chainlink AggregatorV3 風格、無痛替換」，也過度簡化。已更正註解：目前是自訂 latestPrice(bytes32)；Chainlink 是 latestRoundData() 等介面，要有 adapter 或改合約依賴。StockToken oracle 為 immutable，既有部署不能直接改成另一個地址。

## 你等一下的最終測試順序

1. `git pull` 取得更新；在 `onchain` 跑 `npm test`。
2. 跑 `node scripts/preflight.js`，先記下兩檔價格、日期、pause與儲備。**stale=true 就先停在這步。**
3. 在本機 `.env` 確認 ORACLE_ADDRESS 與有權限的測試錢包，準備 Sepolia ETH，執行 `npm run feed:sepolia`。看來源資料日期、是否fallback、交易hash；單純看到「即時」字樣不算已確認來源時效。
4. 再跑 preflight，確認鏈上寫入時間已更新；同時人工核對來源報價時間與價格合理性。不要只放寬 maxPriceAge 來繞過資料過期。
5. 新測試帳戶用 Remix 部署 ClassToken，查1000枚，轉10枚，查990／10；保存合約地址與交易hash。
6. 啟動精簡前端，貼同一Sepolia合約地址，查餘額並轉小額。
7. 台股區領測試TWD，先approve，再mint；各保存收據。核對實際鑄造數量，不只看預估股數。
8. 在價格沒有變動且儲備足夠時贖回小額，檢查TWD／股票餘額。不要把全部存量都拿來壓力兌付當正常課堂示範。
9. 若展示完整React介面，核對資料時間與測試文案；目前網站部署不會隨這份課程庫push自動更新，除非另有設定。
10. IPO管理提領與keeper極端情境暫列延伸問題，不納入「整套已驗證安全」的宣稱。

簽章與送交易由講師自己的錢包確認。這份檢查沒有替代最後的真實瀏覽器／錢包驗收。
