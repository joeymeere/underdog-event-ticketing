import { Header } from "../components/Header";
import Hero from "../components/Hero";
import Advantages from "../components/Advantages";
import UnderdogInfo from "../components/UnderdogInfo";

export default function Home() {
  return (
    <>
      <Header />
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
