import Header from "@/components/Layout/Header";
import { db } from "@/providers/firebase";
import { IconArmchair, IconArticle, IconBuildingCircus, IconCalendar, IconCircleArrowDown, IconLocation, IconUsers } from "@tabler/icons-react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import EventModal from "../../components/Events/EventModal";
import styles from "../../styles/Transitions.module.css";
import { useWallet } from "@solana/wallet-adapter-react";
import SEO from "@/components/SEO";

export const getServerSideProps = async ({ query }: any) => {
    let id = query.id;
    let event = await getDoc(doc(db, `events/${id}`));
    if (!event) {
        throw new Error("No data found.");
    }

    let participants = await getDocs(collection(db, `events/${id}/participants`));

    let keyItems = event.data();

    //@ts-ignore
    let getUser = await getDoc(doc(db, `users/${keyItems.creatorId}`))

    let user = getUser.data();

    let participantItems = participants.docs.map((participant) => {
        return {
            id: participant.id,
            data: {
                ...participant.data(),
            },
        };
    });

    return {
        props: {
            id,
            user,
            keyItems,
            participantItems,
        },
    };
};

export default function EventPage({ id, user, keyItems, participantItems }: any) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <SEO
                title={`${keyItems.name} | Underdog Ticketing`}
                description={keyItems.description}
                image={keyItems.image}
            />
            {open ? (
                <EventModal
                    id={id}
                    open={open}
                    setOpen={setOpen}
                    isPaywalled={keyItems.isPaywalled}
                    eventName={keyItems.name}
                    city={keyItems.city}
                    image={keyItems.image}
                    time={keyItems.startTime}
                    isTransferable={keyItems.isTransferable}
                    toPublicKey={keyItems.publicKey}
                    ticketPrice={keyItems.ticketPrice}
                    collectionId={keyItems.collectionId}
                />
            ) : null}
            <div className="mb-24 -z-10">
                <div className="ml-auto mr-auto mt-16 p-2 rounded-lg w-8/12 h-2/6 bg-zinc-800 shadow-lg">
                    <div className="w-full h-4/6">
                        <img src={keyItems.image} alt="Event Cover Image" className="w-full rounded-lg" />
                    </div>
                    <div className="p-4">
                        <div className="flex content-center justify-between">
                            <h1 className="text-4xl font-extrabold text-slate-100 max-[420px]:text-xl">{keyItems.name}</h1>
                            {keyItems.isPaywalled == true ? (
                                <p className="lg:text-4xl sm:text-xl font-extrabold text-slate-100">${keyItems.ticketPrice}</p>
                            ) : null}
                        </div>
                        <div className="my-4">
                            <p className="text-md font-regular text-slate-300">{keyItems.description}</p>
                        </div>
                        <div className="my-4 flex">
                            <IconCalendar size={24} color="white" />
                            <p className="ml-2 text-md text-slate-200">{moment.unix(keyItems.startTime).format("LLLL")}</p>
                        </div>
                        <div className="flex">
                            <IconLocation size={24} color="white" />
                            <p className="ml-2 text-md text-slate-200">{keyItems.location.city + "," + " " + keyItems.location.country}</p>
                        </div>
                        <div className="mt-4 flex">
                            <IconArmchair size={24} color="white" />
                            <p className="ml-2 text-md text-slate-200">{keyItems.totalTickets - keyItems.ticketsIssued} seats available</p>
                        </div>
                        {keyItems.ticketsIssued >= 5 ? (
                            <div className="mt-4 flex">
                                <IconUsers size={24} color="white" />
                                <p className="ml-2 text-md text-slate-200">{keyItems.ticketsIssued} people are attending this event</p>
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="ml-auto mr-auto mt-4 w-8/12 grid grid-cols-6 gap-x-6 sm:gap-y-4">
                    <div className="bg-zinc-800 lg:col-span-4 sm:col-span-6 max-[600px]:col-span-6 rounded-lg">
                        <div className="w-full flex content-center border border-b-slate-500 border-t-transparent border-r-transparent border-l-transparent p-6">
                            <IconCircleArrowDown size={28} color="white" />
                            <h2 className="ml-2 text-2xl font-extrabold text-slate-100">Register</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-zinc-400">Join this event by registering below.</p>
                        </div>
                        <div className="px-6 pb-4">
                            {keyItems.ticketsIssued >= keyItems.totalTickets ? (
                                <button disabled className="rounded-md w-full bg-gray-400 px-4.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">Sold Out</button>
                            ) : (
                                <button onClick={() => setOpen(true)} className="rounded-md w-full bg-emerald-400 px-4.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">Register</button>
                            )}
                        </div>
                    </div>
                    <div className="bg-zinc-800 lg:col-span-2 sm:col-span-6 max-[600px]:col-span-6 rounded-lg">
                        <div className="w-full flex content-center border border-b-slate-500 border-t-transparent border-r-transparent border-l-transparent p-6">
                            <IconBuildingCircus size={28} color="white" />
                            <h2 className="ml-2 text-2xl font-extrabold text-slate-100">Hosts</h2>
                        </div>
                        <div className="px-6 py-6 flex">
                            <img
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                src={user.image}
                                alt="Event Host Photo"
                            />
                            <p className="ml-2 text-md text-slate-200">{user.firstName + " " + user.lastName}</p>
                        </div>
                        <div className="px-6 pb-4">
                            <button className="rounded-md w-full bg-emerald-400 px-4.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">Contact</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}