
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
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ProfileDetailsFormValues>({
    resolver: zodResolver(ProfileDetailsSchema),
    defaultValues: currentData,
  });

  const handleFormAction = (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission
    event.preventDefault();

    // Trigger validation
    handleSubmit(() => {
      // On valid submission, create FormData and call the action
      const formData = new FormData();
      const values = getValues();
      formData.append('name', values.name);
      formData.append('title', values.title);
      formData.append('bio', values.bio);
      formAction(formData);
    })();
  };


  return (
    <form onSubmit={handleFormAction} className="space-y-6">
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
        {state?.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title")}
        />
        {errors.title && <p className="text-sm font-medium text-destructive">{errors.title.message}</p>}
         {state?.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          className="min-h-[100px]"
          {...register("bio")}
        />
        {errors.bio && <p className="text-sm font-medium text-destructive">{errors.bio.message}</p>}
         {state?.errors?.bio && <p className="text-sm font-medium text-destructive">{state.errors.bio[0]}</p>}
      </div>
      
      <SubmitButton />
    </form>
  );
}
