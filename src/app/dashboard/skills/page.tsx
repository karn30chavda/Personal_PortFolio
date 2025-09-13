import { getSiteData } from '@/lib/actions';
import { SkillsForm } from '@/components/dashboard/skills-form';

export default async function DashboardSkillsPage() {
  const siteData = await getSiteData();

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-8 space-y-10">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Edit Your Skills Section
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm lg:text-base">
          Add, edit, or remove skill categories and individual skills.
        </p>
      </div>

      <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow p-4 md:p-6">
        <SkillsForm currentSkills={siteData.skills} />
      </div>
    </div>
  );
}
