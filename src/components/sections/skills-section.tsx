import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Badge } from '@/components/ui/badge';
import { 
  Code2, 
  Layers, 
  TerminalSquare, 
  DatabaseZap,
  Binary,
  FileCode2,
  Palette,
  Braces,
  Database,
  LayoutGrid,
  StretchHorizontal,
  Wind,
  Component,
  GitFork,
  Github,
  CodeXml,
  Rocket,
  CloudCog,
  AppWindow,
  ImageUp,
  LayoutDashboard,
  Atom
} from 'lucide-react';

const skillsData = [
  {
    category: 'Core Languages & Markup',
    categoryIcon: <Code2 className="h-5 w-5 mr-2 text-primary" />,
    skills: [
      { name: 'C/C++', icon: <Binary className="h-4 w-4" /> },
      { name: 'HTML', icon: <FileCode2 className="h-4 w-4" /> },
      { name: 'CSS', icon: <Palette className="h-4 w-4" /> },
      { name: 'JavaScript', icon: <Braces className="h-4 w-4" /> },
      { name: 'SQL', icon: <Database className="h-4 w-4" /> }
    ]
  },
  {
    category: 'Frameworks, Libraries & CSS Tools',
    categoryIcon: <Layers className="h-5 w-5 mr-2 text-primary" />,
    skills: [
      { name: 'React', icon: <Atom className="h-4 w-4" /> },
      { name: 'Bootstrap', icon: <LayoutGrid className="h-4 w-4" /> },
      { name: 'FlexBox', icon: <StretchHorizontal className="h-4 w-4" /> },
      { name: 'Tailwind CSS', icon: <Wind className="h-4 w-4" /> },
      { name: 'Shadcn/UI', icon: <Component className="h-4 w-4" /> }
    ]
  },
  {
    category: 'Development Tools & Platforms',
    categoryIcon: <TerminalSquare className="h-5 w-5 mr-2 text-primary" />,
    skills: [
      { name: 'Git', icon: <GitFork className="h-4 w-4" /> },
      { name: 'GitHub', icon: <Github className="h-4 w-4" /> },
      { name: 'Visual Studio Code', icon: <CodeXml className="h-4 w-4" /> },
      { name: 'Netlify', icon: <Rocket className="h-4 w-4" /> },
      { name: 'Firebase Studio', icon: <LayoutDashboard className="h-4 w-4" /> }
    ]
  },
  {
    category: 'Backend, BaaS & PWA',
    categoryIcon: <DatabaseZap className="h-5 w-5 mr-2 text-primary" />,
    skills: [
      { name: 'Google Firebase', icon: <CloudCog className="h-4 w-4" /> },
      { name: 'Supabase', icon: <DatabaseZap className="h-4 w-4" /> }, // Re-using for consistency
      { name: 'PWA', icon: <AppWindow className="h-4 w-4" /> },
      { name: 'Cloudinary', icon: <ImageUp className="h-4 w-4" /> }
    ]
  },
];

export function SkillsSection() {
  return (
    <SectionWrapper id="skills" title="My Skills" animationDelay={3}>
      {skillsData.length === 0 ? (
        <div className="text-center py-8 bg-card rounded-lg shadow-md border border-border p-6">
          <p className="text-lg text-muted-foreground mb-4">
            My skills will be listed here soon! Please provide the details for your skills.
          </p>
        </div>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skillsData.map((skillCategory) => (
          <div key={skillCategory.category} className="p-6 bg-card rounded-lg shadow-md border border-border">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground">
              {skillCategory.categoryIcon}
              {skillCategory.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillCategory.skills.map((skill) => (
                <Badge 
                  key={skill.name} 
                  variant="secondary" 
                  className="text-sm py-1 px-3 bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 flex items-center gap-1.5"
                >
                  {skill.icon}
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
