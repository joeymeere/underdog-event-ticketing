import React from "react";
import Header from "@/components/Header";
import CreateHead from "../components/Create/CreateHead";
import CreateForm from "../components/Create/CreateForm";

export default function Create() {
    return (
        <>
            <Header />
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