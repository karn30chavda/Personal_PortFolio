
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { ImageUploadForm } from '@/components/dashboard/image-upload-form';
import { ProfileDetailsForm } from '@/components/dashboard/profile-details-form';
import { getProfileData } from '@/lib/actions';

export default async function DashboardPage() {
  const profileData = await getProfileData();

  return (
    <SectionWrapper id="dashboard" title="Admin Dashboard">
      <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-lg shadow-xl border">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Edit Your Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left column for image upload */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Profile Picture</h3>
            <ImageUploadForm currentImageUrl={profileData.imageUrl} />
          </div>
          
          {/* Right column for profile details */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Profile Details</h3>
            <ProfileDetailsForm currentData={profileData} />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
