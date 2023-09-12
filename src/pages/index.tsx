import React from "react";
import Hero from "../components/Hero";
import Advantages from "../components/Advantages";
import UnderdogInfo from "../components/UnderdogInfo";
import SEO from "@/components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="TurboTix | Elevate Your Ticketing"
        description="Create events, distribute tickets, and connect with the people and communities that matter to you."
        image=""
      />
      <main className="flex min-h-screen mx-auto flex-col items-center justify-between overflow-hidden">
        <section className="w-full">
          <Hero />
        </section>
        <section>
          <Advantages />
        </section>
        <section>
          <UnderdogInfo />
        </section>
      </main>
    </>
  )
}
