import { db } from "@/providers/firebase";
import { addDoc, collection } from "firebase/firestore";

interface CreateUserProps {
    firstName: string, 
    lastName: string, 
    email: string, 
    walletAddress: string,
    image: string,
}

export async function createUser(credentials: CreateUserProps) {

    await addDoc(collection(db, "users"), {
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: credentials.email,
        walletAddress: credentials.walletAddress,
        image: credentials.image,
    })

    console.log("User Account successfully created.");
}