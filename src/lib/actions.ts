
"use server";

import { redirect } from "next/navigation";
import { getSession, setSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import {v2 as cloudinary} from 'cloudinary';
import { db } from "./firebase";
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, serverTimestamp, getDocs, query, orderBy, deleteDoc } from "firebase/firestore";
import { z } from "zod";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

async function uploadImageToCloudinary(file: File | string): Promise<string | null> {
    if (!file) {
      return null;
    }
    
    let image_data: string;
    if (typeof file === 'string') {
        image_data = file;
    } else {
        if (file.size === 0) return null;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        image_data = `data:${file.type};base64,` + Buffer.from(buffer).toString('base64');
    }

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image_data, {
            folder: 'portfolio-uploads',
        }, (error, result) => {
            if (error) {
                console.error("Cloudinary Upload Error:", error);
                reject(error);
                return;
            }
            resolve(result?.secure_url || null);
        });
    });
}

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
    const imageB64 = formData.get('image') as string;
    if (!imageB64) {
      return { success: false, message: 'No image data provided.' };
    }
    
    const imageUrl = await uploadImageToCloudinary(imageB64);
    if (!imageUrl) {
        throw new Error('Image upload failed.');
    }
    
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
      const imageFile = formData.get('image') as File;
      if (!imageFile || imageFile.size === 0) {
        return { success: false, message: 'No image provided.' };
      }
      
      const imageUrl = await uploadImageToCloudinary(imageFile);
      if (!imageUrl) {
        throw new Error('Image upload failed.');
      }
      
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
        return {
          success: false,
          message: "Validation failed. Ensure all fields are filled.",
        };
      }
      
      await setDoc(doc(db, "siteConfig", "skills"), { skills: validatedFields.data });
  
      revalidatePath("/");
      revalidatePath("/dashboard/skills");
  
      return { success: true, message: "Skills section updated successfully!", data: JSON.stringify(validatedFields.data) };
    } catch (error) {
      console.error("Error updating skills data:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      return { success: false, message: `Failed to update skills: ${errorMessage}` };
    }
  }

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().optional(),
  tags: z.string().min(1, "Tags are required"),
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
});

const projectsFormSchema = z.object({
  projectsData: z.array(projectSchema),
});

export async function updateProjectsData(prevState: any, formData: FormData) {
  try {
    const projectsDataString = formData.get("projectsData") as string;
    if (!projectsDataString) {
      return { success: false, message: "No projects data provided." };
    }

    const projectsDataJSON = JSON.parse(projectsDataString);
    const validatedFields = projectsFormSchema.safeParse(projectsDataJSON);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed. Ensure all fields are filled correctly.",
      };
    }

    const updatedProjects = await Promise.all(
      validatedFields.data.projectsData.map(async (project, index) => {
        const imageFile = formData.get(`image_${index}`) as File;
        if (imageFile && imageFile.size > 0) {
          const newImageUrl = await uploadImageToCloudinary(imageFile);
          return { ...project, imageUrl: newImageUrl || project.imageUrl };
        }
        return project;
      })
    );

    await setDoc(doc(db, "siteConfig", "projects"), {
      projects: updatedProjects,
    });

    revalidatePath("/");
    revalidatePath("/dashboard/projects");

    return {
      success: true,
      message: "Projects section updated successfully!",
      data: JSON.stringify(updatedProjects),
    };
  } catch (error) {
    console.error("Error updating projects data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      message: `Failed to update projects: ${errorMessage}`,
    };
  }
}

const certificateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  imageUrl: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal("")),
});

const certificatesFormSchema = z.object({
  certificatesData: z.array(certificateSchema),
});

