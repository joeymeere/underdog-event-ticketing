import React from "react";
import CreateHead from "../components/Create/CreateHead";
import CreateForm from "../components/Create/CreateForm";

export default function Create() {
    return (
        <>
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