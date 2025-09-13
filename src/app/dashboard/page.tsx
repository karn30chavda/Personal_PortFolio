
import { ImageUploadForm } from '@/components/dashboard/image-upload-form';
import { ProfileDetailsForm } from '@/components/dashboard/profile-details-form';
import { getProfileData } from '@/lib/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function DashboardPage() {
  const profileData = await getProfileData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploadForm currentImageUrl={profileData.imageUrl} />
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile & Hero Section Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileDetailsForm currentData={profileData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
