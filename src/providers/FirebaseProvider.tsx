import {
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "./firebase";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";

const firebase = createContext<any>(null);

export const useFirebase = () => {
  const context = useContext(firebase);
  if (!context) {
    throw new Error("Parent must be wrapped inside StateProvider");
  }

  return context;
};

export const FirebaseProvider = ({ children }: any) => {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const [events, setEvents] = useState<any>();
  const [participants, setParticipants] = useState<any>([]);
  const [userDoc, setUserDoc] = useState<any>(null);

  useEffect(() => {
    const getEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));

      setEvents(
        querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            data: {
              ...doc.data(),
            },
          };
        })
      );
    };
    getEvents();
  }, []);

  useEffect(() => {
    const checkForUser = async () => {
      if (connected) {
        //Check "users" collection for account
        const q = await query(collection(db, "users"), where("walletAddress", "==", publicKey?.toString()))

        const snapshot = await getDocs(q);

        const read = snapshot.docs;

        console.log(read)

        if (read.length == 0) {
          // Send user to create an account
          console.log("No account found.");
          // router.push('/create-user');
        } else {

          const map = read.map((item, i) => {
            return {
              id: item.id,
              data: {
                ...item.data()
              }
            }
          })

          setUserDoc(map[0]);
        }
      }
    }
    checkForUser();
  }, [connected])

  async function getParticipants(id: string) {
    const querySnapshot = await getDocs(
      collection(db, `/events/${String(id)}/participants`)
    );

    setParticipants(
      querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          data: {
            ...doc.data(),
          },
        };
      })
    );

    return participants;
  }

  async function getUser(pubkey: string) {
    const q = await query(
      collection(db, `users`),
      where("pubkey", "==", pubkey)
    );

    const querySnapshot = await getDocs(q);

    setUserDoc(
      querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          data: {
            ...doc.data(),
          },
        };
      })
    );
  }

  return (
    <firebase.Provider
      value={{
        events,
        participants,
        userDoc,
        setUserDoc,
        getParticipants,
        getUser,
      }}
    >
      {children}
    </firebase.Provider>
  );
};
