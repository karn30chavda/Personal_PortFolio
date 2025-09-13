
import { ImageUploadForm } from '@/components/dashboard/image-upload-form';
import { ProfileDetailsForm } from '@/components/dashboard/profile-details-form';
import { getProfileData } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const profileData = await getProfileData();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Edit Profile & Hero Section</h1>
      
      <Card>
        <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
            <ImageUploadForm currentImageUrl={profileData.imageUrl} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
            <ProfileDetailsForm currentData={profileData} />
        </CardContent>
      </Card>
    </div>
  );
}
