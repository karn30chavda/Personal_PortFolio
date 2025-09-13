
import { getProfileData } from '@/lib/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AboutForm } from '@/components/dashboard/about-form';
import { AboutImageUploadForm } from '@/components/dashboard/about-image-upload-form';

export default async function DashboardAboutPage() {
  const profileData = await getProfileData();

  return (
    <div className="grid grid-cols-1 gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit Your About Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div>
                <h3 className="text-xl font-semibold mb-4">About Section Image</h3>
                <AboutImageUploadForm currentImageUrl={profileData.about.imageUrl} />
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-4">About Section Text</h3>
                <AboutForm currentData={profileData.about} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
