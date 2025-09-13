'use client';

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
  Github as GithubIcon,
  CodeXml,
  Rocket,
  CloudCog,
  AppWindow,
  ImageUp,
  LayoutDashboard,
  Atom,
  Server,
  Wrench,
  Cpu,
  FileJson,
  FileText
} from 'lucide-react';
import { getSiteData } from '@/lib/actions';
import { useEffect, useState } from 'react';

const iconMapping: { [key: string]: React.ReactNode } = {
  Code2: <Code2 className="h-5 w-5 mr-2 text-primary" />,
  Layers: <Layers className="h-5 w-5 mr-2 text-primary" />,
  TerminalSquare: <TerminalSquare className="h-5 w-5 mr-2 text-primary" />,
  DatabaseZap: <DatabaseZap className="h-5 w-5 mr-2 text-primary" />,
  Wrench: <Wrench className="h-5 w-5 mr-2 text-primary" />,
  
  // Individual Skill Icons
  'C/C++': <FileCode2 className="h-4 w-4" />,
  HTML: <CodeXml className="h-4 w-4" />,
  CSS: <Palette className="h-4 w-4" />,
  JavaScript: <Braces className="h-4 w-4" />,
  SQL: <Database className="h-4 w-4" />,
  React: <Atom className="h-4 w-4" />,
  Bootstrap: <LayoutGrid className="h-4 w-4" />,
  FlexBox: <StretchHorizontal className="h-4 w-4" />,
  'TailwindCSS': <Wind className="h-4 w-4" />,
  'Shadcn/UI': <Component className="h-4 w-4" />,
  Git: <GitFork className="h-4 w-4" />,
  GitHub: <GithubIcon className="h-4 w-4" />,
  'VisualStudioCode': <Code2 className="h-4 w-4" />,
  Netlify: <Rocket className="h-4 w-4" />,
  'FirebaseStudio': <LayoutDashboard className="h-4 w-4" />,
  'GoogleFirebase': <CloudCog className="h-4 w-4" />,
  Supabase: <Server className="h-4 w-4" />,
  PWA: <AppWindow className="h-4 w-4" />,
  Cloudinary: <ImageUp className="h-4 w-4" />,
  
  // Fallbacks
  DefaultCategory: <Layers className="h-5 w-5 mr-2 text-primary" />,
  DefaultSkill: <Cpu className="h-4 w-4" />
};

const getIcon = (name: string, isCategory: boolean = false) => {
    if (isCategory) {
        return iconMapping[name] || iconMapping['DefaultCategory'];
    }
    // Normalize name for lookup (e.g., "Visual Studio Code" -> "VisualStudioCode")
    const normalizedName = name.replace(/[^a-zA-Z0-9]/g, '');
    return iconMapping[normalizedName] || iconMapping[name] || iconMapping['DefaultSkill'];
}

type Skill = {
  name: string;
};

type SkillCategory = {
  category: string;
  categoryIconName?: string;
  skills: Skill[];
};

export function SkillsSection() {
  const [skillsData, setSkillsData] = useState<SkillCategory[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const siteData = await getSiteData();
      setSkillsData(siteData.skills);
    }
    fetchData();
  }, []);

  if (!skillsData) {
    return (
        <SectionWrapper id="skills" title="My Skills">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-6 bg-card rounded-lg shadow-md border border-border animate-pulse">
                        <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                        <div className="flex flex-wrap gap-2">
                            <div className="h-8 bg-muted rounded-full w-24"></div>
                            <div className="h-8 bg-muted rounded-full w-32"></div>
                            <div className="h-8 bg-muted rounded-full w-28"></div>
                        </div>
                    </div>
                ))}
            </div>
      </SectionWrapper>
    );
  }

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
              {getIcon(skillCategory.categoryIconName || 'DefaultCategory', true)}
              {skillCategory.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillCategory.skills.map((skill) => (
                <Badge 
                  key={skill.name} 
                  variant="secondary" 
                  className="text-sm py-1 px-3 bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 flex items-center gap-1.5"
                >
                  {getIcon(skill.name)}
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
