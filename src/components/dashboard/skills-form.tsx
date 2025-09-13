
'use client';

import { useFieldArray, useForm, Controller } from 'react-hook-form';
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
import { Plus, Trash } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updateSkillsData } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
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
  }, [state, toast]);

  const onSubmit = (data: SkillsFormValues) => {
    const formData = new FormData();
    formData.append('skillsData', JSON.stringify(data.skillsData));
    formAction(formData);
  };
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((categoryItem, categoryIndex) => (
          <div key={categoryItem.id} className="p-6 rounded-lg border bg-card/50 space-y-4">
            <div className="flex justify-between items-start">
              <FormField
                control={form.control}
                name={`skillsData.${categoryIndex}.category`}
                render={({ field }) => (
                  <FormItem className="w-full mr-4">
                    <FormLabel className="text-lg font-semibold">Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Core Languages" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            onClick={() => append({ category: '', skills: [{ name: '' }] })}
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
        <h4 className="font-medium">Skills</h4>
        {fields.map((skillItem, skillIndex) => (
          <div key={skillItem.id} className="flex items-center gap-2">
            <Controller
              name={`skillsData.${categoryIndex}.skills.${skillIndex}.name`}
              control={control}
              render={({ field }) => (
                <Input placeholder="e.g., JavaScript" {...field} className="flex-grow"/>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(skillIndex)}
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
          onClick={() => append({ name: '' })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>
    );
  }