export async function updateCertificatesData(prevState: any, formData: FormData) {
  try {
    const certificatesDataString = formData.get("certificatesData") as string;
    if (!certificatesDataString) {
      return {
        success: false,
        message: "No certificates data provided.",
      };
    }

    const certificatesDataJSON = JSON.parse(certificatesDataString);
    const validatedFields = certificatesFormSchema.safeParse(certificatesDataJSON);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed. Ensure all fields are filled correctly.",
      };
    }

    const updatedCertificates = await Promise.all(
      validatedFields.data.certificatesData.map(async (certificate, index) => {
        const imageFile = formData.get(`image_${index}`) as File;
        if (imageFile && imageFile.size > 0) {
          const newImageUrl = await uploadImageToCloudinary(imageFile);
          return { ...certificate, imageUrl: newImageUrl || certificate.imageUrl };
        }
        return certificate;
      })
    );

    await setDoc(doc(db, "siteConfig", "certificates"), {
      certificates: updatedCertificates,
    });

    revalidatePath("/");
    revalidatePath("/dashboard/certificates");

    return {
      success: true,
      message: "Certificates section updated successfully!",
      data: JSON.stringify(updatedCertificates),
    };
  } catch (error) {
    console.error("Error updating certificates data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      message: `Failed to update certificates: ${errorMessage}`,
    };
  }
}

// =================================================================
// CONTACT FORM ACTIONS
// =================================================================

export async function deleteContactMessage(messageId: string) {
  if (!messageId) {
    return { success: false, message: "Message ID is required." };
  }
  try {
    await deleteDoc(doc(db, "contactSubmissions", messageId));
    revalidatePath("/dashboard/messages");
    return { success: true, message: "Message deleted successfully." };
  } catch (error) {
    console.error("Error deleting contact message:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to delete message: ${errorMessage}` };
  }
}


// =================================================================
// DATA FETCHING
// =================================================================

const defaultAboutContent = `Hello! I'm a dedicated and results-oriented web developer with a knack for crafting elegant solutions to complex problems. With numbers of years of experience in the projects building, I've had the pleasure of working on a variety of projects, from small business websites to large-scale web applications.

My passion lies in the intersection of design and technology. I believe that a great user experience is paramount, and I strive to create interfaces that are not only visually appealing but also intuitive and accessible to all users.

When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee while planning my next adventure.`;

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

const defaultProjects = [
  {
    title: 'PWA Calculator',
    description: 'Progressive Web App with theme toggle and calculation history. Features offline functionality, splash screen, keyboard support, dark/light themes, and a lightweight design.',
    imageUrl: '/images/calculator.jpg',
    tags: 'PWA, JavaScript, HTML, CSS, Offline Support',
    liveUrl: 'https://calcmate-calculate.netlify.app',
    repoUrl: 'https://github.com/karn30chavda/CALCULATOR-PROJECT',
  },
  {
    title: 'Designated Driver Service (DDS) Website',
    description: 'Full-Stack Web App for booking professional drivers on-demand. Includes user/driver registration, role-based authentication, real-time booking, admin panel, driver background checks, responsive design, Firebase Hosting, and encrypted data storage.',
    imageUrl: '/images/dds.jpg',
    tags: 'Full-Stack, Firebase, JavaScript, Authentication, Real-time',
    liveUrl: 'https://designated-driver-service.netlify.app',
    repoUrl: 'https://github.com/karn30chavda/DRIVER-BOOKING-WEBSITE',
  },
  {
    title: 'Sticky Notes PWA',
    description: 'Secure Note-Taking App with rich text editing and PWA capabilities. Features PIN-protected notes, dark/light themes, real-time sync, profile picture upload, search/filter functionality, and responsive UI.',
    imageUrl: '/images/stickynotes.jpg',
    tags: 'Full-Stack, PWA, Security, Real-time Sync, JavaScript, Responsive UI',
    liveUrl: 'https://stickynotesproject.netlify.app',
    repoUrl: 'https://github.com/karn30chavda/STICKY-NOTE-PROJECT',
  },
  {
    title: 'Tic Tac Win Game',
    description: 'Offline-Ready Game with AI and multiplayer modes. Features a hand-drawn UI, responsive design, animated splash screen, PWA installation, and smooth animations.',
    imageUrl: '/images/tictactoe.jpg',
    tags: 'PWA, Game, AI, Multiplayer, JavaScript',
    liveUrl: 'https://tictactoewinner.netlify.app',
    repoUrl: 'https://github.com/karn30chavda/Tic-Tac-Toe-Game',
  },
];

const defaultCertificates = [
    {
      title: 'Responsive Web Design',
      issuer: 'freeCodeCamp',
      date: 'December 2023',
      credentialUrl: 'https://www.freecodecamp.org/certification/KaranChavda/responsive-web-design',
      imageUrl: '/images/responsive-web-design.png',
    },
    {
      title: 'JavaScript Algorithms and Data Structures',
      issuer: 'freeCodeCamp',
      date: 'December 2023',
      credentialUrl: 'https://www.freecodecamp.org/certification/KaranChavda/javascript-algorithms-and-data-structures',
      imageUrl: '/images/javascript-algos.png',
    }
];

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
    projects: z.infer<typeof projectsFormSchema>['projectsData'];
    certificates: z.infer<typeof certificatesFormSchema>['certificatesData'];
};

