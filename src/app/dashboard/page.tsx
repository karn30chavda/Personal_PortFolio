
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { ImageUploadForm } from '@/components/dashboard/image-upload-form';
import { ProfileDetailsForm } from '@/components/dashboard/profile-details-form';
import { ResumeUploadForm } from '@/components/dashboard/resume-upload-form';
import { getProfileData } from '@/lib/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function DashboardPage() {
  const profileData = await getProfileData();

  return (
    <SectionWrapper id="dashboard" title="Admin Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Edit Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">Profile Picture</h3>
                <ImageUploadForm currentImageUrl={profileData.imageUrl} />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Profile Details</h3>
                <ProfileDetailsForm currentData={profileData} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Update Your Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResumeUploadForm currentResumeUrl={profileData.resumeUrl} />
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}
