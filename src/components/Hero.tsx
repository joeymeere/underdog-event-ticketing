import React from 'react';
import styles from "../styles/Transitions.module.css";
import Link from 'next/link';

const Hero = () => {
    return (
        <section className="w-full relative -z-10">
            <div className="mt-56 mb-36 mr-auto ml-auto w-9/12">
                <div className={styles.fadeInUp}>
                    <div className="text-center">
                        <h1 className="z-0 text-6xl font-extrabold tracking-wide leading-normal tracking-tight text-slate-100 sm:text-6xl">
                            Event{" "}
                            <span className="z-0 text-6xl font-extrabold tracking-wide leading-normal tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-emerald-400 sm:text-6xl">
                                Ticketing{" "}
                            </span>
                            With NFTs
                        </h1>
                        <p className="lg:mt-4 mt-6 z-0 font-open-sans text-lg lg:leading-8 text-slate-200 leading-[24px]">
                            Create events & distribute event tickets, powered by the Underdog API.
                        </p>
                        <div className="mt-6 mb-12 flex items-center justify-center gap-x-6">
                            <div className="inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-300 to-emerald-500 drop-shadow-lg px-6 py-2.5 shadow-sm hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                <a
                                    href="#"
                                    className="text-md font-bold text-slate-200"
                                >
                                    Enter
                                </a>
                            </div>
                            <div
                                className="inline-flex items-center rounded-xl border-emerald-600 drop-shadow-lg px-6 py-2.5 shadow-sm hover:bg-emerald-300/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                <a href="#" className="font-open-sans text-md font-bold text-slate-200">
                                    Learn More →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero;