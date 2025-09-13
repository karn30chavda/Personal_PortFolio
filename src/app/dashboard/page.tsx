
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { ImageUploadForm } from '@/components/dashboard/image-upload-form';
import { getProfileData } from '@/lib/actions';

export default async function DashboardPage() {
  const profileData = await getProfileData();

  return (
    <SectionWrapper id="dashboard" title="Admin Dashboard">
      <div className="grid gap-8">
        <div className="bg-card text-card-foreground p-8 rounded-lg shadow-md border">
          <p>Welcome to the dashboard. This is a protected area.</p>
        </div>

        <div className="bg-card text-card-foreground p-8 rounded-lg shadow-md border">
          <h2 className="text-2xl font-semibold mb-4">Update Profile Picture</h2>
          <ImageUploadForm currentImageUrl={profileData.imageUrl} />
        </div>
      </div>
    </SectionWrapper>
  );
}
