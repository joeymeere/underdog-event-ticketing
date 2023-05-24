import { HandleEventCreaton } from "@/interfaces";
import { db } from "@/providers/firebase";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";

export default async function createEvent(eventData: HandleEventCreaton) {

  let data = JSON.stringify({
    name: `${eventData.name}`,
    description: `${eventData.description}`,
    image: String(eventData.image),
    transferable: eventData.isTransferable,
    compressed: true,
  });

  let config = {
    method: "post",
    url: "https://api.underdogprotocol.com/v2/projects/",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_UNDERDOG_API_KEY}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  const res = await axios(config).catch((err) => {
    throw new Error("Operation Failed.");
  });
  let responseData = res.data;

  await addDoc(collection(db, `events`), {
    name: eventData.name,
    description: eventData.description,
    image: eventData.image,
    location: eventData.location,
    isPaywalled: eventData.isPaywalled,
    isCapped: eventData.isCapped,
    ticketPrice: eventData.ticketPrice,
    ticketsIssued: 0,
    totalTickets: eventData.totalTickets,
    collectionId: responseData.projectId,
  })
  console.log("Event successfully created.");
}
