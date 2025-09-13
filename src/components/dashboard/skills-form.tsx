
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
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updateSkillsData } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  iconName: z.string().optional(),
});

const skillCategorySchema = z.object({
  category: z.string().min(1, 'Category name is required'),
  categoryIconName: z.string().optional(),
  skills: z.array(skillSchema).min(1, 'At least one skill is required'),
});

const skillsFormSchema = z.object({
  skillsData: z.array(skillCategorySchema),
});

type SkillsFormValues = z.infer<typeof skillsFormSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>_
          <Loader2 className="animate-spin mr-2" />
          Saving...
        </>
      ) : (
        'Save Changes'
      )}
    </Button>
  );
}

export function SkillsForm({ currentSkills }: { currentSkills: SkillsFormValues['skillsData'] }) {
  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      skillsData: currentSkills || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'skillsData',
  });

  const { toast } = useToast();
  
  const [state, formAction] = useActionState(updateSkillsData, { success: false, message: '' });

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        form.reset({ skillsData: JSON.parse(state.data || '[]') });
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
    // This hidden input is not strictly necessary with this setup but is a good pattern
    formData.append('skillsData', JSON.stringify(data.skillsData));
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
            {...form.register('skillsData')}
            value={JSON.stringify(form.watch('skillsData'))}
        />
        {fields.map((categoryItem, categoryIndex) => (
          <div key={categoryItem.id} className="p-4 md:p-6 rounded-lg border bg-card/50 space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                <FormField
                  control={form.control}
                  name={`skillsData.${categoryIndex}.category`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Core Languages" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`skillsData.${categoryIndex}.categoryIconName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Icon Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Code2" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Find icon names on lucide.dev. Examples: Layers, DatabaseZap, Wrench.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(categoryIndex)}
                className="mt-8 shrink-0"
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Remove Category</span>
              </Button>
            </div>
            
            <SkillsFieldArray categoryIndex={categoryIndex} control={form.control} />
          </div>
        ))}

        <div className="flex justify-between items-center pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ category: '', categoryIconName: '', skills: [{ name: '', iconName: '' }] })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
          <SubmitButton />
        </div>
      </form>
    </Form>
  );
}


function SkillsFieldArray({ categoryIndex, control }: { categoryIndex: number, control: any }) {
    const { fields, append, remove } = useFieldArray({
      control,
      name: `skillsData.${categoryIndex}.skills`,
    });
  
    return (
      <div className="pl-4 border-l-2 border-border ml-2 space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground">Skills</h4>
        {fields.map((skillItem, skillIndex) => (
          <div key={skillItem.id} className="flex items-start gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-grow">
              <FormField
                name={`skillsData.${categoryIndex}.skills.${skillIndex}.name`}
                control={control}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                     <FormLabel className="text-xs">Skill Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., JavaScript" {...field} className="flex-grow"/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                name={`skillsData.${categoryIndex}.skills.${skillIndex}.iconName`}
                control={control}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                     <FormLabel className="text-xs">Icon Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Braces" {...field} className="flex-grow" value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(skillIndex)}
              className='mt-6'
            >
              <Trash className="h-4 w-4 text-destructive" />
               <span className="sr-only">Remove Skill</span>
            </Button>
          </div>
        ))}
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => append({ name: '', iconName: '' })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>
    );
  }
