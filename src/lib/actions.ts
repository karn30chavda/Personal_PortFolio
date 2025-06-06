
"use server"

import * as z from "zod"

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(500),
})

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function submitContactForm(
  data: z.infer<typeof contactFormSchema>
): Promise<ActionResult> {
  const validatedFields = contactFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return { 
      success: false,
      error: "Invalid form data. Please check your inputs." 
    };
  }

  const { name, email, message } = validatedFields.data;

  // --- Send form data to an external service ---
  // 1. Choose a form handling service (e.g., Formspree, Getform).
  // 2. Sign up and get your unique endpoint URL.
  // 3. Replace 'YOUR_FORM_ENDPOINT_HERE' with your actual endpoint.
  const formEndpoint = 'YOUR_FORM_ENDPOINT_HERE'; // <--- REPLACE THIS

  if (formEndpoint === 'YOUR_FORM_ENDPOINT_HERE') {
    console.warn("Contact form submission is not configured. Please replace 'YOUR_FORM_ENDPOINT_HERE' in src/lib/actions.ts with your form service endpoint.");
    // Simulate success for local testing if not configured
    return { success: true, error: "Form endpoint not configured by developer (simulation)." };
  }

  try {
    const response = await fetch(formEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        message,
        // Some services might require specific field names or additional fields.
        // For example, Formspree might use `_replyto: email`
      }),
    });

    if (response.ok) {
      console.log("Form data submitted successfully to external service.");
      return { success: true };
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error("Failed to submit form to external service:", response.status, errorData);
      return { 
        success: false, 
        error: `Failed to send message (status: ${response.status}). Please try again.` 
      };
    }
  } catch (error) {
    console.error("Error submitting form to external service:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred while sending the message. Please try again." 
    };
  }
}

