import React from "react";
import Header from '../components/Header';
import EventsHead from "../components/Events/EventsHead";
import EventCardSection from "../components/Events/CardSection";
import { useFirebase } from "@/providers/FirebaseProvider";

export default function Events() {
    const { events } = useFirebase();

    console.log(events)

    //<EventCardSection events={events} />

    return (
        <>
            <Header />
            <main className="z-0">
                <section>
                    <EventsHead />
                </section>
                <section>
                    {events ? (
                        <EventCardSection events={events} />
                    ) : null}
                </section>
            </main >
        </>
    )
}