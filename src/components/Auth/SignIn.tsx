import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import styles from "../../styles/Transitions.module.css";
import signIn from "../../lib/auth/signIn";

//TODO: Google-OAuth provider & Wallet implementation with Firebase Auth

export default function SignIn({ open, setOpen }: any) {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string | undefined>();
    const { setVisible } = useWalletModal();
    const { connected } = useWallet();
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        const checkConnected = () => {
            if (connected) {
                setOpen(false);
                //TODO: add redirect for users without an account
            }
        }
        checkConnected();
    }, [connected])

    const connectWallet = () => {
        setVisible(true);
    };

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
                            <div className={styles.fadeInUp}>
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-zinc-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                            <img
                                                className="mx-auto h-10 w-auto"
                                                src="/logo.svg"
                                                alt="Underdog Protocol"
                                            />
                                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-slate-100">
                                                Sign in to your account
                                            </h2>
                                        </div>

                                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                                            <form className="space-y-6" onSubmit={() => signIn(email as string, password as string)} action="#" method="POST">
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-200">
                                                        Email address
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
                                                            className="block w-full rounded-md border-0 bg-zinc-700 py-1.5 text-slate-200 shadow-sm ring-1 ring-inset ring-zinc-600 placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between">
                                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-200">
                                                            Password
                                                        </label>
                                                        <div className="text-sm">
                                                            <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-500">
                                                                Forgot password?
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <input
                                                            id="password"
                                                            name="password"
                                                            type="password"
                                                            autoComplete="current-password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                            className="block w-full rounded-md border-0 bg-zinc-700 py-1.5 text-slate-200 shadow-sm ring-1 ring-inset ring-zinc-600 placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <button
                                                        type="submit"
                                                        className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                                    >
                                                        Sign in
                                                    </button>
                                                    <div className="mt-2 px-6 sm:px-0 max-w-sm">
                                                        <button type="button" className="text-white w-full bg-emerald-600 hover:bg-emerald-400/90 focus:ring-4 focus:outline-none focus:ring-gray-300/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
                                                            <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z">
                                                            </path>
                                                            </svg>
                                                            Sign Up with Google
                                                            <div>
                                                            </div>
                                                        </button>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                        onClick={() => setOpen(false)}
                                                        ref={cancelButtonRef}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>

                                            <p className="mt-10 text-center text-sm text-slate-200">
                                                Want another option?{' '}
                                                <a href="#connect" onClick={() => connectWallet()} className="font-semibold leading-6 text-emerald-600 hover:text-emerald-500">
                                                    Sign-In with Solana Wallet
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog >
        </Transition.Root >
    )
}