async function getDocumentData(docRef: any, fallbackData: any) {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // If the document doesn't exist, create it with the fallback data
    return fallbackData;
  }
}

export async function getSiteData(): Promise<SiteData> {
  try {
    const profileDocRef = doc(db, "siteConfig", "profile");
    const aboutDocRef = doc(db, "siteConfig", "about");
    const skillsDocRef = doc(db, "siteConfig", "skills");
    const projectsDocRef = doc(db, "siteConfig", "projects");
    const certificatesDocRef = doc(db, "siteConfig", "certificates");

    const [
      profileData,
      aboutData,
      skillsData,
      projectsData,
      certificatesData,
    ] = await Promise.all([
      getDocumentData(profileDocRef, {
        imageUrl: '/images/karanprofile.jpg',
        name: 'Karan Chavda',
        title: 'Creative Web Developer & UI/UX Enthusiast',
        bio: 'Passionate about building beautiful, functional, and user-friendly web experiences. Let\'s create something amazing together.',
      }),
      getDocumentData(aboutDocRef, {
        content: defaultAboutContent,
        imageUrl: "https://images.unsplash.com/photo-1515041219749-89347f83291a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtaW5pb258ZW58MHx8fHwxNzQ5MjExMDAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      }),
      getDocumentData(skillsDocRef, { skills: defaultSkills }),
      getDocumentData(projectsDocRef, { projects: defaultProjects }),
      getDocumentData(certificatesDocRef, { certificates: defaultCertificates }),
    ]);

    return {
      imageUrl: profileData.imageUrl,
      name: profileData.name,
      title: profileData.title,
      bio: profileData.bio,
      resumeUrl: '/karanresume.pdf',
      about: aboutData,
      skills: skillsData.skills,
      projects: projectsData.projects,
      certificates: certificatesData.certificates,
    };
  } catch (error) {
    console.error("Error fetching site data, returning defaults:", error);
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
      skills: defaultSkills,
      projects: defaultProjects,
      certificates: defaultCertificates,
    };
  }
}

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

export type ContactSubmission = {
    id: string;
    name: string;
    email: string;
    message: string;
    inquiryType: string;
    submittedAt: string;
};

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
    try {
        const submissionsCol = collection(db, "contactSubmissions");
        const q = query(submissionsCol, orderBy("submittedAt", "desc"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return [];
        }

        const submissions = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                email: data.email,
                message: data.message,
                inquiryType: data.inquiryType,
                submittedAt: data.submittedAt.toDate().toISOString(), 
            }
        });

        return submissions;
    } catch (error) {
        console.error("Error fetching contact submissions:", error);
        return [];
    }
}

    
