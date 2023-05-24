import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import styles from "../../styles/Transitions.module.css";
import signIn from "../../lib/auth/signIn";
import { useFirebase } from '@/providers/FirebaseProvider';
import mintPaywalledTicket from '@/lib/mintPaywalledTicket';
import moment from "moment";
import mintTicket from '@/lib/mintTicket';
import { useTransaction } from '@/providers/TransactionProvider';
import { toast } from 'react-hot-toast';
import { getClaimLink } from '@/lib/getClaimLink';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/providers/firebase';

//TODO: Google-OAuth provider & Wallet implementation with Firebase Auth

export default function EventModal({ id, open, setOpen, isPaywalled, eventName, city, time, image, isTransferable, toPublicKey, ticketPrice, collectionId }: any) {
    const { setVisible } = useWalletModal();
    const { connected, publicKey } = useWallet();
    const { userDoc } = useFirebase();
    const fullName = userDoc?.data.firstName + " " + userDoc?.data.lastName;
    const { sendUSDC } = useTransaction();
    const [email, setEmail] = useState<string>();
    const [name, setName] = useState<string>();
    const cancelButtonRef = useRef(null);

    async function handleRegister() {
        try {
            const mint = await mintTicket(eventName, image, city, moment.unix(time).format("l"), publicKey?.toString() as string, isTransferable, collectionId);

            if (isTransferable == true && userDoc) {
                const claimLink = await getClaimLink(collectionId, mint?.nftId);

                await addDoc(collection(db, `users/${userDoc.id}/toBeClaimed`), {
                    projectId: collectionId,
                    nftId: mint?.nftId,
                    eventId: id,
                    claimLink: claimLink,
                    eventName: eventName,
                    image: image
                })
            }

            if (userDoc) {
                await addDoc(collection(db, `users/${userDoc.id}/registered`), {
                    projectId: collectionId,
                    nftId: mint?.nftId,
                    eventId: id,
                    eventName: eventName,
                    image: image
                })
            }

            await addDoc(collection(db, `events/${id}/participants`), {
                name: name,
                email: email,
                mintAddress: mint?.mintAddress,
                nftId: mint?.nftId,
            })

            setOpen(false)
        } catch (err) {
            throw new Error(`${err}`)
        }
    }

    async function handleRegisterWithPaywall() {
        try {
            await sendUSDC(toPublicKey, publicKey, ticketPrice);
            const mint = await mintTicket(eventName, image, city, moment.unix(time).format("l"), publicKey?.toString() as string, isTransferable, collectionId)

            await addDoc(collection(db, `events/${id}/participants`), {
                name: name,
                email: email,
                mintAddress: mint?.mintAddress,
                nftId: mint?.nftId,
            })
        } catch (err) {
            throw new Error(`${err}`)
        }
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-zinc-800 bg-opacity-80 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-zinc-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                        <form className="space-y-6">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-200">
                                                    Name
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        autoComplete="name"
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                        className="block w-full rounded-md border-0 bg-zinc-700 py-1.5 px-2 text-slate-200 shadow-sm ring-1 ring-inset ring-zinc-600 placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 filled:bg-zinc-700 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-200">
                                                    Email
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        autoComplete="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                        className="block w-full rounded-md border-0 bg-zinc-700 py-1.5 px-2 text-slate-200 shadow-sm ring-1 ring-inset ring-zinc-600 placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 filled:bg-zinc-700 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                            {isPaywalled ? (
                                                <div>
                                                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-slate-200">
                                                        Ticket Price
                                                    </label>
                                                    <div className="mt-2">
                                                        <p className="text-xl font-extrabold text-slate-200">{ticketPrice} USDC</p>
                                                    </div>
                                                </div>
                                            ) : null}
                                            {isPaywalled ? (
                                                <>
                                                    {connected ? (
                                                        <div>
                                                            <a
                                                                onClick={() =>
                                                                    toast.promise(
                                                                        handleRegisterWithPaywall(),
                                                                        {
                                                                            loading: "Submitting...",
                                                                            success: () => {
                                                                                if (isTransferable == false) {
                                                                                    return "Success! Your ticket has been minted."
                                                                                } else {
                                                                                    return "Success! Check your dashboard to claim."
                                                                                }
                                                                            },
                                                                            error: (err) => `${err}`
                                                                        })
                                                                }
                                                                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                                            >
                                                                Pay & Register
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <button
                                                                onClick={() =>
                                                                    setVisible(true)
                                                                }
                                                                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                                            >
                                                                Connect Wallet
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {connected ? (
                                                        <div>
                                                            <a
                                                                onClick={() =>
                                                                    toast.promise(
                                                                        handleRegister(),
                                                                        {
                                                                            loading: "Submitting...",
                                                                            success: () => {
                                                                                if (isTransferable == false) {
                                                                                    return "Success! Your ticket has been minted."
                                                                                } else {
                                                                                    return "Success! Check your dashboard to claim."
                                                                                }
                                                                            },
                                                                            error: (err) => `${err}`
                                                                        })
                                                                }
                                                                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                                            >
                                                                Register
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <button
                                                                onClick={() => setVisible(true)}
                                                                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                                            >
                                                                Connect Wallet
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}