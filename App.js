const { createThirdwebClient, getContract } = thirdweb;
const { ConnectButton, useActiveAccount, useReadContract, TransactionButton } = thirdweb.react;
const { balanceOf } = thirdweb.extensions.erc1155;
const { claimERC20 } = thirdweb.extensions.airdrop;
const { defineChain } = thirdweb.chains;

const client = createThirdwebClient({ clientId: "189a85cd28b975cc8a024f2be6423a07" });
const polygon = defineChain(137);

function Roulette() { // Убрали "export default"
  const account = useActiveAccount();
  
  const nftContract = getContract({ client, chain: polygon, address: "0x99b91cEAF77d92958682cA404255CB523EE49454" });
  const airdropContract = getContract({ client, chain: polygon, address: "0xe616aABc2f365c679867eE563566307D236c5414" });

  const { data: nftBalance, isLoading } = useReadContract(balanceOf, {
    contract: nftContract,
    owner: account?.address || "0x0000000000000000000000000000000000000000",
    tokenId: 0n,
  });

  const hasKey = !!nftBalance && nftBalance > 0n;

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
      <h1>AGC Roulette</h1>
      <ConnectButton client={client} />

      {account && (
        <div style={{ marginTop: "20px" }}>
          {isLoading ? (
            <p>Проверка ключа...</p>
          ) : hasKey ? (
            <div>
              <p>✅ Ключ найден!</p>
              <TransactionButton
                transaction={() => claimERC20({
                  contract: airdropContract,
                  receiver: account.address,
                  quantity: "100"
                })}
                onTransactionConfirmed={() => alert("Выигрыш зачислен!")}
              >
                Крутить рулетку (Claim 100 AGC)
              </TransactionButton>
            </div>
          ) : (
            <p>❌ Нет NFT-ключа Genesis Core.</p>
          )}
        </div>
      )}
    </div>
  );
}
