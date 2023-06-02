import React from "react";
import CreateUserForm from "@/components/CreateUser/CreateUserForm";
import CreateUserHead from "@/components/CreateUser/CreateUserHead";

export default function CreateUser() {
    return (
        <>
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