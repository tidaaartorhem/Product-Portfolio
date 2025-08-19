


import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, useParams, useLocation, Link } from 'react-router-dom';
import { portfolioData } from './data';
import type { CaseStudy, Highlight, ResumeBullet } from './types';
import { Theme } from './types';
import * as Icons from './components/Icons';

// --- ANALYTICS (DUMMY) ---
const analytics = {
  trackEvent: (eventName: string, props: Record<string, any>) => {
    console.log(`[Analytics] Event: ${eventName}`, props);
    // In a real app, this would integrate with a service like GA4 or Plausible.
  },
};

// --- THEME MANAGEMENT ---
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return Theme.Dark;
    }
    return Theme.Light;
  });

  useEffect(() => {
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === Theme.Light ? Theme.Dark : Theme.Light));
    analytics.trackEvent('theme_changed', { to_theme: theme === Theme.Light ? 'dark' : 'light' });
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// --- DATA HOOKS ---
const usePortfolioData = () => {
  return portfolioData;
};

const useCaseStudy = (caseId: string | undefined) => {
  const { cases } = usePortfolioData();
  const caseStudy = useMemo(() => cases.find(c => c.id === caseId), [cases, caseId]);
  return caseStudy;
};

// --- DYNAMIC ICON COMPONENT ---
type IconName = keyof typeof Icons;
const DynamicIcon: React.FC<{ name: IconName; className?: string }> = ({ name, ...props }) => {
  const IconComponent = Icons[name];
  return IconComponent ? <IconComponent {...props} /> : null;
};

// --- UI COMPONENTS ---
const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Icons.IconMoon className="w-5 h-5" /> : <Icons.IconSun className="w-5 h-5" />}
    </button>
  );
};

