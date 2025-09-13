
import { getSiteData } from '@/lib/actions';
import { ProjectsForm } from '@/components/dashboard/projects-form';

export default async function DashboardProjectsPage() {
  const siteData = await getSiteData();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Edit Your Projects Section
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm lg:text-base">
          Add, edit, or remove projects to showcase your work.
        </p>
      </div>

      <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow p-6">
        <ProjectsForm currentProjects={siteData.projects} />
      </div>
    </div>
  );
}
