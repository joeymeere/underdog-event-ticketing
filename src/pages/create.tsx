import React from "react";
import CreateHead from "../components/Create/CreateHead";
import CreateForm from "../components/Create/CreateForm";
import SEO from "@/components/SEO";

export default function Create() {
    return (
        <>
            <SEO
                title="Create | Underdog Ticketing"
                description="Create an event, and start distributing tickets."
                image=""
            />
            <main>
                <section>
                    <CreateHead />
                </section>
                <section>
                    <CreateForm />
                </section>
            </main>
        </>
    )
}