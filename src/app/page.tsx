"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Terminal from "@/components/terminal";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import ContactForm from "@/components/contact-form";
import {
  Code,
  Globe,
  Smartphone,
  BrainCircuit,
  GitMerge,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import AnimatedName from "@/components/animated-name";
import { Skeleton } from "@/components/ui/skeleton";

const skills = [
  { name: 'JavaScript', icon: <Code /> },
  { name: 'React.js', icon: <Code /> },
  { name: 'Tailwind CSS', icon: <Code /> },
  { name: 'WebExtensions API', icon: <Globe /> },
  { name: 'Manifest v3', icon: <Globe /> },
  { name: 'React Native', icon: <Smartphone /> },
  { name: 'Flutter', icon: <Smartphone /> },
  { name: 'Android (Java/Kotlin)', icon: <Smartphone /> },
  { name: 'Python', icon: <BrainCircuit /> },
  { name: 'NumPy', icon: <BrainCircuit /> },
  { name: 'Pandas', icon: <BrainCircuit /> },
  { name: 'scikit-learn', icon: <BrainCircuit /> },
  { name: 'TensorFlow', icon: <BrainCircuit /> },
  { name: 'PyTorch', icon: <BrainCircuit /> },
  { name: 'Git & GitHub', icon: <GitMerge /> },
  { name: 'REST APIs', icon: <Globe /> },
];

type ProjectLike = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string; // URL for API-provided OG image
  imageHint?: string; // Hint for placeholder generator (static only)
  url?: string; // Repo URL (API)
};

// Remove static projects; we'll list dynamic repos with the "portfolio" topic
const projects: ProjectLike[] = [];

const homeTerminalSkills = [
  'Frontend Development',
  'Browser Extensions',
  'App Development',
  'Machine Learning',
  'Git & GitHub',
  'REST APIs',
];
const homeTerminalExperience =
  'Welcome to my portfolio! I build cool stuff for the web and beyond.';

const aboutTerminalSkills = skills.map((s) => s.name);
const aboutTerminalExperience = `sanjay@devbox:~$ whoami
Frontend Developer | Browser Extension Builder | ML Explorer | App Developer

sanjay@devbox:~$ ls -F ~/projects/
frontend/  browser-extensions/  machine-learning/  mobile-apps/

sanjay@devbox:~$ cd frontend/
sanjay@devbox:~/projects/frontend$ ls
react-portfolio/  tailwind-ui/  interactive-dashboard/

sanjay@devbox:~/projects/frontend$ cat tailwind-ui/package.json | grep "react"
  "react": "^18.2.0",

sanjay@devbox:~/projects/frontend$ cd ../browser-extensions/
sanjay@devbox:~/projects/browser-extensions$ ls
dyslexia-reader/  smart-highlighter/  auto-translator/

sanjay@devbox:~/projects/browser-extensions$ cat manifest.json | grep "manifest_version"
  "manifest_version": 3,

sanjay@devbox:~/projects/browser-extensions$ cd ../machine-learning/
sanjay@devbox:~/projects/machine-learning$ python -c "import torch; print(torch.__version__)"
2.2.0

sanjay@devbox:~/projects/machine-learning$ python -c "import sklearn; print(sklearn.__version__)"
1.4.2

sanjay@devbox:~/projects/machine-learning$ grep -r "model" .
./chatbot/train.py:    model = RandomForestClassifier()

sanjay@devbox:~/projects/machine-learning$ cd ../mobile-apps/
sanjay@devbox:~/projects/mobile-apps$ ls
flutter-mindmate/  react-native-todo/  android-kotlin-calc/

sanjay@devbox:~/projects/mobile-apps$ echo "Building modern apps and solving real-world problems is my daily drive."
Building modern apps and solving real-world problems is my daily drive.`;

const SkillProgress = ({
  title,
  value,
}: {
  title: string;
  value: number;
}) => (
  <div className="group">
    <div className="flex justify-between mb-1">
      <h3 className="text-lg font-headline text-primary">{title}</h3>
      <span className="text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {value}%
      </span>
    </div>
    <Progress
      value={value}
      className="h-2.5 bg-secondary group-hover:bg-primary/20 transition-all duration-300"
    />
  </div>
);

const CardWrapper: React.FC<{ href?: string; label?: string; children: React.ReactNode }> = ({ href, label, children }) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-lg"
      aria-label={label}
    >
      {children}
    </a>
  ) : (
    <div>{children}</div>
  );

