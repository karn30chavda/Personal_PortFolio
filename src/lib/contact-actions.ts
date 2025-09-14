"use server";

import { revalidatePath } from "next/cache";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { z } from "zod";

const ContactFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters long."),
});

export async function saveContactMessage(prevState: any, formData: FormData) {
  try {
    const validatedFields = ContactFormSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed.",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    await addDoc(collection(db, 'contactSubmissions'), {
      ...validatedFields.data,
      submittedAt: serverTimestamp(),
    });

    revalidatePath("/dashboard/messages");

    return { success: true, message: "Your message has been sent successfully!" };

  } catch (error) {
    console.error("Error saving contact message:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to send message: ${errorMessage}` };
  }
}
