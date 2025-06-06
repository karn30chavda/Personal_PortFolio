
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

  // --- Email Sending Logic Would Go Here ---
  // In a real application, you would integrate an email service provider
  // (e.g., SendGrid, Resend, AWS SES, or Nodemailer with an SMTP service)
  // to send the email.

  const recipientEmail = "karanchavda543@gmail.com";
  const emailSubject = `Contact Form Submission from: ${name}`;
  const emailBody = `
    Name: ${name}
    Email: ${email}
    Message:
    ${message}
  `;

  console.log("--- Simulating Email Dispatch ---");
  console.log(`To: ${recipientEmail}`);
  console.log(`From: ${email}`); // Note: Sending "From" an unverified user-provided email is often problematic and may lead to spam issues.
                               // A better practice is to send from your own verified domain email 
                               // (e.g., no-reply@yourdomain.com) and set the 'Reply-To' header to the user's email.
  console.log(`Subject: ${emailSubject}`);
  console.log(`Body:\n${emailBody}`);
  console.log("--- End of Simulated Email Dispatch ---");
  
  // Example of how you might use an email service (pseudo-code):
  // try {
  //   await emailService.send({
  //     to: recipientEmail,
  //     from: "your-verified-email@example.com", // Use a verified sender
  //     replyTo: email, // Set user's email as Reply-To
  //     subject: emailSubject,
  //     text: emailBody, // Or HTML content
  //   });
  //   return { success: true };
  // } catch (error) {
  //   console.error("Email sending failed:", error);
  //   return { success: false, error: "Failed to send message. Please try again later." };
  // }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // For now, we'll return success as if the email was logged.
  // If you implement actual email sending, adjust success/error based on the email service's response.
  return { success: true };
}
