import React from 'react';
import styles from "../styles/Transitions.module.css";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IconBolt, IconNotebook } from '@tabler/icons-react';

const Hero = () => {
    const router = useRouter();
    return (
        <section className="w-full relative">
            <div className="mt-56 mb-36 mr-auto ml-auto w-9/12">
                <div className="text-center">
                    <h1 className="z-0 text-6xl font-satoshibold leading-normal tracking-tight text-slate-100">
                        Elevate Your Event
                        <br></br>
                        <span className="z-0 text-6xl font-satoshibold leading-normal tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-600 sm:text-6xl">
                            Ticketing {" "}
                        </span>
                        Experience
                    </h1>
                    <p className="mt-4 z-0 font-satoshi text-xl lg:leading-8 text-slate-200 leading-[24px]">
                        Next generation ticketing and event management,
                        <br></br>
                        powered by the next generation of the open internet.
                    </p>
                </div>
                <div className="mt-8 mb-12 flex items-center justify-center gap-x-6">
                    <Link href="/events" passHref>
                        <button
                            className="text-lg font-satoshi text-slate-200 inline-flex gap-2 items-center rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 drop-shadow-lg px-5 py-2.5 shadow-sm transition ease-in-out delay-110 hover:translate-y-1 hover:scale-101 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            <IconBolt stroke={1} />
                            Get Started
                        </button>
                    </Link>
                    <Link href="/">
                        <button
                            className="text-lg font-satoshi text-slate-200 inline-flex gap-2 items-center rounded-xl border border-white drop-shadow-lg px-5 py-2.5 shadow-sm transition ease-in-out delay-110 hover:translate-y-1 hover:scale-101 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            <IconNotebook stroke={1} />
                            Learn More
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Hero;