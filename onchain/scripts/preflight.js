// Read-only classroom checks. No private key, signer, approve or transaction broadcast.
const { ethers } = require('ethers');
const deployed = require('../deployed.json');
async function main() {
  const req=new ethers.FetchRequest(process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com');
  req.timeout=12000;
  const provider=new ethers.JsonRpcProvider(req,undefined,{batchMaxCount:1});
  try {
    const net=await provider.getNetwork();
    if(net.chainId!==11155111n) throw new Error('Expected Sepolia chainId 11155111');
    const oracle=new ethers.Contract(deployed.contracts.oracle.address,deployed.contracts.oracle.abi,provider);
    const owner=await oracle.owner();
    const block=await provider.getBlock('latest');
    console.log(JSON.stringify({chainId:String(net.chainId),block:block.number,blockTime:new Date(block.timestamp*1000).toISOString(),oracle:oracle.target,owner,ownerIsFeeder:await oracle.feeders(owner)}));
    for(const item of deployed.stocks.filter(s=>['2330','2317'].includes(s.code))) {
      const token=new ethers.Contract(item.token,deployed.stockTokenAbi,provider);
      const price=await oracle.latestPrice(ethers.encodeBytes32String(item.code));
      const maxAge=await token.maxPriceAge();
      const reserve=await token.getReserveStatus();
      const age=BigInt(block.timestamp)-price.updatedAt;
      console.log(JSON.stringify({code:item.code,address:item.token,price:ethers.formatUnits(price.price,price.decimals),lastSubmittedAt:new Date(Number(price.updatedAt)*1000).toISOString(),ageSeconds:String(age),maxAgeSeconds:String(maxAge),stale:age>maxAge,paused:await token.paused(),recordedReserveTWD:ethers.formatUnits(reserve[0],6),actualTWD:ethers.formatUnits(reserve[2],6),supply:ethers.formatUnits(reserve[1],18)}));
    }
    console.log('Read-only checks finished. Submission time is NOT the source quote time. Wallet balances/allowance and actual mint/redeem still require your final test.');
  } finally { provider.destroy(); }
}
main().catch(e=>{console.error('Preflight failed:',e.shortMessage || e.code || e.name);process.exitCode=1;});
