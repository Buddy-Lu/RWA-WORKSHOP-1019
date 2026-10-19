// Diagnostic tests: these reproduce known prototype limitations, not a security certification.
const { expect } = require('chai');
const { ethers, network } = require('hardhat');
describe('Audit reproduction: known prototype limitations', function () {
  let owner, alice, twd, oracle, stock;
  const U=10n**6n, S=10n**18n;
  const code=ethers.encodeBytes32String('2330');
  beforeEach(async function(){
    [owner,alice]=await ethers.getSigners();
    twd=await (await ethers.getContractFactory('RegulatedTWD')).deploy(owner.address);
    oracle=await (await ethers.getContractFactory('PriceOracle')).deploy();
    const f=await (await ethers.getContractFactory('StockFactory')).deploy(await twd.getAddress(),await oracle.getAddress());
    await oracle.updatePrice(code,100000,2);
    await f.createStock(code,'Test','TEST');
    stock=await ethers.getContractAt('StockToken',await f.tokenOf(code));
  });
  it('IPO owner reclaim before claim removes already allocated inventory',async function(){
    const ipo=await (await ethers.getContractFactory('StockIPO')).deploy(await twd.getAddress(),owner.address);
    await twd.mintTWD(100000);await twd.approve(await stock.getAddress(),100000n*U);await stock.mint(100000n*U);
    await stock.approve(await ipo.getAddress(),100n*S);
    const now=(await ethers.provider.getBlock('latest')).timestamp;
    await ipo.createOffering(await stock.getAddress(),1000n*U,100n*S,now,now+100);
    await twd.connect(alice).mintTWD(50000);await twd.connect(alice).approve(await ipo.getAddress(),50000n*U);
    await ipo.connect(alice).subscribe(0,50000n*U);
    await network.provider.send('evm_increaseTime',[101]);await network.provider.send('evm_mine');await ipo.finalize(0);
    expect((await ipo.userPosition(0,alice.address)).estShares).to.equal(50n*S);
    await ipo.ownerReclaimUnsold(0);
    expect((await ipo.userPosition(0,alice.address)).estShares).to.equal(0n);
    expect(await stock.balanceOf(await ipo.getAddress())).to.equal(0n);
    await ipo.connect(alice).claim(0);
    expect(await stock.balanceOf(alice.address)).to.equal(0n);
    expect(await twd.balanceOf(alice.address)).to.equal(50000n*U);
  });
  it('oracle rewrites an unchanged old value with a fresh submission timestamp',async function(){
    const old=await oracle.latestPrice(code);
    await network.provider.send('evm_increaseTime',[3600]);await network.provider.send('evm_mine');
    await oracle.updatePrice(code,100000,2);
    const next=await oracle.latestPrice(code);
    expect(next.price).to.equal(old.price);
    expect(next.updatedAt).to.be.greaterThan(old.updatedAt);
  });
  it('quote changing after approval changes actual minted shares',async function(){
    await twd.connect(alice).mintTWD(1000);
    const quote=await stock.pricePerShare();
    await twd.connect(alice).approve(await stock.getAddress(),quote);
    await oracle.updatePrice(code,125000,2);
    await stock.connect(alice).mint(quote);
    expect(await stock.balanceOf(alice.address)).to.equal(8n*S/10n);
  });
});
