
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
    
    await updateDoc(doc(db, "siteConfig", "profile"), {
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
  content: z.string().min(1, "Content is required."),
});

export async function updateAboutDetails(prevState: any, formData: FormData) {
  try {
    const validatedFields = AboutDetailsSchema.safeParse({
      content: formData.get('content'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed.",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    await updateDoc(doc(db, "siteConfig", "about"), validatedFields.data);

    revalidatePath("/");
    revalidatePath("/dashboard/about");

    return { success: true, message: "About section updated successfully!" };
  } catch (error) {
    console.error("Error updating about details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to update about details: ${errorMessage}` };
  }
}

export async function updateAboutImage(prevState: any, formData: FormData) {
    try {
      const croppedImage = formData.get('croppedImage') as string;
      if (!croppedImage) {
        return { success: false, message: 'No cropped image data found.' };
      }
  
      const results = await cloudinary.uploader.upload(croppedImage, {
        folder: 'portfolio-about',
      });
  
      const imageUrl = results.secure_url;
      
      await updateDoc(doc(db, "siteConfig", "about"), {
        imageUrl: imageUrl,
      });
  
      revalidatePath("/");
      revalidatePath("/dashboard/about");
      
      return { success: true, message: "About section image updated successfully!" };
  
    } catch (error) {
      console.error("Error updating about image:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      return { success: false, message: `Failed to update about image: ${errorMessage}` };
    }
  }

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  iconName: z.string().optional(),
});

const skillCategorySchema = z.object({
  category: z.string().min(1, 'Category name is required'),
  categoryIconName: z.string().optional(),
  skills: z.array(skillSchema).min(1, 'At least one skill is required'),
});

const skillsFormSchema = z.array(skillCategorySchema);

export async function updateSkillsData(prevState: any, formData: FormData) {
    try {
      const skillsDataString = formData.get('skillsData') as string;
      if (!skillsDataString) {
        return { success: false, message: 'No skills data provided.' };
      }
  
      const skillsDataJSON = JSON.parse(skillsDataString);
      const validatedFields = skillsFormSchema.safeParse(skillsDataJSON);
  
      if (!validatedFields.success) {
        console.log(validatedFields.error.flatten());
        return {
          success: false,
          message: "Validation failed. Ensure all fields are filled.",
        };
      }
      
      await setDoc(doc(db, "siteConfig", "skills"), { skillsData: validatedFields.data });
  
      revalidatePath("/");
      revalidatePath("/dashboard/skills");
  
      return { success: true, message: "Skills section updated successfully!", data: JSON.stringify(validatedFields.data) };
    } catch (error) {
      console.error("Error updating skills data:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      return { success: false, message: `Failed to update skills: ${errorMessage}` };
    }
  }

  type SiteData = {
    imageUrl: string;
    name: string;
    title: string;
    bio: string;
    resumeUrl: string;
    about: {
      content: string;
      imageUrl: string;
    };
    skills: z.infer<typeof skillsFormSchema>;
  };
  
  export async function getSiteData(): Promise<SiteData> {
    try {
      const profileDocRef = doc(db, "siteConfig", "profile");
      const aboutDocRef = doc(db, "siteConfig", "about");
      const skillsDocRef = doc(db, "siteConfig", "skills");
  
      // Ensure documents exist
      await Promise.all([
          setDoc(profileDocRef, {}, { merge: true }),
          setDoc(aboutDocRef, {}, { merge: true }),
          setDoc(skillsDocRef, {}, { merge: true }),
      ]);
  
      const [profileDocSnap, aboutDocSnap, skillsDocSnap] = await Promise.all([
        getDoc(profileDocRef),
        getDoc(aboutDocRef),
        getDoc(skillsDocRef)
      ]);
  
      const profileData = profileDocSnap.data() || {};
      const aboutData = aboutDocSnap.data() || {};
      
      const skillsData = skillsDocSnap.data()?.skillsData;
      const finalSkills = skillsData && skillsData.length > 0 ? skillsData : defaultSkills;

      const defaultAboutContent = `Hello! I'm a dedicated and results-oriented web developer with a knack for crafting elegant solutions to complex problems. With numbers of years of experience in the projects building, I've had the pleasure of working on a variety of projects, from small business websites to large-scale web applications.

My passion lies in the intersection of design and technology. I believe that a great user experience is paramount, and I strive to create interfaces that are not only visually appealing but also intuitive and accessible to all users.

When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee while planning my next adventure.`;
  
      return { 
        imageUrl: profileData.imageUrl || '/images/karanprofile.jpg',
        name: profileData.name || 'Karan Chavda',
        title: profileData.title || 'Creative Web Developer & UI/UX Enthusiast',
        bio: profileData.bio || 'Passionate about building beautiful, functional, and user-friendly web experiences. Let\'s create something amazing together.',
        resumeUrl: '/karanresume.pdf',
        about: {
          content: aboutData.content || defaultAboutContent,
          imageUrl: aboutData.imageUrl || "https://images.unsplash.com/photo-1515041219749-89347f83291a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtaW5pb258ZW58MHx8fHwxNzQ5MjExMDAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        skills: finalSkills,
      };
      
    } catch (error) {
      console.error("Error fetching site data:", error);
      return getDefaultSiteData();
    }
  }

  const defaultSkills = [
    {
      category: 'Core Languages & Markup',
      categoryIconName: 'Code2',
      skills: [
        { name: 'C/C++', iconName: 'FileCode2' },
        { name: 'HTML', iconName: 'CodeXml' },
        { name: 'CSS', iconName: 'Palette' },
        { name: 'JavaScript', iconName: 'Braces' },
        { name: 'SQL', iconName: 'Database' },
      ]
    },
    {
      category: 'Frameworks, Libraries & CSS Tools',
      categoryIconName: 'Layers',
      skills: [
        { name: 'React', iconName: 'Atom' },
        { name: 'Bootstrap', iconName: 'LayoutGrid' },
        { name: 'FlexBox', iconName: 'StretchHorizontal' },
        { name: 'Tailwind CSS', iconName: 'Wind' },
        { name: 'Shadcn/UI', iconName: 'Component' },
      ]
    },
    {
      category: 'Development Tools & Platforms',
      categoryIconName: 'TerminalSquare',
      skills: [
        { name: 'Git', iconName: 'GitFork' },
        { name: 'GitHub', iconName: 'Github' },
        { name: 'Visual Studio Code', iconName: 'Code2' },
        { name: 'Netlify', iconName: 'Rocket' },
        { name: 'Firebase Studio', iconName: 'LayoutDashboard' },
      ]
    },
    {
      category: 'Backend, BaaS & PWA',
      categoryIconName: 'DatabaseZap',
      skills: [
        { name: 'Google Firebase', iconName: 'CloudCog' },
        { name: 'Supabase', iconName: 'Server' },
        { name: 'PWA', iconName: 'AppWindow' },
        { name: 'Cloudinary', iconName: 'ImageUp' },
      ]
    },
  ];

  function getDefaultSiteData(): SiteData {
    const defaultAboutContent = `Hello! I'm a dedicated and results-oriented web developer with a knack for crafting elegant solutions to complex problems. With numbers of years of experience in the projects building, I've had the pleasure of working on a variety of projects, from small business websites to large-scale web applications.

My passion lies in the intersection of design and technology. I believe that a great user experience is paramount, and I strive to create interfaces that are not only visually appealing but also intuitive and accessible to all users.

When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee while planning my next adventure.`;
    
    return { 
      imageUrl: '/images/karanprofile.jpg',
      name: 'Karan Chavda',
      title: 'Creative Web Developer & UI/UX Enthusiast',
      bio: 'Passionate about building beautiful, functional, and user-friendly web experiences. Let\'s create something amazing together.',
      resumeUrl: '/karanresume.pdf',
      about: {
        content: defaultAboutContent,
        imageUrl: "https://images.unsplash.com/photo-1515041219749-89347f83291a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtaW5pb258ZW58MHx8fHwxNzQ5MjExMDAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      skills: defaultSkills
    };
  }

  // Legacy function, kept for compatibility, but new code should use getSiteData
export async function getProfileData() {
    const data = await getSiteData();
    return {
        imageUrl: data.imageUrl,
        name: data.name,
        title: data.title,
        bio: data.bio,
        resumeUrl: data.resumeUrl,
        about: data.about
    }
}
