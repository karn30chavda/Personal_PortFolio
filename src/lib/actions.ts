
"use server";

import { redirect } from "next/navigation";
import { getSession, setSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import {v2 as cloudinary} from 'cloudinary';
import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function login(prevState: { error: string | undefined }, formData: FormData) {
  const password = formData.get("password");

  if (password === process.env.ADMIN_PASSWORD) {
    await setSession();
    redirect("/dashboard");
  }

  return { error: "Invalid password. Please try again." };
}

export async function logout() {
  const session = await getSession();
  if (session) {
    session.destroy();
  }
  redirect("/login");
}

export async function updateProfilePicture(prevState: any, formData: FormData) {
  try {
    const image = formData.get('image') as File;
    if (!image || image.size === 0) {
      return { success: false, message: 'Please select an image to upload.' };
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const results = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'portfolio-profile' }, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }).end(buffer);
    });

    const imageUrl = (results as any).secure_url;
    
    await setDoc(doc(db, "siteConfig", "profile"), {
      imageUrl: imageUrl,
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    
    return { success: true, message: "Profile picture updated successfully!" };

  } catch (error) {
    console.error("Error updating profile picture:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to update profile picture: ${errorMessage}` };
  }
}

export async function getProfileData() {
  try {
    const docRef = doc(db, "siteConfig", "profile");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().imageUrl) {
      return docSnap.data();
    } else {
      // Return a default or initial state if no data is found
      return { imageUrl: '/images/karanprofile.jpg' };
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
    // Return default in case of error to prevent site crash
    return { imageUrl: '/images/karanprofile.jpg' };
  }
}
