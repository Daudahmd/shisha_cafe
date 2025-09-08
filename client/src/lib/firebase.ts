import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where, Timestamp } from "firebase/firestore";

// Direct Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyDSYb_o4gpTub7vjPMGgP3-FEmTX-CyOVA",
  authDomain: "shishacafe-bf03c.firebaseapp.com",
  projectId: "shishacafe-bf03c",
  storageBucket: "shishacafe-bf03c.appspot.com",
  appId: "1:692246947503:web:fcfa8f977611f35a5d965a",
  measurementId: "G-B5VRGDQKVQ"
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
  console.log('API call: updating booking', id, 'to status', status);
  const response = await fetch(`/api/bookings/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  
  console.log('Update response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Update error response:', errorText);
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }
    throw new Error(errorData.error || 'Failed to update booking status');
  }
  
  const result = await response.json();
  console.log('Update response data:', result);
  return result;
};

export const deleteBooking = async (id: string) => {
  console.log('API call: deleting booking', id);
  const response = await fetch(`/api/bookings/${id}`, {
    method: 'DELETE',
  });
  
  console.log('Delete response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Delete error response:', errorText);
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }
    throw new Error(errorData.error || 'Failed to delete booking');
  }
  
  const result = await response.json();
  console.log('Delete response data:', result);
  return result;
};

export { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where, Timestamp };