
"use server"

import * as z from "zod"

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(500, {message: "Message must not exceed 500 characters."}),
})

interface ActionResult {
  success: boolean;
  error?: string;
}

// This function is kept for potential other uses or if you switch form handlers.
// For Netlify, we'll use submitToNetlifyForm.
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
  const formEndpoint = 'YOUR_FORM_ENDPOINT_HERE'; 

  if (formEndpoint === 'YOUR_FORM_ENDPOINT_HERE') {
    console.warn("Contact form submission is not configured. Please replace 'YOUR_FORM_ENDPOINT_HERE' in src/lib/actions.ts with your form service endpoint.");
    return { success: true, error: "Form endpoint not configured by developer (simulation)." };
  }

  try {
    const response = await fetch(formEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Failed to send message (status: ${response.status}). Please try again. Details: ${JSON.stringify(errorData)}`
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


export async function submitToNetlifyForm(
  data: z.infer<typeof contactFormSchema>
): Promise<ActionResult> {
  const validatedFields = contactFormSchema.safeParse(data);

  if (!validatedFields.success) {
    // Extract specific error messages if possible, or a general one
    const errors = validatedFields.error.errors.map(e => e.message).join(', ');
    return {
      success: false,
      error: `Invalid form data: ${errors}. Please check your inputs.`
    };
  }

  const { name, email, message } = validatedFields.data;

  // Prepare data in application/x-www-form-urlencoded format
  const formData = new URLSearchParams();
  formData.append('form-name', 'contact'); // This MUST match the name attribute of your form in ContactForm.tsx
  formData.append('name', name);
  formData.append('email', email);
  formData.append('message', message);
  // You can add a honeypot field here if you want, Netlify will respect it
  // formData.append('bot-field', ''); 

  try {
    // Netlify forms are submitted to the path where the form is defined, usually '/' or the specific page.
    // For App Router and server actions, submitting to '/' is standard.
    const response = await fetch(process.env.URL || '/', { // process.env.URL is available in Netlify build environment
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (response.ok) {
      // Netlify typically returns a 200 OK on successful AJAX submission.
      // You might get a page back, but the status code is key.
      return { success: true };
    } else {
      // Attempt to get more info from Netlify's response if submission fails
      const responseText = await response.text();
      console.error("Netlify form submission failed. Status:", response.status, "Response:", responseText);
      return {
        success: false,
        error: `Form submission to Netlify failed (status: ${response.status}). Please try again. Details: ${responseText.substring(0,100)}`
      };
    }
  } catch (error: any) {
    console.error("Error submitting form to Netlify:", error);
    return {
      success: false,
      error: `An unexpected error occurred while submitting to Netlify: ${error.message || 'Unknown error'}`
    };
  }
}
