
"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { z } from "zod";

import { updateAboutDetails } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const AboutDetailsSchema = z.object({
  paragraph1: z.string().min(1, "First paragraph is required."),
  paragraph2: z.string().min(1, "Second paragraph is required."),
  paragraph3: z.string().min(1, "Third paragraph is required."),
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

  return (
    <form action={formAction} className="space-y-6">
      {state?.message && !state.success && (
        <Alert variant='destructive'>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {state.message}
            {state.errors && Object.values(state.errors).flat().map((error, i) => <div key={i}>{error}</div>)}
          </AlertDescription>
        </Alert>
      )}
      {state?.success && (
         <Alert>
           <CheckCircle className="h-4 w-4" />
           <AlertTitle>Success</AlertTitle>
           <AlertDescription>{state.message}</AlertDescription>
         </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="paragraph1">Paragraph 1</Label>
        <Textarea id="paragraph1" name="paragraph1" className="min-h-[120px]" defaultValue={currentData.paragraph1} />
        {state?.errors?.paragraph1 && <p className="text-sm font-medium text-destructive">{state.errors.paragraph1[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="paragraph2">Paragraph 2</Label>
        <Textarea id="paragraph2" name="paragraph2" className="min-h-[120px]" defaultValue={currentData.paragraph2} />
        {state?.errors?.paragraph2 && <p className="text-sm font-medium text-destructive">{state.errors.paragraph2[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="paragraph3">Paragraph 3</Label>
        <Textarea id="paragraph3" name="paragraph3" className="min-h-[120px]" defaultValue={currentData.paragraph3} />
        {state?.errors?.paragraph3 && <p className="text-sm font-medium text-destructive">{state.errors.paragraph3[0]}</p>}
      </div>
      
      <SubmitButton />
    </form>
  );
}
