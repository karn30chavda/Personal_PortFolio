
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
    const croppedImage = formData.get('croppedImage') as string;
    if (!croppedImage) {
      return { success: false, message: 'No cropped image data found.' };
    }

    const results = await cloudinary.uploader.upload(croppedImage, {
      folder: 'portfolio-profile',
    });

    const imageUrl = results.secure_url;
    
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

export async function getProfileData(): Promise<{ imageUrl: string }> {
  try {
    const docRef = doc(db, "siteConfig", "profile");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().imageUrl) {
      // Return a plain object, not the complex DocumentData
      return { imageUrl: docSnap.data().imageUrl };
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
