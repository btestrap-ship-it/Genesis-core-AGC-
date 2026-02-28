import { ConnectButton, useContract, useAddress, useOwnedNFTs, Web3Button } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

// АДРЕСА ВАШИХ КОНТРАКТОВ (Вставьте свои из Dashboard)
const NFT_CONTRACT_ADDRESS = "0x99b91cEAF77d92958682cA404255CB523EE49454";
const TOKEN_CONTRACT_ADDRESS = "А0xe56a08f3A9c6f24473D6F8a03A12E2d62409c1F9";

export default function RouletteGame() {
  const address = useAddress(); // Адрес кошелька игрока
  const { contract: nftContract } = useContract(NFT_CONTRACT_ADDRESS);
  const { contract: tokenContract } = useContract(TOKEN_CONTRACT_ADDRESS);

  // 1. ПРОВЕРКА NFT-ДОСТУПА
  const { data: ownedNFTs, isLoading } = useOwnedNFTs(nftContract, address);
  const hasAccess = ownedNFTs && ownedNFTs.length > 0;

  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [lastBonusTime, setLastBonusTime] = useState(localStorage.getItem("lastBonus") || 0);

  // 2. ЛОГИКА РУЛЕТКИ (Расчет выигрыша)
  const spinRoulette = async () => {
    setIsSpinning(true);
    // Имитация вращения 2 секунды
    setTimeout(() => {
      const winAmount = Math.floor(Math.random() * 100) + 10; // Случайно от 10 до 110 WAGC
      setResult(winAmount);
      setIsSpinning(false);
    }, 2000);
  };

  // 3. ПРОВЕРКА СУТОЧНОГО БОНУСА
  const canClaimBonus = () => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    return now - lastBonusTime > dayInMs;
  };

  if (isLoading) return <div>Загрузка данных блокчейна...</div>;

  return (
    <div style={{ textAlign: "center", padding: "50px", fontFamily: "sans-serif" }}>
      <h1>WAGC NFT Roulette</h1>
      <ConnectButton />

      {!address ? (
        <p>Пожалуйста, подключите кошелек</p>
      ) : !hasAccess ? (
        <div style={{ color: "red", marginTop: "20px" }}>
          <h2>Доступ закрыт!</h2>
          <p>Для игры необходим NFT-ключ на вашем балансе.</p>
        </div>
      ) : (
        <div style={{ marginTop: "30px" }}>
          <h2>Добро пожаловать, игрок!</h2>
          
          {/* ВИЗУАЛ РУЛЕТКИ */}
          <div style={{ 
            width: "200px", height: "200px", border: "10px solid gold", 
            borderRadius: "50%", margin: "20px auto", display: "flex", 
            alignItems: "center", justifyContent: "center",
            transition: "transform 2s", transform: isSpinning ? "rotate(1080deg)" : "rotate(0deg)"
          }}>
            {isSpinning ? "🌀" : "💰"}
          </div>

          <button onClick={spinRoulette} disabled={isSpinning} style={{ padding: "10px 20px", fontSize: "18px", cursor: "pointer" }}>
            {isSpinning ? "Вращение..." : "КРУТИТЬ РУЛЕТКУ"}
          </button>

          {/* 4. КНОПКА ВЫПЛАТЫ (Вызывает контракт) */}
          {result && !isSpinning && (
            <div style={{ marginTop: "20px" }}>
              <p>Вы выиграли: {result} WAGC!</p>
              <Web3Button
                contractAddress={TOKEN_CONTRACT_ADDRESS}
                action={(contract) => contract.erc20.transfer(address, ethers.utils.parseUnits(result.toString(), 18))}
                onSuccess={() => {
                  alert("Токены отправлены!");
                  setResult(null);
                }}
              >
                Забрать выигрыш
              </Web3Button>
            </div>
          )}

          <hr style={{ margin: "40px 0" }} />

          {/* 5. ЕЖЕДНЕВНЫЙ БОНУС */}
          <h3>Ежедневный бонус</h3>
          <button 
            disabled={!canClaimBonus()} 
            onClick={() => {
              const now = Date.now();
              localStorage.setItem("lastBonus", now);
              setLastBonusTime(now);
              alert("Бонус 50 WAGC начислен (логика отправки аналогична рулетке)");
            }}
            style={{ padding: "10px", cursor: "pointer" }}
          >
            {canClaimBonus() ? "Забрать суточный бонус" : "Бонус уже получен (приходите завтра)"}
          </button>
        </div>
      )}
    </div>
  );
}
