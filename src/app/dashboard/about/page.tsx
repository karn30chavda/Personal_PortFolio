
import { getProfileData } from '@/lib/actions';
import { AboutForm } from '@/components/dashboard/about-form';
import { AboutImageUploadForm } from '@/components/dashboard/about-image-upload-form';

export default async function DashboardAboutPage() {
  const profileData = await getProfileData();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Edit Your About Section
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm lg:text-base">
          Update the image and text content for the "About Me" section on your homepage.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div className="p-0 md:p-6 md:bg-white/70 md:dark:bg-gray-900/50 md:backdrop-blur-md md:rounded-2xl md:border md:border-gray-200 md:dark:border-gray-800 md:shadow-sm md:hover:shadow-md md:transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              About Image
            </h2>
            <AboutImageUploadForm currentImageUrl={profileData.about.imageUrl} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="p-0 md:p-6 md:bg-white/70 md:dark:bg-gray-900/50 md:backdrop-blur-md md:rounded-2xl md:border md:border-gray-200 md:dark:border-gray-800 md:shadow-sm md:hover.shadow-md md:transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              About Text
            </h2>
            <AboutForm currentData={profileData.about} />
          </div>
        </div>
      </div>
    </div>
  );
}
