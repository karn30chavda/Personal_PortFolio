
"use client";

import { useActionState, useState, useRef, type ChangeEvent } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Loader2, CheckCircle, AlertTriangle, CropIcon } from 'lucide-react';
import { updateProfilePicture } from '@/lib/actions';

import 'react-image-crop/dist/ReactCrop.css';

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

// Helper to get the cropped image data
async function getCroppedImg(
  image: HTMLImageElement,
  crop: Crop,
) {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise<string>((resolve) => {
    resolve(canvas.toDataURL('image/jpeg'));
  });
}


export function ImageUploadForm({ currentImageUrl }: { currentImageUrl: string }) {
  const [state, formAction] = useActionState(updateProfilePicture, { success: false, message: '' });
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      );
      reader.readAsDataURL(e.target.files[0]);
      setIsCropModalOpen(true);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, 1, width, height),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const handleCropConfirm = async () => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current) {
      const dataUrl = await getCroppedImg(imgRef.current, completedCrop);
      const formData = new FormData();
      formData.append('croppedImage', dataUrl);
      formAction(formData);
      setIsCropModalOpen(false);
      setImgSrc('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      {state?.message && (
        <Alert variant={state.success ? 'default' : 'destructive'}>
          {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertTitle>{state.success ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-border shadow-md shrink-0">
          <Image
            src={currentImageUrl}
            alt="Current profile picture"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-grow w-full">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-upload" className="text-base">Choose a new profile image</Label>
              <Input
                id="image-upload"
                name="image"
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                ref={fileInputRef}
                className="file:text-primary file:font-semibold"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              After selecting a file, you'll be able to crop it.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Your Image</DialogTitle>
          </DialogHeader>
          {imgSrc && (
            <div className='flex justify-center'>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop
            >
              <Image
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                width={400}
                height={400}
                onLoad={onImageLoad}
                className="max-h-[70vh] object-contain"
              />
            </ReactCrop>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCropConfirm}>
              <CropIcon className="mr-2 h-4 w-4" />
              Confirm Crop & Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
