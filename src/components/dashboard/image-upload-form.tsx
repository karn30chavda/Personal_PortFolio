"use client";

import { useActionState, useState, useRef, type ChangeEvent, useTransition, useEffect } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import { updateProfilePicture } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

export function ImageUploadForm({ currentImageUrl }: { currentImageUrl: string }) {
  const [state, formAction] = useActionState(updateProfilePicture, { success: false, message: '' });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast({
          title: "Success",
          description: state.message,
        });
        setPreviewUrl(null); 
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state, toast]);

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormAction = (formData: FormData) => {
    if (!previewUrl) {
      toast({
        title: "No Image Selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }
    
    startTransition(() => {
        const file = fileInputRef.current?.files?.[0];
        if (file) {
            const newFormData = new FormData();
            newFormData.append('image', file);
            formAction(newFormData);
        }
    });
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <form
      action={handleFormAction}
      className="space-y-6"
    >
      <div className="relative w-32 h-32 mx-auto">
        <Image
          src={displayImageUrl}
          alt="Profile picture preview"
          fill
          className="rounded-full object-cover border-4 border-primary shadow-md"
        />
      </div>

      <div className="w-full">
        <Label
          htmlFor="image-upload"
          className="sr-only"
        >
          Choose a new profile image
        </Label>
        <Input
          id="image-upload"
          name="image"
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          ref={fileInputRef}
          className="w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold 
          file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending || !previewUrl}
        className="w-full"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2" />
            Confirm & Upload
          </>
        )}
      </Button>
    </form>
  );
}
