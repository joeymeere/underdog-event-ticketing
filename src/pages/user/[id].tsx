import { db } from "@/providers/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Header from "../../components/Layout/Header";
import React from "react";
import UserHead from "../../components/User/UserHead";
import EventCardSection from "@/components/Events/CardSection";
import { IconBuildingCircus, IconCoins, IconTicket } from "@tabler/icons-react";
import RegisteredSection from "@/components/User/RegisteredSection";
import { useFirebase } from "@/providers/FirebaseProvider";
import Layout from "@/components/Layout/Layout";
import SEO from "@/components/SEO";

export const getServerSideProps = async ({ query }: any) => {
    let id = query.id;
    let user = await getDoc(doc(db, `users/${id}`));
    if (!user) {
        throw new Error("No data found.");
    }

    let transactions = await getDocs(collection(db, `users/${id}/transactions`));

    let events = await getDocs(collection(db, `users/${id}/events`));

    let registrations = await getDocs(collection(db, `users/${id}/registered`));

    let keyItems = user.data();

    let transactionItems = transactions.docs.map((transaction) => {
        return {
            id: transaction.id,
            data: {
                ...transaction.data(),
            },
        };
    });

    let registeredItems = registrations.docs.map((ticket) => {
        return {
            id: ticket.id,
            data: {
                ...ticket.data(),
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
            registeredItems,
        },
    };
};

export default function User({ id, keyItems, transactionItems, eventItems, registeredItems }: any) {
    const { userDoc } = useFirebase();
    return (
        <>
            <SEO
                title={`${keyItems.firstName + " " + keyItems.lastName} | Underdog Ticketing`}
                description={`View ${keyItems.firstName + " " + keyItems.lastName}'s profile.`}
                image={keyItems.image}
            />
            <Layout>
                {userDoc?.id == id ? (
                    <div className="mb-8 -z-10">
                        <UserHead />
                        <div className="ml-auto mr-auto mt-16 p-2 rounded-xl w-8/12 h-2/6 bg-zinc-800 shadow-lg">
                            <div className="w-full grid grid-cols-4 border border-b-slate-600 border-t-transparent border-r-transparent border-l-transparent">
                                <div className="lg:col-span-1 rounded-xl mb-2 sm:col-span-2">
                                    <img src={keyItems.image} alt="User Image" className="rounded-xl" />
                                </div>
                                <div className="lg:col-span-3 gap-y-2 p-6 sm:col-span-2">
                                    <h2 className="text-4xl font-extrabold text-slate-100">{keyItems.firstName + " " + keyItems.lastName}</h2>
                                    <p className="mt-4 text-lg text-slate-400">{keyItems.email}</p>
                                    <p className="mt-4 text-md text-slate-400">{keyItems.walletAddress.slice(0, 5) + "..." + keyItems.walletAddress.slice(38, 44)}</p>
                                    <div className="mt-6">
                                        <div className="flex">
                                            <IconBuildingCircus size={20} color="white" />
                                            <p className="ml-2 text-sm text-slate-200">Events Created: {eventItems.length}</p>
                                        </div>
                                        <div className="flex mt-4">
                                            <IconTicket size={20} color="white" />
                                            <p className="ml-2 text-sm text-slate-200">Tickets Minted: {transactionItems.length}</p>
                                        </div>
                                        <div className="flex mt-4">
                                            <IconCoins size={20} color="white" />
                                            <p className="ml-2 text-sm text-slate-200">USDC Earned: ${transactionItems.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="p-4">
                                    <h2 className="text-4xl font-extrabold text-slate-100">Registered</h2>
                                </div>
                                <div>
                                    {registeredItems.length > 0 ? (
                                        <RegisteredSection registeredItems={registeredItems} />
                                    ) : (
                                        <div className="p-4">
                                            <p className="text-lg text-slate-400">No registrations...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="p-4">
                                    <h2 className="text-4xl font-extrabold text-slate-100">My Events</h2>
                                </div>
                                <div>
                                    {eventItems.length > 0 ? (
                                        <EventCardSection events={eventItems} />
                                    ) : (
                                        <div className="p-4">
                                            <p className="text-lg text-slate-400">No events yet...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mr-auto ml-auto mt-32">
                        <h1 className="text-4xl font-extrabold text-slate-100">Please Login to View Your Profile</h1>
                    </div>
                )}
            </Layout>
        </>
    )
}