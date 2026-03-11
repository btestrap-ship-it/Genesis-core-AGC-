const clientId = "189a85cd28b975cc8a024f2be6423a07"

const NFT_CONTRACT = "0x99b91cEAF77d92958682cA404255CB523EE49454"

const TOKEN_CONTRACT = "0xe56a08f3a9c6f24473d6f8a03a12e2d62409c1f9"

const TOKEN_ID = 0

const PRIZES = [70,350,700,1750,3500,7000]

let provider
let signer
let sdk
let user
let balance=0
let spinning=false
let hasNFT=false

async function connectWallet(){

if(!window.ethereum){

alert("Install MetaMask")

return

}

await window.ethereum.request({method:'eth_requestAccounts'})

provider = new ethers.providers.Web3Provider(window.ethereum)

signer = provider.getSigner()

user = await signer.getAddress()

document.getElementById("wallet").innerText = user

sdk = new thirdweb.ThirdwebSDK(provider,{
clientId:clientId,
chain:"polygon"
})

checkNFT()

}

async function checkNFT(){

const contract = await sdk.getContract(NFT_CONTRACT)

const nftBalance = await contract.erc1155.balanceOf(user,TOKEN_ID)

if(nftBalance>0){

hasNFT=true

document.getElementById("nft-status").innerText="NFT ACTIVE"

}else{

document.getElementById("nft-status").innerText="NO NFT"

}

}

function openRoulette(){

document.getElementById("roulette").style.display="flex"

}

function closeRoulette(){

document.getElementById("roulette").style.display="none"

}

function spin(){

if(spinning)return

spinning=true

const wheel=document.getElementById("wheel")

const rand=Math.floor(Math.random()*360)

const rot=1800+rand

wheel.style.transform=`rotate(${rot}deg)`

setTimeout(()=>{

const deg=(360-(rot%360))%360

const index=Math.floor(deg/60)

const win=PRIZES[index]

alert("WIN +"+win+" SAGC")

balance+=win

document.getElementById("balance").innerText=balance

spinning=false

closeRoulette()

},4000)

}

function withdraw(){

alert("Withdrawal will be added with smart contract")

}