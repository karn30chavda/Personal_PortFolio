
import { ImageUploadForm } from '@/components/dashboard/image-upload-form';
import { ProfileDetailsForm } from '@/components/dashboard/profile-details-form';
import { getProfileData } from '@/lib/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function DashboardPage() {
  const profileData = await getProfileData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile & Hero Section</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
             <h3 className="text-xl font-semibold">Profile Picture</h3>
             <ImageUploadForm currentImageUrl={profileData.imageUrl} />
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-semibold">Details</h3>
            <ProfileDetailsForm currentData={profileData} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
