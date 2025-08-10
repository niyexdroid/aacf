import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY || "")
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Handle the event based on the event type
    switch (event.event) {
      case "charge.success":
        await handleSuccessfulCharge(event.data);
        break;
      case "transfer.failed":
        await handleFailedTransfer(event.data);
        break;
      default:
        console.log("Unhandled event type:", event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

async function handleSuccessfulCharge(data: any) {
  try {
    // Check if donation already exists
    const donationsRef = collection(db, "donations");
    const q = query(donationsRef, where("reference", "==", data.reference));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Update existing donation
      const donationDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "donations", donationDoc.id), {
        status: "completed",
        paidAt: serverTimestamp(),
        metadata: {
          ...donationDoc.data().metadata,
          paystackData: data,
        },
      });
    } else {
      // Create new donation record
      await addDoc(collection(db, "donations"), {
        reference: data.reference,
        amount: data.amount / 100, // Convert from kobo to Naira
        email: data.customer.email,
        donorName: `${data.customer.first_name} ${data.customer.last_name}`,
        message:
          data.metadata?.custom_fields?.find(
            (field: any) => field.variable_name === "message",
          )?.value || "",
        paymentMethod: "paystack",
        status: "completed",
        metadata: {
          paystackData: data,
        },
        createdAt: serverTimestamp(),
        paidAt: serverTimestamp(),
      });
    }

    // Send thank-you email (implement this with your email service)
    // await sendThankYouEmail(data.customer.email, `${data.customer.first_name} ${data.customer.last_name}`, data.amount / 100);

    console.log("Successfully processed charge:", data.reference);
  } catch (error) {
    console.error("Error handling successful charge:", error);
  }
}

async function handleFailedTransfer(data: any) {
  try {
    // Update donation status to failed
    const donationsRef = collection(db, "donations");
    const q = query(donationsRef, where("reference", "==", data.reference));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const donationDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "donations", donationDoc.id), {
        status: "failed",
        failedAt: serverTimestamp(),
        metadata: {
          ...donationDoc.data().metadata,
          failureData: data,
        },
      });
    }

    console.log("Processed failed transfer:", data.reference);
  } catch (error) {
    console.error("Error handling failed transfer:", error);
  }
}
