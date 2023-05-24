import React from "react";
import Header from '../components/Header';
import EventsHead from "../components/Events/EventsHead";
import EventCardSection from "../components/Events/CardSection";
import { useFirebase } from "@/providers/FirebaseProvider";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/providers/firebase";

export async function getServerSideProps(context: any) {
    let events = await getDocs(collection(db, `events`));
    if (!events) {
        throw new Error("No data found.");
    }

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
            eventItems,
        }
    }
}

export default function Events({ eventItems }: any) {

    return (
        <>
            <Header />
            <main className="z-0">
                <section>
                    <EventsHead />
                </section>
                <section>
                    {eventItems ? (
                        <EventCardSection events={eventItems} />
                    ) : null}
                </section>
            </main >
        </>
    )
}