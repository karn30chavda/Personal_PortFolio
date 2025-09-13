
"use server";

import { redirect } from "next/navigation";
import { getSession, setSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import {v2 as cloudinary} from 'cloudinary';
import { db } from "./firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { z } from "zod";

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
    }, { merge: true });

    revalidatePath("/");
    revalidatePath("/dashboard");
    
    return { success: true, message: "Profile picture updated successfully!" };

  } catch (error) {
    console.error("Error updating profile picture:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to update profile picture: ${errorMessage}` };
  }
}

const ProfileDetailsSchema = z.object({
  name: z.string().min(1, "Name is required."),
  title: z.string().min(1, "Title is required."),
  bio: z.string().min(1, "Bio is required."),
});

export async function updateProfileDetails(prevState: any, formData: FormData) {
  try {
    const validatedFields = ProfileDetailsSchema.safeParse({
      name: formData.get('name'),
      title: formData.get('title'),
      bio: formData.get('bio'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed.",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    await updateDoc(doc(db, "siteConfig", "profile"), validatedFields.data);

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true, message: "Profile details updated successfully!" };
  } catch (error) {
    console.error("Error updating profile details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to update profile details: ${errorMessage}` };
  }
}

export async function updateResume(prevState: any, formData: FormData) {
  try {
    const resumeFile = formData.get('resume') as File;
    if (!resumeFile || resumeFile.size === 0) {
      return { success: false, message: 'No file selected for upload.' };
    }

    // Convert file to buffer to upload to Cloudinary
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const results: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: 'portfolio-resume',
            resource_type: 'raw',
            public_id: resumeFile.name.split('.').slice(0, -1).join('.'),
        }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
        uploadStream.end(buffer);
    });

    const resumeUrl = results.secure_url;
    
    await setDoc(doc(db, "siteConfig", "profile"), {
      resumeUrl: resumeUrl,
    }, { merge: true });

    revalidatePath("/");
    revalidatePath("/dashboard");
    
    return { success: true, message: "Resume updated successfully!" };

  } catch (error) {
    console.error("Error updating resume:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to update resume: ${errorMessage}` };
  }
}


export async function getProfileData(): Promise<{ imageUrl: string; name: string; title: string; bio: string; resumeUrl: string; }> {
  try {
    const docRef = doc(db, "siteConfig", "profile");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        imageUrl: data.imageUrl || '/images/karanprofile.jpg',
        name: data.name || 'Karan Chavda',
        title: data.title || 'Creative Web Developer & UI/UX Enthusiast',
        bio: data.bio || 'Passionate about building beautiful, functional, and user-friendly web experiences. Let\'s create something amazing together.',
        resumeUrl: data.resumeUrl || '/karanresume.pdf',
      };
    } else {
      // Return a default or initial state if no data is found
      return { 
        imageUrl: '/images/karanprofile.jpg',
        name: 'Karan Chavda',
        title: 'Creative Web Developer & UI/UX Enthusiast',
        bio: 'Passionate about building beautiful, functional, and user-friendly web experiences. Let\'s create something amazing together.',
        resumeUrl: '/karanresume.pdf',
      };
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
    // Return default in case of error to prevent site crash
    return { 
      imageUrl: '/images/karanprofile.jpg',
      name: 'Karan Chavda',
      title: 'Creative Web Developer & UI/UX Enthusiast',
      bio: 'Passionate about building beautiful, functional, and user-friendly web experiences. Let\'s create something amazing together.',
      resumeUrl: '/karanresume.pdf',
    };
  }
}
