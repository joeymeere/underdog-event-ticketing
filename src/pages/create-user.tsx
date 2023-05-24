import CreateUserForm from "@/components/CreateUser/CreateUserForm";
import CreateUserHead from "@/components/CreateUser/CreateUserHead";
import Header from "@/components/Header";
import React from "react";

export default function CreateUser() {
    return (
        <>
            <Header />
            <main>
                <section>
                    <CreateUserHead />
                </section>
                <section>
                    <CreateUserForm />
                </section>
            </main>
        </>
    )
}