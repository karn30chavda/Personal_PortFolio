
"use client";

import { useActionState, useState, useTransition, useEffect } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Loader2, Edit } from 'lucide-react';
import { updateProfilePicture } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { ImageCropperDialog } from './image-cropper-dialog';

export function ImageUploadForm({ currentImageUrl }: { currentImageUrl: string }) {
  const [state, formAction] = useActionState(updateProfilePicture, { success: false, message: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast({
          title: "Success",
          description: state.message,
        });
        setDialogOpen(false); 
      } else {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state, toast]);

  const handleSave = (croppedImage: string | null) => {
    if (!croppedImage) {
        toast({ title: "Error", description: "Could not get cropped image.", variant: "destructive" });
        setDialogOpen(false);
        return;
    }
    
    startTransition(() => {
        const formData = new FormData();
        formData.append('image', croppedImage);
        formAction(formData);
    });
  };

  return (
    <div className="space-y-6 text-center">
        <div className="relative w-32 h-32 mx-auto">
            <Image
                src={currentImageUrl}
                alt="Current profile picture"
                fill
                className="rounded-full object-cover border-4 border-primary shadow-md"
            />
        </div>

        <ImageCropperDialog
            isOpen={dialogOpen}
            onOpenChange={setDialogOpen}
            onSave={handleSave}
            isSaving={isPending}
        >
            <Button onClick={() => setDialogOpen(true)} variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Picture
            </Button>
        </ImageCropperDialog>

        {isPending && (
            <div className="flex items-center justify-center text-muted-foreground text-sm">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                <span>Updating profile picture...</span>
            </div>
        )}
    </div>
  );
}
