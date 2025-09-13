
"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { z } from "zod";

import { updateAboutDetails } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AboutDetailsSchema = z.object({
  content: z.string().min(1, "Content is required."),
});

type AboutDetailsFormValues = z.infer<typeof AboutDetailsSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="animate-spin mr-2" />
          Saving...
        </>
      ) : (
        "Save Changes"
      )}
    </Button>
  );
}

export function AboutForm({ currentData }: { currentData: AboutDetailsFormValues }) {
  const [state, formAction] = useActionState(updateAboutDetails, { success: false, message: '', errors: {} });
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast({
          title: "Success",
          description: state.message,
        });
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
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="content">About Content</Label>
        <Textarea id="content" name="content" className="min-h-[240px]" defaultValue={currentData.content} />
        <p className="text-sm text-muted-foreground">
          Use a double line break (press Enter twice) to separate paragraphs.
        </p>
        {state?.errors?.content && <p className="text-sm font-medium text-destructive">{state.errors.content[0]}</p>}
      </div>
      
      <SubmitButton />
    </form>
  );
}
