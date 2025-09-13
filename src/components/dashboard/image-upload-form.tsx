
"use client";

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { updateProfilePicture } from '@/lib/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="animate-spin mr-2" />
          Uploading...
        </>
      ) : (
        "Upload New Picture"
      )}
    </Button>
  );
}

export function ImageUploadForm({ currentImageUrl }: { currentImageUrl: string }) {
  const [state, formAction] = useActionState(updateProfilePicture, { success: false, message: '' });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (state.success) {
      // Clear the file input preview on successful upload
      setPreviewUrl(null); 
      // Optionally reset the form if you were using a library that supports it
    }
  }, [state.success]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6">
      {state.message && (
        <Alert variant={state.success ? 'default' : 'destructive'}>
          {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertTitle>{state.success ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-border shadow-md shrink-0">
          <Image
            src={previewUrl || currentImageUrl}
            alt="Current profile picture"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-grow w-full">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image" className="text-base">Choose a new profile image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="file:text-primary file:font-semibold"
              />
            </div>
            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
}
