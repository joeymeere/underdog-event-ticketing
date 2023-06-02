import React from "react";
import EventsHead from "../components/Events/EventsHead";
import EventCardSection from "../components/Events/CardSection";
import { useFirebase } from "@/providers/FirebaseProvider";
import LoadingSection from "@/components/LoadingSection";

export default function Events() {
    const { events } = useFirebase();

    return (
        <>
            <main className="z-0">
                <section>
                    <EventsHead />
                </section>
                <section>
                    {events ? (
                        <EventCardSection events={events} />
                    ) : (
                        <LoadingSection />
                    )}
                </section>
            </main >
        </>
    )
}