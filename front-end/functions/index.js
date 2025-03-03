import {onRequest} from "firebase-functions/v2/https";
import admin from "firebase-admin";
import cors from "cors";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();
const corsHandler = cors({origin: true});

export const googleAuth = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({error: "Method Not Allowed"});
    }

    try {
      const {email, displayName, uid} = req.body;

      if (!email || !uid) {
        return res.status(400).json({error: "Missing required fields"});
      }

      // Check if the user exists in Firestore
      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        // Create a new user if they don’t exist
        await userRef.set({
          email,
          displayName,
          uid,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      res.status(200).json({message: "User authenticated successfully", uid});
    } catch (error) {
      console.error("Error authenticating user:", error);
      res.status(500).json({error: "Internal Server Error"});
    }
  });
});