const Header: React.FC = () => {
  const { site, contact } = usePortfolioData();
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2" onClick={() => analytics.trackEvent('nav_home_click', {})}>
             <Icons.IconLogo className="w-8 h-8"/>
            <span className="font-bold text-slate-800 dark:text-slate-200">{site.owner}</span>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex gap-4">
              <a href={contact.resume} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-primary-light transition-colors" onClick={() => analytics.trackEvent('nav_resume_click', {})}>Resume</a>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-primary-light transition-colors" onClick={() => analytics.trackEvent('nav_linkedin_click', {})}>LinkedIn</a>
              <a href={contact.github} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-primary-light transition-colors" onClick={() => analytics.trackEvent('nav_github_click', {})}>GitHub</a>
            </nav>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden md:block mx-2"></div>
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  const { site, contact } = usePortfolioData();
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">{site.owner}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{site.positioning}</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Contact</h3>
            <ul className="mt-2 space-y-1">
              <li><a href={`mailto:${contact.email}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary-light">{contact.email}</a></li>
              <li className="text-sm text-slate-500 dark:text-slate-400">{contact.location}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Around the web</h3>
            <div className="flex gap-4 mt-2 justify-center md:justify-start">
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary-light"><Icons.IconLinkedin /></a>
              <a href={contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary-light"><Icons.IconGitHub /></a>
              <a href={contact.portfolio} target="_blank" rel="noopener noreferrer" aria-label="Portfolio" className="text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary-light"><Icons.IconExternalLink /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} {site.owner}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block bg-brand-primary/10 text-brand-primary dark:bg-brand-primary-light/10 dark:text-brand-primary-light text-xs font-medium px-2.5 py-0.5 rounded-full">
    {children}
  </span>
);

const CaseStudyCard: React.FC<{ caseStudy: CaseStudy }> = ({ caseStudy }) => (
  <Link 
    to={`/case/${caseStudy.id}`} 
    className="block p-6 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all"
    onClick={() => analytics.trackEvent('case_study_card_click', { case_id: caseStudy.id, case_title: caseStudy.title })}
  >
    <h3 className="font-bold text-slate-800 dark:text-slate-200">{caseStudy.title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{caseStudy.summary}</p>
    <div className="flex flex-wrap gap-2 mt-4">
      {caseStudy.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
    </div>
  </Link>
);

const HighlightCard: React.FC<{ highlight: Highlight }> = ({ highlight }) => (
  <div className="bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-lg flex items-center gap-4">
    <div className="flex-shrink-0 text-brand-primary dark:text-brand-primary-light">
      <DynamicIcon name={highlight.icon as IconName} className="w-8 h-8" />
    </div>
    <div>
      <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{highlight.value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{highlight.label}</p>
    </div>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <section className={`py-12 md:py-16 ${className}`}>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-8">{title}</h2>
      {children}
    </div>
  </section>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
      )}
    </>
  );
};

// --- PAGES & LAYOUTS ---
const HomePage: React.FC = () => {
  const { site, contact, highlights, cases, skills, resume, education } = usePortfolioData();

  return (
    <>
      <Section title="Introduction">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">{site.tagline}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">{site.positioning}</p>
          <div className="mt-8 flex gap-4">
            <a href={`mailto:${contact.email}`} className="px-5 py-3 font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors">Get in Touch</a>
            <a href={contact.resume} target="_blank" rel="noopener noreferrer" className="px-5 py-3 font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors">View Resume</a>
          </div>
        </div>
      </Section>
      
      <Section title="Key Highlights" className="bg-slate-50 dark:bg-slate-900/50">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {highlights.map(h => <HighlightCard key={h.label} highlight={h} />)}
        </div>
      </Section>

      <Section title="Case Studies">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map(cs => <CaseStudyCard key={cs.id} caseStudy={cs} />)}
        </div>
      </Section>
      
      <Section title="Skills & Resume" className="bg-slate-50 dark:bg-slate-900/50">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Core Competencies</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium px-3 py-1 rounded-md">{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Experience Highlights</h3>
            <ul className="space-y-4">
              {resume.map((bullet: ResumeBullet) => (
                <li key={bullet.id} className="flex gap-3">
                  <Icons.IconCheckCircle className="w-5 h-5 mt-0.5 text-brand-primary flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">
                    {bullet.content}
                    {bullet.caseStudyId && (
                      <Link to={`/case/${bullet.caseStudyId}`} className="text-brand-primary dark:text-brand-primary-light font-semibold ml-1 hover:underline">[Read more]</Link>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Education">
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-start">
                  <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{education.degree}</h3>
                      <p className="font-semibold text-brand-primary dark:text-brand-primary-light">{education.school}</p>
                  </div>
                  <div className="text-right text-sm text-slate-500 dark:text-slate-400">
                      <p>{education.period}</p>
                      <p>{education.location}</p>
                  </div>
              </div>
              <ul className="mt-4 list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                  {education.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                  ))}
              </ul>
          </div>
      </Section>
    </>
  );
};

const CaseStudyPage: React.FC = () => {
    const { caseId } = useParams<{ caseId: string }>();
    const caseStudy = useCaseStudy(caseId);

    useEffect(() => {
        if (caseStudy) {
            analytics.trackEvent('case_study_view', { case_id: caseStudy.id, case_title: caseStudy.title });
        }
    }, [caseStudy]);

    if (!caseStudy) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-2xl font-bold">Case Study Not Found</h1>
                <Link to="/" className="text-brand-primary mt-4 inline-block">← Back to Home</Link>
            </div>
        );
    }
    
    const { title, summary, tags, metrics, sections } = caseStudy;
    
    const CaseStudySection: React.FC<{title: string, content: string[] | string}> = ({ title, content }) => (
        <div className="mb-12">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 sticky top-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-2 border-b border-slate-200 dark:border-slate-800">{title}</h3>
            <div className="prose dark:prose-invert prose-slate max-w-none text-slate-600 dark:text-slate-300">
                {Array.isArray(content) ? content.map((p, i) => <p key={i}><SimpleMarkdown text={p} /></p>) : <p><SimpleMarkdown text={content} /></p>}
            </div>
        </div>
    );

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
              <Link to="/" className="text-brand-primary dark:text-brand-primary-light mb-8 inline-flex items-center gap-2 hover:underline">
                  <Icons.IconArrowRight className="w-4 h-4 transform rotate-180" />
                  Back to all case studies
              </Link>

              <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">{summary}</p>
              
              {metrics.result && (
                  <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                      <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Primary Metric: <span className="capitalize">{metrics.primary}</span></p>
                      <p className="text-3xl font-bold text-brand-primary dark:text-brand-primary-light mt-1">{metrics.result}</p>
                  </div>
              )}
              
              <article className="mt-12">
                  <CaseStudySection title="Introduction" content={sections.introduction} />
                  <CaseStudySection title="The Problem" content={sections.theProblem} />
                  <CaseStudySection title="User Insights" content={sections.userInsights} />
                  <CaseStudySection title="Goals & Metrics" content={sections.goalsAndMetrics} />
                  <CaseStudySection title="Hypothesis & Assumptions" content={sections.hypothesisAndAssumptions} />
                  <CaseStudySection title="Solution Exploration" content={sections.solutionExploration} />
                  <CaseStudySection title="Solution Walkthrough" content={sections.solutionWalkthrough} />
                  <CaseStudySection title="MVP & Prioritization" content={sections.mvpAndPrioritization} />
                  <CaseStudySection title="Results & Impact" content={sections.resultsAndImpact} />
                  <CaseStudySection title="Risks & Mitigation" content={sections.risksAndMitigation} />
                  <CaseStudySection title="Learnings & Next Steps" content={sections.learningsAndNextSteps} />
              </article>
          </div>
      </div>
    );
};


const App = () => {
  return (
    <HashRouter>
      <ThemeProvider>
        <div className="bg-white dark:bg-slate-900 min-h-screen">
          <ScrollToTop />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/case/:caseId" element={<CaseStudyPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;