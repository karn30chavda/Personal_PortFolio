
import { SectionWrapper } from '@/components/shared/section-wrapper';

export default function DashboardPage() {
  return (
    <SectionWrapper id="dashboard" title="Admin Dashboard">
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-md border">
        <p>Welcome to the dashboard. This is a protected area.</p>
      </div>
    </SectionWrapper>
  );
}
