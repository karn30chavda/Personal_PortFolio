
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

const AboutDetailsSchema = z.object({
  paragraph1: z.string().min(1, "First paragraph is required."),
  paragraph2: z.string().min(1, "Second paragraph is required."),
  paragraph3: z.string().min(1, "Third paragraph is required."),
  imageUrl: z.string().optional(),
});

export async function updateAboutDetails(prevState: any, formData: FormData) {
  try {
    const validatedFields = AboutDetailsSchema.safeParse({
      paragraph1: formData.get('paragraph1'),
      paragraph2: formData.get('paragraph2'),
      paragraph3: formData.get('paragraph3'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed.",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    await setDoc(doc(db, "siteConfig", "about"), validatedFields.data, { merge: true });

    revalidatePath("/");
    revalidatePath("/dashboard/about");

    return { success: true, message: "About section updated successfully!" };
  } catch (error) {
    console.error("Error updating about details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to update about details: ${errorMessage}` };
  }
}

export async function getProfileData(): Promise<{ 
  imageUrl: string; 
  name: string; 
  title: string; 
  bio: string; 
  resumeUrl: string;
  about: {
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    imageUrl: string;
  }
}> {
  try {
    const profileDocRef = doc(db, "siteConfig", "profile");
    const aboutDocRef = doc(db, "siteConfig", "about");

    const [profileDocSnap, aboutDocSnap] = await Promise.all([
      getDoc(profileDocRef),
      getDoc(aboutDocRef)
    ]);

    const profileData = profileDocSnap.exists() ? profileDocSnap.data() : {};
    const aboutData = aboutDocSnap.exists() ? aboutDocSnap.data() : {};

    return { 
      imageUrl: profileData.imageUrl || '/images/karanprofile.jpg',
      name: profileData.name || 'Karan Chavda',
      title: profileData.title || 'Creative Web Developer & UI/UX Enthusiast',
      bio: profileData.bio || 'Passionate about building beautiful, functional, and user-friendly web experiences. Let\'s create something amazing together.',
      resumeUrl: '/karanresume.pdf',
      about: {
        paragraph1: aboutData.paragraph1 || "Hello! I'm a dedicated and results-oriented web developer with a knack for crafting elegant solutions to complex problems. With numbers of years of experience in the projects building, I've had the pleasure of working on a variety of projects, from small business websites to large-scale web applications.",
        paragraph2: aboutData.paragraph2 || "My passion lies in the intersection of design and technology. I believe that a great user experience is paramount, and I strive to create interfaces that are not only visually appealing but also intuitive and accessible to all users.",
        paragraph3: aboutData.paragraph3 || "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee while planning my next adventure.",
        imageUrl: aboutData.imageUrl || "https://images.unsplash.com/photo-1515041219749-89347f83291a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtaW5pb258ZW58MHx8fHwxNzQ5MjExMDAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      }
    };
    
  } catch (error) {
    console.error("Error fetching site data:", error);
    // Return default in case of error to prevent site crash
    return { 
      imageUrl: '/images/karanprofile.jpg',
      name: 'Karan Chavda',
      title: 'Creative Web Developer & UI/UX Enthusiast',
      bio: 'Passionate about building beautiful, functional, and user-friendly web experiences. Let\'s create something amazing together.',
      resumeUrl: '/karanresume.pdf',
      about: {
        paragraph1: "Hello! I'm a dedicated and results-oriented web developer with a knack for crafting elegant solutions to complex problems. With numbers of years of experience in the projects building, I've had the pleasure of working on a variety of projects, from small business websites to large-scale web applications.",
        paragraph2: "My passion lies in the intersection of design and technology. I believe that a great user experience is paramount, and I strive to create interfaces that are not only visually appealing but also intuitive and accessible to all users.",
        paragraph3: "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee while planning my next adventure.",
        imageUrl: "https://images.unsplash.com/photo-1515041219749-89347f83291a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtaW5pb258ZW58MHx8fHwxNzQ5MjExMDAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      }
    };
  }
}
