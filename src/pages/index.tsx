import React from "react";
import Hero from "../components/Hero";
import Advantages from "../components/Advantages";
import UnderdogInfo from "../components/UnderdogInfo";

export default function Home() {
  return (
    <>
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
