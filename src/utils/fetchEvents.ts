import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export async function fetchEvents() {
  try {
    const querysnapshot = await getDocs(collection(db, "events"));
    return querysnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return []; // Return an empty array if there's an error
  }
}
