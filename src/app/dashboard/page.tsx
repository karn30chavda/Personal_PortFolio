
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { ImageUploadForm } from '@/components/dashboard/image-upload-form';
import { ProfileDetailsForm } from '@/components/dashboard/profile-details-form';
import { getProfileData } from '@/lib/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function DashboardPage() {
  const profileData = await getProfileData();

  return (
    <div className="grid grid-cols-1 gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit Your Profile & Hero Section</CardTitle>
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
    </div>
  );
}
