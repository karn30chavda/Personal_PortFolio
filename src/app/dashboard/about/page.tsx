
import { getProfileData } from '@/lib/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AboutForm } from '@/components/dashboard/about-form';

export default async function DashboardAboutPage() {
  const profileData = await getProfileData();

  return (
    <div className="grid grid-cols-1 gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit Your About Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl mx-auto">
            <AboutForm currentData={profileData.about} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
