import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Firestore helpers
export const createBooking = async (bookingData: any) => {
  const docRef = await addDoc(collection(db, "bookings"), {
    ...bookingData,
    createdAt: Timestamp.now(),
    status: "pending"
  });
  return { id: docRef.id, ...bookingData, createdAt: new Date(), status: "pending" };
};

export const getBookings = async () => {
  const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date()
  }));
};

export const updateBookingStatus = async (id: string, status: string) => {
  const bookingRef = doc(db, "bookings", id);
  await updateDoc(bookingRef, { status, updatedAt: Timestamp.now() });
};

export const deleteBooking = async (id: string) => {
  await deleteDoc(doc(db, "bookings", id));
};

export { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where, Timestamp };