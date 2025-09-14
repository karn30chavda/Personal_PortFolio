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
import { useActionState, useEffect, useState } from 'react';
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
    const { formState: { isSubmitting } } = useForm<CertificatesFormValues>();
    return (
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
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
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'certificatesData',
  });

  const { toast } = useToast();
  
  const [state, formAction] = useActionState(updateCertificatesData, { success: false, message: '' });

  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([]);

  useEffect(() => {
    setImagePreviews(currentCertificates.map(c => c.imageUrl || null));
  }, [currentCertificates]);
  
  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        const newData = JSON.parse(state.data || '[]');
        form.reset({ certificatesData: newData });
        setImagePreviews(newData.map((c: any) => c.imageUrl || null));
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...imagePreviews];
        newPreviews[index] = reader.result as string;
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormAction = (formData: FormData) => {
    const data = form.getValues();
    formData.append('certificatesData', JSON.stringify(data.certificatesData));
    formAction(formData);
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
                            src={imagePreviews[index] || form.watch(`certificatesData.${index}.imageUrl`) || '/images/placeholder.png'}
                            alt="Certificate image"
                            fill
                            className="object-cover"
                        />
                    </div>
                     <FormField
                      control={form.control}
                      name={`certificatesData.${index}.imageUrl`} // This is just for the schema, the file input below is what matters
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='sr-only'>Image File</FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              name={`image_${index}`}
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, index)}
                              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
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
            onClick={() => {
              append({ title: '', issuer: '', date: '', imageUrl: 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Certificate', credentialUrl: '' });
              setImagePreviews([...imagePreviews, 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Certificate' ]);
            }}
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
