import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";

export async function sendUSDC(toPublicKey: string, fromPublicKey: string, amount: number) {
  const USDC_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

  const toWallet = new web3.PublicKey(toPublicKey);
  const fromWallet = new web3.PublicKey(fromPublicKey);

  let connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));

  let USDC_pubkey = new web3.PublicKey(USDC_ADDRESS);
  let fromTokenAccount = await splToken.getAssociatedTokenAddressSync(USDC_pubkey, fromWallet);
  let toTokenAccount = await splToken.getAssociatedTokenAddressSync(USDC_pubkey, toWallet);
  let toTokenAccountInfo = await connection.getAccountInfo(toTokenAccount);

  console.log(fromTokenAccount, toTokenAccount);
  let transaction = new web3.Transaction();

  if (!toTokenAccountInfo || !toTokenAccountInfo.data) {
    await transaction.add(
      splToken.createAssociatedTokenAccountInstruction(toWallet, toTokenAccount, toWallet, USDC_pubkey)
    );
  }

  await transaction.add(
    splToken.createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      fromWallet,
      amount,
      [],
      splToken.TOKEN_PROGRAM_ID
    )
  );

  //@ts-ignore
  let tx = connection.sendTransaction(transaction, [fromPublicKey]).catch((err) => {
    console.log(err);
    throw new Error("User rejected the request.");
  });
}