const ProjectCard = ({
  project,
}: {
  project: ProjectLike & { stars?: number; updatedAt?: string };
}) => {
  const placeholder = PlaceHolderImages.find((img) => img.id === project.id);
  const imgSrc = project.image || placeholder?.imageUrl;

  return (
    <CardWrapper href={project.url} label={`Open ${project.title} on GitHub`}>
    <div className="bg-secondary/70 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-border hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2">
      {imgSrc ? (
        <div className="relative h-48 w-full">
          <Image
            src={imgSrc}
            alt={project.title}
            fill
            className="object-cover"
            data-ai-hint={project.imageHint}
          />
        </div>
      ) : (
        <div className="h-48 w-full bg-background flex items-center justify-center text-5xl text-primary">
          {project.id === 'f-collab' ? '🤝' : '💬'}
        </div>
      )}
      <div className="p-6">
        <h3 className="font-headline text-xl mb-2 text-primary">
          {project.title}
        </h3>
        <p className="text-muted-foreground mb-4">{project.description}</p>
        { (project.stars != null || project.updatedAt) && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            {project.stars != null && <span>⭐ {project.stars}</span>}
            {project.updatedAt && <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-primary/10 text-primary border-primary/50"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  </CardWrapper>
  );
};

export default function Home() {
  const [repos, setRepos] = useState<ProjectLike[] | null>(null);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(true);
  const [reposError, setReposError] = useState<string | null>(null);
  // Always show all public repositories (API excludes specific names)

  useEffect(() => {
    let cancelled = false;
  const fetchRepos = async () => {
      try {
    const res = await fetch(`/api/github-repos?user=sanjayrohith&per_page=100`, {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        if (!res.ok) {
          // Graceful degrade: try to read body and fall back to empty list
          const json = await res.json().catch(() => ({}));
          const list = (json?.repos || []) as ProjectLike[];
          if (!cancelled) setRepos(list);
          return;
        }
        const json = await res.json();
        const list = (json?.repos || []) as ProjectLike[];
        if (!cancelled) setRepos(list);
      } catch (e: unknown) {
        // Log and hide error banner; just show empty state
        console.error('Failed to load GitHub repos', e);
        if (!cancelled) {
          setRepos([]);
          setReposError(null);
        }
      } finally {
        if (!cancelled) setLoadingRepos(false);
      }
    };
    setLoadingRepos(true);
  setReposError(null);
    fetchRepos();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Section id="home">
        <AnimatedName name="SANJAY ROHITH" />
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
        Web/App Developer & Freelancer
        </p>
        <Terminal
          skills={homeTerminalSkills}
          experience={homeTerminalExperience}
          title="bash - 80x24"
        />
      </Section>

      <Section id="about">
        <h2 className="text-4xl font-bold font-headline mb-6">About Me</h2>
        <p className="max-w-3xl text-lg text-muted-foreground mb-8">
          &quot;Hello! I&apos;m Sanjay Rohith, a passionate Frontend Developer and App Developer with skills in creating interactive web applications, building browser extensions, and exploring machine learning. I enjoy crafting modern user interfaces, enhancing user experiences, and developing innovative solutions across both web and mobile platforms.&quot;
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-secondary/70 backdrop-blur-sm border border-border transform transition-transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-primary font-headline">
                Linux Administration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Expert in managing and securing Linux servers, implementing
                robust backup solutions, and optimizing system performance.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/70 backdrop-blur-sm border border-border transform transition-transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-primary font-headline">
                Web/App Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Skilled in developing scalable Web applications using
                Typescript/Javascript and Next.js, ensuring seamless user
                experiences.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/70 backdrop-blur-sm border border-border transform transition-transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-primary font-headline">
                Browser Extensions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Experienced in implementing various browser extensions that are currently being used by many clients.
              </p>
            </CardContent>
          </Card>
        </div>
        <Terminal
          skills={aboutTerminalSkills}
          experience={aboutTerminalExperience}
          title="experience.sh"
        />
      </Section>

      <Section id="skills">
        <h2 className="text-4xl font-bold font-headline mb-8">
          Technical Skills
        </h2>
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {skills.map((skill) => (
            <Badge
              key={skill.name}
              className="text-md py-2 px-4 bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 transition-colors"
            >
              {skill.icon}
              {skill.name}
            </Badge>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          <SkillProgress title="Frontend Development" value={95} />
          <SkillProgress title="Browser Extension Development" value={80} />
          <SkillProgress title="Mobile App Development" value={85} />
          <SkillProgress title="Machine Learning" value={70} />
          <SkillProgress title="Git Version Control" value={82} />
        </div>
      </Section>

      <Section id="projects">
        <h2 className="text-4xl font-bold font-headline mb-2">
          Repositories
        </h2>
  {/* Hide error banner; show empty state instead */}
        {!loadingRepos && !reposError && repos && repos.length === 0 && (
          <div className="mb-6 text-sm text-muted-foreground flex flex-col items-center gap-3">
            <p>No public repositories found.</p>
          </div>
        )}
        {loadingRepos ? (
          <div className="grid md:grid-cols-2 gap-8 w-full">
            {['s1','s2','s3','s4'].map((key) => (
              <Card key={key} className="bg-secondary/70 backdrop-blur-sm border border-border overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {(repos || projects).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Section>

      <Section id="contact">
        <h2 className="text-4xl font-bold font-headline mb-4">Get In Touch</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-center">
          Have a project in mind or interested in collaborating? Feel free to
          reach out!
        </p>
        <ContactForm />
      </Section>
    </>
  );
}

function Section({
  id,
  children,
}: Readonly<{
  id: string;
  children: ReactNode;
}>) {
  return (
    <section
      id={id}
      className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col justify-center items-center text-center"
    >
      {children}
    </section>
  );
}
