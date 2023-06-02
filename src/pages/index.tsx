import React from "react";
import Hero from "../components/Hero";
import Advantages from "../components/Advantages";
import UnderdogInfo from "../components/UnderdogInfo";
import SEO from "@/components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="Event Ticketing by Underdog"
        description="Create events, distributed compressed NFT tickets, and connect with the people and communities that matter to you."
        image=""
      />
      <main>
        <section>
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
