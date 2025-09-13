
'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash, Loader2, Upload } from 'lucide-react';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateCertificatesData } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const certificateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  imageUrl: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal('')),
});

const certificatesFormSchema = z.object({
  certificatesData: z.array(certificateSchema),
});

type CertificatesFormValues = z.infer<typeof certificatesFormSchema>;

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
          'Save Changes'
        )}
      </Button>
    );
  }

export function CertificatesForm({ currentCertificates }: { currentCertificates: CertificatesFormValues['certificatesData'] }) {
  const form = useForm<CertificatesFormValues>({
    resolver: zodResolver(certificatesFormSchema),
    defaultValues: {
      certificatesData: currentCertificates || [],
    },
  });

  const { fields, append, remove, setValue } = useFieldArray({
    control: form.control,
    name: 'certificatesData',
  });

  const { toast } = useToast();
  
  const [state, formAction] = useActionState(updateCertificatesData, { success: false, message: '' });
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        form.reset({ certificatesData: JSON.parse(state.data || '[]') });
        toast({
          title: 'Success',
          description: state.message,
        });
      } else {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast, form]);

  const handleFormAction = (formData: FormData) => {
    const data = form.getValues();
    formData.append('certificatesData', JSON.stringify(data.certificatesData));
    formAction(formData);
  };

  const handleImageUpload = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if(data.secure_url) {
            setValue(`certificatesData.${index}.imageUrl`, data.secure_url);
            toast({ title: 'Success', description: 'Image uploaded successfully' });
        } else {
            throw new Error('Image upload failed');
        }
    } catch (error) {
        toast({ title: 'Error', description: 'Image upload failed', variant: 'destructive' });
    }
  };

  return (
    <Form {...form}>
      <form
        action={handleFormAction}
        className="space-y-8"
      >
        <input
            type="hidden"
            {...form.register('certificatesData')}
            value={JSON.stringify(form.watch('certificatesData'))}
        />
        {fields.map((certItem, index) => (
          <div key={certItem.id} className="p-4 md:p-6 rounded-lg border bg-card/50 space-y-6 relative">
            <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
                className="absolute -top-3 -right-3 shrink-0 z-10"
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Remove Certificate</span>
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-2">
                    <FormLabel>Certificate Image</FormLabel>
                    <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                        <Image
                            src={form.watch(`certificatesData.${index}.imageUrl`) || '/images/placeholder.png'}
                            alt="Certificate image"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <Button type='button' variant='outline' className='w-full' onClick={() => fileInputRefs.current[index]?.click()}>
                        <Upload className='mr-2 h-4 w-4' />
                        Upload Image
                    </Button>
                    <Input 
                        type="file" 
                        className="hidden" 
                        ref={el => fileInputRefs.current[index] = el}
                        onChange={(e) => {
                            if(e.target.files?.[0]) {
                                handleImageUpload(e.target.files[0], index);
                            }
                        }}
                    />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <FormField
                        control={form.control}
                        name={`certificatesData.${index}.title`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Certificate Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., AWS Certified Cloud Practitioner" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`certificatesData.${index}.issuer`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Issuer</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Amazon Web Services" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <FormField
                            control={form.control}
                            name={`certificatesData.${index}.date`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., October 2023" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`certificatesData.${index}.credentialUrl`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Credential URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/credential" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ title: '', issuer: '', date: '', imageUrl: 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Certificate', credentialUrl: '' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Certificate
          </Button>
          <SubmitButton />
        </div>
      </form>
    </Form>
  );
}
