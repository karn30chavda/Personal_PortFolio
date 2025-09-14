
import { ImageUploadForm } from '@/components/dashboard/image-upload-form';
import { ProfileDetailsForm } from '@/components/dashboard/profile-details-form';
import { getProfileData } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const profileData = await getProfileData();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Profile & Hero Section
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Update your profile picture and personal details to keep your portfolio fresh.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploadForm currentImageUrl={profileData.imageUrl} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
           <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileDetailsForm currentData={profileData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
