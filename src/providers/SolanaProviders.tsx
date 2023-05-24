import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    GlowWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
    BraveWalletAdapter,
    BackpackWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import React, { useMemo } from "react";

export const DEFAULT_ENDPOINT = `https://rpc.helius.xyz/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`;

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

export const SolanaProviders = ({ children }: any) => {
    const wallets = useMemo(
        () => [
            new GlowWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new BraveWalletAdapter(),
            new BackpackWalletAdapter(),
            new PhantomWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={DEFAULT_ENDPOINT}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};