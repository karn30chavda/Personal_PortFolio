
import { getSiteData } from '@/lib/actions';
import { ProjectsForm } from '@/components/dashboard/projects-form';

export default async function DashboardProjectsPage() {
  const siteData = await getSiteData();

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-8 space-y-10">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Edit Your Projects Section
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm lg:text-base">
          Add, edit, or remove projects to showcase your work.
        </p>
      </div>

      <div className="p-0 md:p-6 md:bg-white/70 md:dark:bg-gray-900/50 md:backdrop-blur-md md:rounded-2xl md:border md:border-gray-200 md:dark:border-gray-800 md:shadow-sm md:hover:shadow-md md:transition-shadow">
        <ProjectsForm currentProjects={siteData.projects} />
      </div>
    </div>
  );
}
