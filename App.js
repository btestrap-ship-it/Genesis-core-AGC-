import { createThirdwebClient, getContract } from "thirdweb";
import { ConnectButton, useActiveAccount, useReadContract, TransactionButton } from "thirdweb/react";
import { balanceOf } from "thirdweb/extensions/erc1155";
import { claimERC20 } from "thirdweb/extensions/airdrop"; // функция для твоего контракта

const client = createThirdwebClient({ clientId: "189a85cd28b975cc8a024f2be6423a07" });

export default function Roulette() {
  const account = useActiveAccount();
  
  // Подключаем твои контракты
  const nftContract = getContract({ client, chain: 137, address: "0x99b91cEAF77d92958682cA404255CB523EE49454" });
  const airdropContract = getContract({ client, chain: 137, address: "0xe616aABc2f365c679867eE563566307D236c5414" });

  // 1. Проверяем наличие NFT-ключа (ID 0)
  const { data: nftBalance } = useReadContract(balanceOf, {
    contract: nftContract,
    owner: account?.address || "",
    tokenId: 0n,
  });

  const hasKey = nftBalance > 0n;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>AGC Roulette</h1>
      <ConnectButton client={client} />

      {account && (
        <div style={{ marginTop: "20px" }}>
          {hasKey ? (
            <div>
              <p>✅ Ключ найден! Ты можешь крутить рулетку.</p>
              {/* Кнопка вызова выигрыша */}
              <TransactionButton
                transaction={() => claimERC20({
                  contract: airdropContract,
                  receiver: account.address,
                  quantity: "100" // Сумма выигрыша (настрой под себя)
                })}
                onTransactionConfirmed={() => alert("Выигрыш зачислен!")}
              >
                Крутить рулетку (Claim 100 AGC)
              </TransactionButton>
            </div>
          ) : (
            <p>❌ У тебя нет NFT-ключа Genesis Core. Доступ закрыт.</p>
          )}
        </div>
      )}
    </div>
  );
}
