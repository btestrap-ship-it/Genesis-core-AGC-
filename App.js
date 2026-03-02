import { ThirdwebProvider, ConnectButton, useContract, useOwnedNFTs, useAddress, Web3Button } from "@thirdweb-dev/react";
import { useState } from "react";
import { ethers } from "ethers";

// 1. ТВОИ КОНФИГУРАЦИИ
const CLIENT_ID = "ТВОЙ_CLIENT_ID_ИЗ_DASHBOARD_THIRDWEB"; // Получи бесплатно на thirdweb.com
const NFT_ADDR = "0x99b91cEAF77d92958682cA404255CB523EE49454";
const TOKEN_ADDR = "0xe56a08f3A9c6f24473D6F8a03A12E2d62409c1F9";

export default function App() {
  return (
    <ThirdwebProvider activeChain="polygon" clientId={CLIENT_ID}>
      <RouletteInterface />
    </ThirdwebProvider>
  );
}

function RouletteInterface() {
  const address = useAddress();
  const { contract: nftContract } = useContract(NFT_ADDR);
  const { data: ownedNFTs } = useOwnedNFTs(nftContract, address);
  
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(null);

  // ПОИСК ЛУЧШЕГО ЯДРА ДЛЯ БОНУСА
  const level = ownedNFTs?.[0]?.metadata?.attributes?.find(a => a.trait_type === "Level")?.value || 0;
  const multiplier = 1 + (level / 1000000);

  return (
    <div style={{ 
      background: "#050505", color: "#fff", minHeight: "100vh", 
      display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" 
    }}>
      <h1 style={{ color: "gold", textShadow: "0 0 15px gold" }}>AGC ARCHITECTS HUB</h1>
      <ConnectButton theme="dark" />

      {address && ownedNFTs?.length > 0 ? (
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          {/* ИНДИКАТОР МОЩИ (Для инвесторов) */}
          <div style={{ 
            border: "1px solid #333", background: "#111", padding: "20px", 
            borderRadius: "20px", boxShadow: "0 0 30px rgba(0,255,255,0.1)" 
          }}>
            <h3 style={{ margin: 0 }}>Active Core: {ownedNFTs[0].metadata.name}</h3>
            <p style={{ color: "cyan" }}>Current Multiplier: x{multiplier.toFixed(2)}</p>
          </div>

          {/* КРУТАЯ АНИМИРОВАННАЯ РУЛЕТКА */}
          <div style={{ 
            width: "280px", height: "280px", borderRadius: "50%", 
            border: "10px double gold", margin: "40px auto",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "80px",
            transition: "transform 3s cubic-bezier(0.1, 0, 0.1, 1)",
            transform: spinning ? "rotate(1800deg)" : "rotate(0deg)",
            boxShadow: spinning ? "0 0 50px gold" : "0 0 20px #222"
          }}>
            {spinning ? "🌀" : "💎"}
          </div>

          {!spinning && !win && (
            <button 
              onClick={() => { setSpinning(true); setTimeout(() => { setWin(Math.floor(50 * multiplier)); setSpinning(false); }, 3000); }}
              style={{ background: "gold", color: "#000", padding: "15px 50px", borderRadius: "40px", fontWeight: "bold", border: "none", cursor: "pointer" }}
            >
              SPIN FOR $WAGC
            </button>
          )}

          {win && (
            <div style={{ marginTop: "20px", animation: "fadeIn 1s" }}>
              <h2 style={{ color: "#00ff00" }}>WIN: {win} $WAGC</h2>
              <Web3Button 
                contractAddress={TOKEN_ADDR} 
                action={(c) => c.erc20.transfer(address, ethers.utils.parseUnits(win.toString(), 18))}
              >
                CLAIM REWARDS
              </Web3Button>
            </div>
          )}
        </div>
      ) : address ? (
        <p style={{ marginTop: "50px", color: "red" }}>ACCESS DENIED: No Architect Core detected.</p>
      ) : null}
    </div>
  );
}
