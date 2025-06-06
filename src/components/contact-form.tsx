
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { submitToNetlifyForm } from "@/lib/actions";

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }).max(500, {
    message: "Message must not exceed 500 characters."
  }),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export function ContactForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true)
    try {
      const result = await submitToNetlifyForm(data);

      if (result.success) {
        toast({
          title: "Message Sent!",
          description: "Thanks for reaching out. Your message has been submitted.",
        })
        form.reset()
      } else {
        console.error("Netlify form submission error via action:", result.error);
        toast({
          title: "Error",
          description: result.error || "Form submission failed. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error calling submitToNetlifyForm action:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      {/* The name attribute on the form is still useful for Netlify to identify the form,
          even if data-netlify="true" is not used directly here for SPA/App Router.
          The server action will include "form-name" in the payload. */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-card p-6 md:p-8 rounded-lg shadow-lg border border-border"
        name="contact" // This name should match the 'form-name' in your server action
      >
        {/* No data-netlify or honeypot attributes needed here when using a server action to submit */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your message here..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </Form>
  )
}
