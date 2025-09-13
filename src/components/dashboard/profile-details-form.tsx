
"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateProfileDetails } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

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

  const {
    register,
    formState: { errors },
  } = useForm<ProfileDetailsFormValues>({
    resolver: zodResolver(ProfileDetailsSchema),
    defaultValues: currentData,
    // The server action will return errors, so we can display them.
    // We can show both client and server errors.
    errors: state?.errors ? state.errors : undefined,
  });

  return (
    <form action={formAction} className="space-y-6">
      {state?.message && !state.success && (
        <Alert variant='destructive'>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
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
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name")}
        />
        {errors.name && <p className="text-sm font-medium text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title")}
        />
        {errors.title && <p className="text-sm font-medium text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          className="min-h-[100px]"
          {...register("bio")}
        />
        {errors.bio && <p className="text-sm font-medium text-destructive">{errors.bio.message}</p>}
      </div>
      
      <SubmitButton />
    </form>
  );
}
