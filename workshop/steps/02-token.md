# 02｜發行自己的代幣

用 Remix 發行 1,000 枚代幣，轉 10 枚給同學。這一關仍不需要下載或安裝完整專案。

### A. 放入完整程式

可直接複製下面整段，在 Remix 建立同名檔案：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "@openzeppelin/contracts@5.0.2/token/ERC20/ERC20.sol";

/// @notice Classroom token with a fixed initial supply; no additional mint entry point.
contract ClassToken is ERC20 {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 wholeSupply
    ) ERC20(name_, symbol_) {
        _mint(msg.sender, wholeSupply * 10 ** decimals());
    }
}
```

開啟 [Remix](https://remix.ethereum.org)，建立 `ClassToken.sol`，貼入 [這份完整原始碼](../contracts/ClassToken.sol)。不要只抄簡報上的節錄。

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

<details>
<summary>老師有帶到再做：授權與代扣</summary>


A 在同一合約 `approve(B, 25000000000000000000)`，`allowance(A,B)` 變成 25 枚，雙方餘額不變。切 B 帳戶呼叫 `transferFrom(A,B,5000000000000000000)` 後，A 有 985、B 有 15、剩餘額度 20。不要換成 B 自己部署的另一份 token。

</details>

## 這一關完成了嗎？

- [ ] 我記下合約地址，查到 A 有 990 枚、B 有 10 枚（只有一次轉帳時）。

卡住先看 [常見問題](faq.md)。

[← 上一步](01-wallet.md) · [下一步 →](03-factory.md)
