import React from "react";
import CreateUserForm from "@/components/CreateUser/CreateUserForm";
import CreateUserHead from "@/components/CreateUser/CreateUserHead";
import SEO from "@/components/SEO";

export default function CreateUser() {
    return (
        <>
            <SEO
                title="Create User | Underdog Ticketing"
                description="Create a user account, and start making the most of compressed NFT tickets."
                image=""
            />
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