'use strict';
const {BrowserProvider,Contract,parseUnits,formatUnits,isAddress}=ethers;
const $=id=>document.getElementById(id);
const ABI=['function name() view returns (string)','function symbol() view returns (string)','function decimals() view returns (uint8)','function totalSupply() view returns (uint256)','function balanceOf(address) view returns (uint256)','function allowance(address,address) view returns (uint256)','function approve(address,uint256) returns (bool)','function transfer(address,uint256) returns (bool)'];
const STOCK_ABI=[...ABI,'function pricePerShare() view returns (uint256)','function mint(uint256)','function redeem(uint256)'];
let provider,signer,account,busy=false;
for(const s of COURSE.stocks){const o=document.createElement('option');o.value=s.address;o.textContent=s.symbol+' / '+s.code;$('stock').append(o);}
function address(value){const v=value.trim();if(!isAddress(v))throw new Error('請填入有效合約／帳戶地址');return v;}
function amount(value,decimals){if(!/^\d+(\.\d+)?$/.test(value.trim()))throw new Error('請填入正數金額');const a=parseUnits(value.trim(),decimals);if(a<=0n)throw new Error('金額必須大於零');return a;}
function requireWallet(){if(!window.ethereum)throw new Error('請先安裝 MetaMask 或相容的瀏覽器錢包');}
async function connected(){requireWallet();if(!provider){provider=new BrowserProvider(window.ethereum);await provider.send('eth_requestAccounts',[]);signer=await provider.getSigner();account=await signer.getAddress();}const n=await provider.getNetwork();$('account').textContent=account+'\nchainId: '+n.chainId;if(n.chainId!==BigInt(COURSE.chainId))throw new Error('請切換到 Sepolia 後重新連線');}
function stock(){return new Contract(address($('stock').value),STOCK_ABI,signer);}
function twd(){return new Contract(COURSE.twd,[...ABI,'function mintTWD(uint256)'],signer);}
async function receipt(tx){$('status').textContent='已提交，等待區塊確認：\n'+tx.hash;$('txLink').href='https://sepolia.etherscan.io/tx/'+tx.hash;$('txLink').textContent='在區塊瀏覽器查看這筆交易';const r=await tx.wait();if(!r||r.status!==1)throw new Error('交易未成功執行');$('status').textContent='交易執行成功\n'+tx.hash+'\nblock: '+r.blockNumber;return r;}
async function showClass(){await connected();const c=new Contract(address($('classAddress').value),ABI,provider);const [name,symbol,d,b,supply]=await Promise.all([c.name(),c.symbol(),c.decimals(),c.balanceOf(account),c.totalSupply()]);$('classResult').textContent=name+' ('+symbol+')\ndecimals: '+d+'\n你的餘額：'+formatUnits(b,d)+'\n總供給：'+formatUnits(supply,d);}
async function showStock(){await connected();const s=stock(),t=twd();const [price,b,tb,a]=await Promise.all([s.pricePerShare().then(p=>formatUnits(p,6)+' TWD').catch(e=>'不可用（'+(e.reason||e.shortMessage||'請檢查 oracle')+'）'),s.balanceOf(account),t.balanceOf(account),t.allowance(account,s.target)]);$('stockResult').textContent='每股：'+price+'\n股票代幣：'+formatUnits(b,18)+'\nTWD 餘額：'+formatUnits(tb,6)+'\n可代扣額度：'+formatUnits(a,6)+' TWD';}
function action(id,fn){$(id).addEventListener('click',async()=>{if(busy)return;busy=true;document.querySelectorAll('button').forEach(b=>b.disabled=true);$('status').textContent='處理中…';try{await fn();if($('status').textContent==='處理中…')$('status').textContent='完成';}catch(e){$('status').textContent=e.shortMessage||e.reason||e.message||String(e);}finally{busy=false;document.querySelectorAll('button').forEach(b=>b.disabled=false);}});}
action('connect',connected);
action('switch',async()=>{requireWallet();await window.ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:'0xaa36a7'}]});provider=signer=account=undefined;await connected();});
action('readClass',showClass);
action('transferClass',async()=>{await connected();const c=new Contract(address($('classAddress').value),ABI,signer);const d=await c.decimals();await receipt(await c.transfer(address($('recipient').value),amount($('classAmount').value,d)));await showClass();});
action('readStock',showStock);
action('faucet',async()=>{await connected();const v=$('faucetAmount').value.trim();if(!/^\d+$/.test(v)||BigInt(v)<=0n)throw new Error('領取數量須為正整數 TWD');await receipt(await twd().mintTWD(BigInt(v)));await showStock();});
action('approve',async()=>{await connected();await receipt(await twd().approve(stock().target,amount($('twdAmount').value,6)));await showStock();});
action('mint',async()=>{await connected();const s=stock(),raw=amount($('twdAmount').value,6);const allowed=await twd().allowance(account,s.target);if(allowed<raw)throw new Error('授權額度不足，請先完成步驟 1');await receipt(await s.mint(raw));await showStock();});
action('redeem',async()=>{await connected();await receipt(await stock().redeem(amount($('redeemAmount').value,18)));await showStock();});
if(window.ethereum?.on){for(const event of ['accountsChanged','chainChanged'])window.ethereum.on(event,()=>{provider=signer=account=undefined;$('account').textContent='帳戶或網路已變更，請重新連線';});}
