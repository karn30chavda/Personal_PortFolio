
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
    const errors = validatedFields.error.errors.map(e => e.message).join(', ');
    return {
      success: false,
      error: `Invalid form data: ${errors}. Please check your inputs.`
    };
  }

  const { name, email, message } = validatedFields.data;

  const formData = new URLSearchParams();
  formData.append('form-name', 'contact'); 
  formData.append('name', name);
  formData.append('email', email);
  formData.append('message', message);
  
  try {
    const siteUrl = process.env.URL;
    if (!siteUrl) {
        console.error('Netlify site URL (process.env.URL) is not defined. Cannot submit form.');
        return {
            success: false,
            error: "Configuration error on the server. Please contact support if this issue persists."
        };
    }

    // We POST to the root of the site (process.env.URL). 
    // Netlify picks it up based on the 'form-name' field in the payload.
    const response = await fetch(siteUrl, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const responseText = await response.text();
      console.error("Netlify form submission failed. Status:", response.status, "Response:", responseText);
      return {
        success: false,
        error: `Form submission to Netlify failed (status: ${response.status}). Details: ${responseText.substring(0, 200)}`
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
