
'use client';

import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Badge } from '@/components/ui/badge';
import { 
  Code2, 
  Layers, 
  TerminalSquare, 
  DatabaseZap,
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
  FileCode2: <FileCode2 className="h-4 w-4" />,
  CodeXml: <CodeXml className="h-4 w-4" />,
  Palette: <Palette className="h-4 w-4" />,
  Braces: <Braces className="h-4 w-4" />,
  Database: <Database className="h-4 w-4" />,
  Atom: <Atom className="h-4 w-4" />,
  LayoutGrid: <LayoutGrid className="h-4 w-4" />,
  StretchHorizontal: <StretchHorizontal className="h-4 w-4" />,
  Wind: <Wind className="h-4 w-4" />,
  Component: <Component className="h-4 w-4" />,
  GitFork: <GitFork className="h-4 w-4" />,
  Github: <GithubIcon className="h-4 w-4" />,
  Rocket: <Rocket className="h-4 w-4" />,
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  CloudCog: <CloudCog className="h-4 w-4" />,
  Server: <Server className="h-4 w-4" />,
  AppWindow: <AppWindow className="h-4 w-4" />,
  ImageUp: <ImageUp className="h-4 w-4" />,
  
  // Fallbacks
  DefaultCategory: <Layers className="h-5 w-5 mr-2 text-primary" />,
  DefaultSkill: <Cpu className="h-4 w-4" />
};

const getIcon = (name: string | undefined, isCategory: boolean = false) => {
    if (!name) {
        return iconMapping[isCategory ? 'DefaultCategory' : 'DefaultSkill'];
    }
    return iconMapping[name] || iconMapping[isCategory ? 'DefaultCategory' : 'DefaultSkill'];
}

type Skill = {
  name: string;
  iconName?: string;
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
                  {getIcon(skill.iconName)}
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
