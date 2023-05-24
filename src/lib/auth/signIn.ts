import { app } from "../../providers/firebase";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(app);

export default async function signIn(email: string, password: string) {
  let result = null;
  let error = null;
  try {
    let result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}