import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from '../../providers/firebase';

const auth = getAuth(app);

export default async function signUp(email: string, password: string) {
  let result = null;
  let error = null;
  try {
    let result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
