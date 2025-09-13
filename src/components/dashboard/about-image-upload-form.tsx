
"use client";

import { useActionState, useState, useRef, type ChangeEvent, useTransition } from 'react';
import Image from 'next/image';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Loader2, CheckCircle, AlertTriangle, CropIcon, Upload } from 'lucide-react';
import { updateAboutImage } from '@/lib/actions';

import 'react-image-crop/dist/ReactCrop.css';

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


export function AboutImageUploadForm({ currentImageUrl }: { currentImageUrl: string }) {
  const [state, formAction] = useActionState(updateAboutImage, { success: false, message: '' });
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

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
    const aspect = 16 / 9;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height),
      width,
      height
    );
    setCrop(initialCrop);
  };
  
  const handleFormAction = async (formData: FormData) => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current) {
        const dataUrl = await getCroppedImg(imgRef.current, completedCrop);
        formData.set('croppedImage', dataUrl);
    }
    
    startTransition(() => {
        formAction(formData);
    });

    // This part runs after the action is initiated
    setIsCropModalOpen(false);
    setImgSrc('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full aspect-video relative rounded-lg overflow-hidden border-4 border-border shadow-md shrink-0">
          <Image
            src={currentImageUrl}
            alt="Current about section image"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full">
            <Label htmlFor="about-image-upload-button" className="sr-only">Choose a new image</Label>
            <Button onClick={() => fileInputRef.current?.click()} className='w-full'>
              <Upload className="mr-2 h-4 w-4" />
              Change Image
            </Button>
            <Input
              id="about-image-upload"
              name="image"
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              ref={fileInputRef}
              className="hidden"
            />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              You'll be able to crop it after selecting.
            </p>
        </div>
      </div>

      {state?.message && (
        <Alert variant={state.success ? 'default' : 'destructive'} className='mt-4'>
          {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertTitle>{state.success ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="max-w-3xl">
          <form action={handleFormAction}>
            <DialogHeader>
              <DialogTitle>Crop Your Image</DialogTitle>
            </DialogHeader>
            {imgSrc && (
              <div className='flex justify-center my-4'>
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={16/9}
              >
                <Image
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  width={800}
                  height={450}
                  onLoad={onImageLoad}
                  className="max-h-[70vh] object-contain"
                />
              </ReactCrop>
              </div>
            )}
            <DialogFooter className="mt-4 flex-col-reverse space-y-2 space-y-reverse sm:flex-row sm:space-y-0 sm:justify-end sm:space-x-2">
               <DialogClose asChild>
                <Button variant="outline" type="button" className="w-full sm:w-auto">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CropIcon className="mr-2 h-4 w-4" />
                    Confirm & Upload
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
