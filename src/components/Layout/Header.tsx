import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { IconBolt, IconLogin, IconLogout, IconUserBolt } from "@tabler/icons-react";
import SignIn from "../Auth/SignIn";
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
            <nav className="sticky z-50 top-5 w-9/12 rounded-2xl mr-auto ml-auto bg-zinc-800 backdrop-filter backdrop-blur-lg bg-opacity-30">
                    <div className="w-full px-4 h-16 grid grid-cols-3 items-center justify-between">
                        <div className="col-span-1 flex space-x-4 text-white">
                            <div className="hover:bg-emerald-300/25 rounded-xl p-2">
                                <a className="text-md font-satoshi" href="/events">Events</a>
                            </div>
                            <div className="hover:bg-emerald-300/25 rounded-xl p-2">
                                <a className="text-md font-satoshi" href="/create">Create</a>
                            </div>
                             <div className="hover:bg-emerald-300/25 rounded-xl p-2">
                                <a className="text-md font-satoshi" href="https://underdogprotocol.com">About</a>
                            </div>
                        </div>
                        <Link href="/" passHref>
                            <Image
                                priority
                                src="/underdogwhite.svg"
                                alt="Underdog Protocol Logo"
                                width={40}
                                height={40}
                                className="mx-auto"
                            />
                        </Link>
                        <div className="flex space-x-4 ml-auto">
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
                                                async () => {
                                                    await disconnectWallet()
                                                    await setUserDoc(null);
                                                }
                                            }
                                            className="inline-flex gap-2 items-center rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-2.5 text-md font-satoshi text-slate-200 shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        >
                                            <IconLogout stroke={1} />
                                            Sign-Out
                                        </a>
                                    ) : (
                                        <a
                                            href="/create-user"
                                            className="inline-flex gap-2 items-center rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-2.5 text-md font-satoshi text-slate-200 shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        >
                                            <IconUserBolt stroke={1} />
                                            Account
                                        </a>
                                    )}
                                </>
                            ) : (
                                <a
                                    onClick={() => setVisible(true)}
                                    className="inline-flex gap-2 items-center rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-2.5 text-md font-satoshi text-slate-200 shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    <IconLogin stroke={1} />
                                    Sign-In
                                </a>
                            )}

                        </div>
                    </div>
            </nav>
        </>
    );
}

export default Header;