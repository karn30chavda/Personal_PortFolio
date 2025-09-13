
"use client";

import { useActionState, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateResume } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle, Upload, FileText } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="animate-spin mr-2" />
          Uploading...
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" />
          Upload New Resume
        </>
      )}
    </Button>
  );
}

export function ResumeUploadForm({ currentResumeUrl }: { currentResumeUrl: string }) {
  const [state, formAction] = useActionState(updateResume, { success: false, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName('');
    }
  };

  const handleFormAction = (formData: FormData) => {
    formAction(formData);
    // Reset file input after submission
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    setFileName('');
  }

  return (
    <form action={handleFormAction} className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Current Resume:</p>
        <a href={currentResumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline break-all">
          {currentResumeUrl.split('/').pop()}
        </a>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume-upload">Choose a new resume (PDF only)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="resume-upload"
            name="resume"
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <FileText className="mr-2 h-4 w-4" />
            Browse File
          </Button>
          {fileName && <span className="text-sm text-muted-foreground truncate">{fileName}</span>}
        </div>
      </div>
      
      {state?.message && (
        <Alert variant={state.success ? 'default' : 'destructive'} className='mt-4'>
          {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertTitle>{state.success ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <SubmitButton />
    </form>
  );
}
