import React from "react";
import { createContext, useContext } from "react";
import {
    useAnchorWallet,
    useWallet,
} from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";

const TransactionContext = createContext<any>(null);

export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error("Parent must be wrapped inside StockpileProvider");
    }
    return context;
};

export const TransactionProvider = ({ children }: any) => {
    const anchorWallet = useAnchorWallet();
    const { publicKey, connected } = useWallet();

    let connection = new web3.Connection(`https://rpc.helius.xyz/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`);

    async function sendUSDC(toPublicKey: string, fromPublicKey: string, amount: number) {
        const USDC_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

        const toWallet = new web3.PublicKey(toPublicKey);
        const fromWallet = new web3.PublicKey(fromPublicKey);


        let USDC_pubkey = new web3.PublicKey(USDC_ADDRESS);
        let fromTokenAccount = await splToken.getAssociatedTokenAddress(USDC_pubkey, fromWallet);
        let toTokenAccount = await splToken.getAssociatedTokenAddress(USDC_pubkey, toWallet);
        let toTokenAccountInfo = await connection.getAccountInfo(toTokenAccount);

        let transaction = new web3.Transaction();

        if (!toTokenAccountInfo || toTokenAccountInfo.data) {
            await transaction.add(
                splToken.createAssociatedTokenAccountInstruction(toWallet, toTokenAccount, toWallet, USDC_pubkey)
            );
        }

        await transaction.add(splToken.createTransferInstruction(fromTokenAccount, toTokenAccount, fromWallet, amount, [], splToken.TOKEN_PROGRAM_ID));

        transaction.recentBlockhash = (
            await connection.getLatestBlockhash()
        ).blockhash;

        transaction.feePayer = anchorWallet?.publicKey;

        const tx = await anchorWallet?.signTransaction(transaction)
            .catch((err) => {
                console.log(err);
                throw new Error("User rejected the request.");
            });

        const buffer = tx?.serialize().toString("base64");

        console.log("Sending...");

        //@ts-ignore
        let txid = await connection.sendEncodedTransaction(buffer)
            .catch((err) => {
                throw new Error(`Unexpected Error Occurred: ${err}`);
            });

        console.log(`Transaction submitted: https://xray.helius.xyz/${txid}/tx`);

        return {
            txhash: String(txid),
        };
    }



    return (
        <TransactionContext.Provider
            value={{
                publicKey,
                connected,
                anchorWallet,
                sendUSDC,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};
