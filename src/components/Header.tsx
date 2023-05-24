import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { IconBolt } from "@tabler/icons-react";
import SignIn from "./Auth/SignIn";
import { useWallet } from "@solana/wallet-adapter-react";
import { useFirebase } from "@/providers/FirebaseProvider";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function Header() {
    const [open, setOpen] = useState(false);
    const { userDoc, setUserDoc } = useFirebase();
    const { setVisible } = useWalletModal();
    const { connected, disconnect } = useWallet();

    const disconnectWallet = () => {
        disconnect();
    };

    return (
        <>
            {open ? (
                <SignIn open={open} setOpen={setOpen} />
            ) : null}
            <nav className="sticky z-100 top-5 w-9/12 rounded-2xl mr-auto ml-auto z-auto bg-zinc-800 backdrop-filter backdrop-blur-lg bg-opacity-30">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex space-x-4 text-white">
                            <div className="hover:bg-emerald-300/25 rounded-xl p-2">
                                <a className="text-md" href="/events">Events</a>
                            </div>
                            <div className="hover:bg-emerald-300/25 rounded-xl p-2">
                                <a className="text-md" href="/create">Create</a>
                            </div>
                        </div>
                        <Link href="/">
                            <Image
                                priority
                                src="/logo.svg"
                                alt="Underdog Protocol Logo"
                                width={40}
                                height={40}
                            />
                        </Link>
                        <div className="flex space-x-4">
                            {userDoc != null ? (
                                <div className="border-slate-900 rounded-xl p-2 hover:bg-emerald-300/25">
                                    <a href={`/user/${userDoc.id}`}>
                                        <IconBolt size={26} color="white" />
                                    </a>
                                </div>
                            ) : null}
                            {connected ? (
                                <>
                                    {userDoc != null ? (
                                        <a
                                            onClick={
                                                () => {
                                                    disconnectWallet()
                                                    setUserDoc(null);
                                                }
                                            }
                                            className="inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-3.5 py-2.5 text-md font-semibold text-slate-200 shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        >
                                            Sign-Out
                                        </a>
                                    ) : (
                                        <a
                                            href="/create-user"
                                            className="inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-3.5 py-2.5 text-md font-semibold text-slate-200 shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        >
                                            Account
                                        </a>
                                    )}
                                </>
                            ) : (
                                <a
                                    onClick={() => setVisible(true)}
                                    className="inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-3.5 py-2.5 text-md font-semibold text-slate-200 shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    Sign-In
                                </a>
                            )}

                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Header;