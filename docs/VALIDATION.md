# 教材驗證紀錄

## 2026-10-19 補充檢查

Canva 已整理為41頁。23項合約測試通過，其中3項為已知缺陷／限制的重現測試，並非修復證明。前端文案更正後重新build成功。新增只讀preflight，確認既有兩檔Sepolia部署價格過期；詳見 FINAL_REVIEW_1019.md。本次沒有送出鏈上交易或部署Vercel。

## 2026-10-18 初次整理

日期：2026-10-18。環境：Windows、Node.js 24.18.0、npm 11.16.0。

- `onchain`: `npm ci` 成功；Solidity 0.8.24 編譯成功；20 項 Hardhat 測試通過（原 16 項，加 4 項課程情境）。
- `frontend`: 原始 lock 與 package manifest 不一致，已重新產生 lock；重新執行 `npm ci` 成功；TypeScript 與 Vite production build 成功。
- 課堂精簡前端：app.js、serve.mjs 語法檢查通過；地址同步工具以既有 Sepolia 快照測試。
- 原完整應用合約與業務程式未在本次教材整理中改寫；新增課程情境測試、文件、設定同步工具與 CI。
- 公開檔案排除 `.env`、私鑰檔案、依賴目錄、建置產物及原 Git 歷史；已檢查常見 token／私鑰特徵。這不等同完整安全稽核。

建置仍有第三方套件的 peer dependency、deprecated 與 bundler annotation 警告；不阻止本次安裝及 build。未使用真實錢包，未送出 Sepolia 部署／買賣，未確認既有部署當日價格、權限與儲備狀態。授課前請依 TEACHER_SETUP.md 完成現場環境驗收。

GitHub Actions 會對後續 push／pull request 執行合約測試與前端 build；最新遠端結果請看儲存庫 Actions。
