import { db } from "@/providers/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Header from "../../components/Header";
import React from "react";
import UserHead from "../../components/User/UserHead";
import { useWallet } from "@solana/wallet-adapter-react";
import EventCardSection from "@/components/Events/CardSection";
import { IconBuildingCircus, IconCoins, IconTicket } from "@tabler/icons-react";

export const getServerSideProps = async ({ query }: any) => {
    let id = query.id;
    let user = await getDoc(doc(db, `users/${id}`));
    if (!user) {
        throw new Error("No data found.");
    }

    let transactions = await getDocs(collection(db, `users/${id}/transactions`));

    let events = await getDocs(collection(db, `users/${id}/events`));

    let keyItems = user.data();

    let transactionItems = transactions.docs.map((transaction) => {
        return {
            id: transaction.id,
            data: {
                ...transaction.data(),
            },
        };
    });

    let eventItems = events.docs.map((event) => {
        return {
            id: event.id,
            data: {
                ...event.data(),
            },
        };
    });

    return {
        props: {
            id,
            keyItems,
            transactionItems,
            eventItems,
        },
    };
};

export default function User({ id, keyItems, transactionItems, eventItems }: any) {
    return (
        <>
            <Header />
            <div className="mb-8 -z-10">
                <UserHead />
                <div className="ml-auto mr-auto mt-16 p-2 rounded-lg w-8/12 h-2/6 bg-zinc-800 shadow-lg">
                    <div className="grid grid-cols-4">
                        <div className="col-span-1">
                            <img src={keyItems.image} alt="User Image" className="rounded-xl" />
                        </div>
                        <div className="col-span-3 gap-y-2 p-6">
                            <h2 className="text-4xl font-extrabold text-slate-100">{keyItems.firstName + " " + keyItems.lastName}</h2>
                            <p className="mt-4 text-xl text-slate-400">{keyItems.walletAddress}</p>
                            <div className="mt-6">
                                <div className="flex">
                                    <IconBuildingCircus size={26} color="white" />
                                    <p className="ml-2 text-xl text-slate-200">Events Created: {eventItems.length}</p>
                                </div>
                                <div className="flex mt-4">
                                    <IconTicket size={26} color="white" />
                                    <p className="ml-2 text-xl text-slate-200">Tickets Minted: {transactionItems.length}</p>
                                </div>
                                <div className="flex mt-4">
                                    <IconCoins size={26} color="white" />
                                    <p className="ml-2 text-xl text-slate-200">USDC Earned: ${transactionItems.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="p-4">
                            <h2 className="text-4xl font-extrabold text-slate-100">My Events</h2>
                        </div>
                        <div className="p-4">
                            {eventItems.length > 0 ? (
                                <EventCardSection events={eventItems} />
                            ) : (
                                <p className="text-lg text-slate-400">No events yet...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}