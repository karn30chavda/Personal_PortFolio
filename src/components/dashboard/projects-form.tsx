
'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash, Loader2 } from 'lucide-react';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { updateProjectsData } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';
import Image from 'next/image';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().optional(),
  tags: z.string().min(1, 'Tags are required'),
  liveUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
});

const projectsFormSchema = z.object({
  projectsData: z.array(projectSchema),
});

type ProjectsFormValues = z.infer<typeof projectsFormSchema>;

export function ProjectsForm({
  currentProjects,
}: {
  currentProjects: ProjectsFormValues['projectsData'];
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ProjectsFormValues>({
    resolver: zodResolver(projectsFormSchema),
    defaultValues: {
      projectsData: currentProjects || [],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'projectsData',
  });

  const [state, formAction] = useActionState(updateProjectsData, {
    success: false,
    message: '',
  });

  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(
    currentProjects.map((p) => p.imageUrl || null)
  );

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        const newData = JSON.parse(state.data || '[]');
        form.reset({ projectsData: newData });
        setImagePreviews(newData.map((p: any) => p.imageUrl || null));
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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
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

  const onFormSubmit = (data: ProjectsFormValues) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append('projectsData', JSON.stringify(data.projectsData));

      data.projectsData.forEach((_, index) => {
        const fileInput = document.querySelector<HTMLInputElement>(
          `input[name="projectsData.${index}.imageFile"]`
        );
        if (fileInput?.files?.[0]) {
          formData.append(`image_${index}`, fileInput.files[0]);
        }
      });
      
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        {fields.map((projectItem, index) => (
          <div
            key={projectItem.id}
            className="p-4 md:p-6 rounded-lg border bg-card/50 space-y-6 relative"
          >
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => remove(index)}
              className="absolute -top-3 -right-3 shrink-0 z-10"
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Remove Project</span>
            </Button>
            
            <div className="space-y-4">
                <FormLabel>Project Image</FormLabel>
                <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                  <Image
                    src={
                      imagePreviews[index] ||
                      form.watch(`projectsData.${index}.imageUrl`) ||
                      'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Project'
                    }
                    alt="Project image"
                    fill
                    className="object-cover"
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`projectsData.${index}.imageFile` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Image File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          onChange={(e) => {
                            field.onChange(e.target.files)
                            handleImageChange(e, index)
                          }}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <FormField
              control={form.control}
              name={`projectsData.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., PWA Calculator"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`projectsData.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the project"
                      {...field}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`projectsData.${index}.tags`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="PWA, JavaScript, HTML" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of tags.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`projectsData.${index}.liveUrl`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`projectsData.${index}.repoUrl`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repo URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/user/repo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <div className="flex justify-between items-center pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              append({
                title: '',
                description: '',
                imageUrl:
                  'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Project',
                tags: '',
                liveUrl: '',
                repoUrl: '',
              });
              setImagePreviews([
                ...imagePreviews,
                'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Project',
              ]);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
