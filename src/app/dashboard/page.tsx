
import { ImageUploadForm } from '@/components/dashboard/image-upload-form';
import { ProfileDetailsForm } from '@/components/dashboard/profile-details-form';
import { getProfileData } from '@/lib/actions';

export default async function DashboardPage() {
  const profileData = await getProfileData();

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile & Hero Section</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
              <div className="p-6 bg-card rounded-lg border">
                <ImageUploadForm currentImageUrl={profileData.imageUrl} />
              </div>
          </div>
          
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <div className="p-6 bg-card rounded-lg border">
                <ProfileDetailsForm currentData={profileData} />
            </div>
          </div>
        </div>
    </div>
  );
}
