
"use client"

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { saveContactMessage } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        "Send Message"
      )}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(saveContactMessage, { success: false, message: '', errors: {} });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Message Sent!",
          description: "Thanks for reaching out. Your message has been submitted.",
        });
        formRef.current?.reset();
      } else {
        const errorMsg = state.errors ? Object.values(state.errors).flat().join(' ') : '';
        toast({
          title: "Error",
          description: state.message + ' ' + errorMsg,
          variant: "destructive",
        });
      }
    }
  }, [state, toast]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-6 bg-card p-6 md:p-8 rounded-lg shadow-lg border border-border"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" placeholder="John Doe" required />
        {state?.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        {state?.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message here..."
          className="min-h-[120px]"
          required
          minLength={10}
        />
        {state?.errors?.message && <p className="text-sm font-medium text-destructive">{state.errors.message[0]}</p>}
      </div>

      <SubmitButton />
    </form>
  )
}
