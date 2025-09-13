
import { getProfileData } from '@/lib/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AboutForm } from '@/components/dashboard/about-form';
import { AboutImageUploadForm } from '@/components/dashboard/about-image-upload-form';

export default async function DashboardAboutPage() {
  const profileData = await getProfileData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Your About Section</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
              <h3 className="text-xl font-semibold mb-4">About Image</h3>
              <AboutImageUploadForm currentImageUrl={profileData.about.imageUrl} />
          </div>
          <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-4">About Text</h3>
              <AboutForm currentData={profileData.about} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
