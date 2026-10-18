const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Workshop: 授權、儲備缺口與管理權限', function () {
  let owner, alice, bob, twd, oracle, stock;
  const TWD = 10n ** 6n, SHARE = 10n ** 18n;
  const code = ethers.encodeBytes32String('2330');
  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    twd = await (await ethers.getContractFactory('RegulatedTWD')).deploy(owner.address);
    oracle = await (await ethers.getContractFactory('PriceOracle')).deploy();
    const factory = await (await ethers.getContractFactory('StockFactory')).deploy(await twd.getAddress(), await oracle.getAddress());
    await oracle.updatePrice(code, 100000, 2);
    await factory.createStock(code, 'Workshop stock', 'WST');
    stock = await ethers.getContractAt('StockToken', await factory.tokenOf(code));
    await twd.connect(alice).mintTWD(2000);
  });
  async function buyOne() {
    await twd.connect(alice).approve(await stock.getAddress(), 1000n*TWD);
    await stock.connect(alice).mint(1000n*TWD);
  }
  it('approve 不扣款；mint 才轉入 TWD 並鑄造股票', async function () {
    await twd.connect(alice).approve(await stock.getAddress(), 1000n*TWD);
    expect(await twd.balanceOf(alice.address)).to.equal(2000n*TWD);
    expect(await stock.balanceOf(alice.address)).to.equal(0n);
    await stock.connect(alice).mint(1000n*TWD);
    expect(await twd.balanceOf(alice.address)).to.equal(1000n*TWD);
    expect(await stock.balanceOf(alice.address)).to.equal(SHARE);
    expect(await stock.totalTwdReserve()).to.equal(1000n*TWD);
  });
  it('價格漲到1200不補儲備，贖回失敗且持有人餘額不變', async function () {
    await buyOne();
    await oracle.updatePrice(code, 120000, 2);
    await expect(stock.connect(alice).redeem(SHARE)).to.be.revertedWith('insufficient reserve');
    expect(await stock.balanceOf(alice.address)).to.equal(SHARE);
    expect(await stock.totalTwdReserve()).to.equal(1000n*TWD);
  });
  it('直接轉入TWD不更新totalTwdReserve記帳', async function () {
    await buyOne();
    await twd.connect(alice).transfer(await stock.getAddress(), 200n*TWD);
    expect(await twd.balanceOf(await stock.getAddress())).to.equal(1200n*TWD);
    expect(await stock.totalTwdReserve()).to.equal(1000n*TWD);
    await oracle.updatePrice(code, 120000, 2);
    await expect(stock.connect(alice).redeem(SHARE)).to.be.revertedWith('insufficient reserve');
  });
  it('StockToken暫停鑄贖但仍可轉帳；黑名單另行限制收款', async function () {
    await buyOne();
    await stock.pause();
    await stock.connect(alice).transfer(bob.address, SHARE/2n);
    expect(await stock.balanceOf(bob.address)).to.equal(SHARE/2n);
    await expect(stock.connect(alice).redeem(SHARE/2n)).to.be.revertedWithCustomError(stock,'EnforcedPause');
    await stock.setBlacklist(bob.address,true);
    await expect(stock.connect(alice).transfer(bob.address,1n)).to.be.revertedWith('recipient blacklisted');
  });
});
