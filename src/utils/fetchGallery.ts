import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure you have this config file

export const fetchGalleryImages = async () => {
  try {
    const imagesCollection = collection(db, "gallery");
    const snapshot = await getDocs(imagesCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      url: doc.data().imageUrl,
      title: doc.data().title,
      timestamp: doc.data().timestamp,
    }));
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }
};
