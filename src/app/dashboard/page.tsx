
import { ImageUploadForm } from '@/components/dashboard/image-upload-form';
import { ProfileDetailsForm } from '@/components/dashboard/profile-details-form';
import { getProfileData } from '@/lib/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function DashboardPage() {
  const profileData = await getProfileData();

  return (
    <div className="grid grid-cols-1 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto">
            <ImageUploadForm currentImageUrl={profileData.imageUrl} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile & Hero Section Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto">
            <ProfileDetailsForm currentData={profileData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
