
"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { z } from "zod";

import { updateProfileDetails } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfileDetailsSchema = z.object({
  name: z.string().min(1, "Name is required."),
  title: z.string().min(1, "Title is required."),
  bio: z.string().min(1, "Bio is required."),
});

type ProfileDetailsFormValues = z.infer<typeof ProfileDetailsSchema>;

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

export function ProfileDetailsForm({ currentData }: { currentData: ProfileDetailsFormValues }) {
  const [state, formAction] = useActionState(updateProfileDetails, { success: false, message: '', errors: {} });
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
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={currentData.name} />
        {state?.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={currentData.title} />
        {state?.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" className="min-h-[100px]" defaultValue={currentData.bio} />
        {state?.errors?.bio && <p className="text-sm font-medium text-destructive">{state.errors.bio[0]}</p>}
      </div>
      
      <SubmitButton />
    </form>
  );
}
