import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, NavLink, useParams, useLocation, Link } from 'react-router-dom';
import { portfolioData } from './data';
import type { CaseStudy, Prd, TrackingPlan, Roadmap, Highlight, ResumeBullet } from './types';
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
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === Theme.Dark || storedTheme === Theme.Light) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.Dark : Theme.Light;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(Theme.Light, Theme.Dark);
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === Theme.Light ? Theme.Dark : Theme.Light));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// --- SEO & METADATA HOOK ---
const usePageMetadata = (title?: string, description?: string, jsonLd?: Record<string, any>) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (description) {
      if(descriptionMeta) {
        descriptionMeta.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
    
    let scriptTag = document.getElementById('json-ld') as (HTMLScriptElement | null);
    if (jsonLd) {
        if(!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.id = 'json-ld';
            scriptTag.type = 'application/ld+json';
            document.head.appendChild(scriptTag);
        }
        scriptTag.innerHTML = JSON.stringify(jsonLd);
    } else if (scriptTag) {
        scriptTag.innerHTML = '';
    }

  }, [title, description, jsonLd]);
};

// --- ROUTING HELPERS ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    analytics.trackEvent('page_view', { path: pathname });
  }, [pathname]);
  return null;
};

// --- DYNAMIC ICON COMPONENT ---
const DynamicIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = (Icons as any)[`Icon${name}`];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

// --- UI COMPONENTS ---
const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

const Section: React.FC<{ children: React.ReactNode; className?: string, id?:string }> = ({ children, className = '', id }) => (
  <section id={id} className={`py-16 md:py-24 ${className}`}>
    {children}
  </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`text-center mb-12 animate-fade-in-up ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">{children}</h2>
      <div className="mt-4 h-1 w-24 bg-brand-primary mx-auto rounded"></div>
    </div>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block bg-brand-primary/10 text-brand-primary dark:text-indigo-300 rounded-full px-3 py-1 text-sm font-medium transition-transform hover:scale-105">
        {children}
    </span>
);

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <Icons.IconMoon className="w-5 h-5" /> : <Icons.IconSun className="w-5 h-5" />}
        </button>
    );
};

// --- LAYOUT COMPONENTS ---
const Navbar: React.FC = () => {
    const navLinkClass = "text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors font-medium";
    const activeLinkClass = "text-brand-primary dark:text-brand-secondary";
  
    return (
      <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-light-background/80 dark:bg-dark-background/80 border-b border-light-border dark:border-dark-border">
        <Container className="flex items-center justify-between h-16">
          <NavLink to="/" className="text-xl font-bold text-light-text dark:text-dark-text tracking-tight">
            {portfolioData.site.owner}
          </NavLink>
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/case-studies" className={({isActive}) => `${navLinkClass} ${isActive ? activeLinkClass : ''}`}>Case Studies</NavLink>
            <NavLink to="/artifacts" className={({isActive}) => `${navLinkClass} ${isActive ? activeLinkClass : ''}`}>Artifacts</NavLink>
            <NavLink to="/about" className={({isActive}) => `${navLinkClass} ${isActive ? activeLinkClass : ''}`}>About</NavLink>
            <NavLink to="/contact" className={({isActive}) => `${navLinkClass} ${isActive ? activeLinkClass : ''}`}>Contact</NavLink>
          </nav>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </Container>
      </header>
    );
};

const Footer: React.FC = () => {
  const { site, contact } = portfolioData;
  return (
    <footer className="bg-slate-100 dark:bg-slate-800/50 border-t border-light-border dark:border-dark-border">
        <Container className="py-8 text-center text-slate-500 dark:text-slate-400">
            <div className="flex justify-center space-x-6 mb-4">
                <a href={contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary dark:hover:text-brand-secondary"><Icons.IconGitHub /></a>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary dark:hover:text-brand-secondary"><Icons.IconLinkedin /></a>
                 <a href={`mailto:${contact.email}`} className="hover:text-brand-primary dark:hover:text-brand-secondary text-sm flex items-center">{contact.email}</a>
            </div>
            <p>&copy; {new Date().getFullYear()} {site.owner}. All rights reserved.</p>
            <p>{contact.location}</p>
        </Container>
    </footer>
  );
};

const ContactCTA: React.FC = () => {
    const { contact } = portfolioData;
    return (
        <div className="bg-slate-100 dark:bg-slate-800/50 border-t border-light-border dark:border-dark-border py-8">
            <Container className="text-center animate-fade-in-up">
                <h3 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">Interested in working together?</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Let's connect. I'm always open to discussing new opportunities.</p>
                <a href={contact.hireLink} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-primary hover:bg-brand-secondary transition-all duration-300 transform hover:scale-105">
                    Hire Aadit — Book a 15-min intro
                </a>
            </Container>
        </div>
    );
};

// --- GRAPHIC COMPONENTS ---
const AiCodeReviewerGraphic: React.FC = () => (
    <svg viewBox="0 0 400 150" className="w-full h-auto rounded-lg border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-800/50 p-4">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-current text-slate-400 dark:text-slate-500" />
        </marker>
      </defs>
      <path d="M 50 75 H 150" strokeDasharray="5,5" className="stroke-current text-slate-400 dark:text-slate-500" strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M 250 75 H 350" strokeDasharray="5,5" className="stroke-current text-slate-400 dark:text-slate-500" strokeWidth="2" markerEnd="url(#arrow)" />
      
      <g transform="translate(20, 50)">
        <rect width="60" height="50" rx="5" className="fill-current text-slate-200 dark:text-slate-700" />
        <text x="30" y="30" textAnchor="middle" className="font-sans text-xs fill-current text-light-text dark:text-dark-text">Code</text>
      </g>
      
      <g transform="translate(170, 45)">
        <rect width="60" height="60" rx="30" className="fill-current text-brand-primary/20 dark:text-brand-primary/30" />
        <text x="30" y="35" fontSize="24" textAnchor="middle">🤖</text>
        <text x="30" y="58" textAnchor="middle" className="font-sans text-[10px] font-bold fill-current text-brand-primary dark:text-brand-secondary">AI Review</text>
      </g>
      
      <g transform="translate(320, 50)">
        <rect width="60" height="50" rx="5" className="fill-current text-green-200 dark:text-green-800/50" />
        <text x="30" y="30" textAnchor="middle" className="font-sans text-xs fill-current text-green-800 dark:text-green-200">Merged</text>
      </g>
    </svg>
);

const JiraAssistantGraphic: React.FC = () => (
    <svg viewBox="0 0 400 150" className="w-full h-auto rounded-lg border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-800/50 p-4">
       <path d="M 100 75 C 150 25, 250 25, 300 75" strokeWidth="2" fill="none" markerEnd="url(#arrow)" className="stroke-current text-slate-400 dark:text-slate-500" strokeDasharray="5,5"/>
        <g transform="translate(40, 60)">
            <text x="30" y="0" fontSize="32">📄</text>
            <text x="30" y="30" textAnchor="middle" className="font-sans text-xs fill-current text-light-text dark:text-dark-text">Confluence</text>
        </g>
        <g transform="translate(180, 20)">
            <text x="20" y="0" fontSize="32">✨</text>
             <text x="20" y="30" textAnchor="middle" className="font-sans text-xs font-bold fill-current text-brand-primary dark:text-brand-secondary">AI Assistant</text>
        </g>
        <g transform="translate(300, 60)">
            <text x="30" y="0" fontSize="32">✅</text>
            <text x="30" y="30" textAnchor="middle" className="font-sans text-xs fill-current text-light-text dark:text-dark-text">Jira Story</text>
        </g>
    </svg>
);

const OpsDashboardGraphic: React.FC = () => (
     <svg viewBox="0 0 400 150" className="w-full h-auto rounded-lg border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-800/50 p-4">
        <rect x="10" y="10" width="380" height="130" rx="8" className="fill-current text-slate-200 dark:text-slate-700/80" />
        <rect x="25" y="25" width="160" height="90" rx="4" className="fill-current text-light-background dark:text-dark-background" />
        <path d="M 35 100 C 55 50, 75 110, 95 80 S 135 40, 155 90" strokeWidth="2" fill="none" className="stroke-current text-brand-primary" />
        <rect x="200" y="25" width="80" height="40" rx="4" className="fill-current text-light-background dark:text-dark-background" />
        <circle cx="240" cy="55" r="15" className="fill-current text-green-400" />
        <rect x="295" y="25" width="80" height="40" rx="4" className="fill-current text-light-background dark:text-dark-background" />
        <rect x="305" y="40" width="15" height="20" className="fill-current text-red-400" />
        <rect x="325" y="30" width="15" height="30" className="fill-current text-yellow-400" />
        <rect x="345" y="50" width="15" height="10" className="fill-current text-blue-400" />
        <rect x="200" y="80" width="175" height="35" rx="4" className="fill-current text-light-background dark:text-dark-background" />
        <text x="287.5" y="102" textAnchor="middle" className="font-sans text-xs fill-current text-light-text dark:text-dark-text">Live Metrics Dashboard</text>
    </svg>
);

const CaseStudyGraphic: React.FC<{caseId: string}> = ({ caseId }) => {
    switch (caseId) {
        case 'ai-code-reviewer': return <AiCodeReviewerGraphic />;
        case 'confluence-jira-assistant': return <JiraAssistantGraphic />;
        case 'realtime-ops-dashboard': return <OpsDashboardGraphic />;
        default: return <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500">No visual available</div>;
    }
};

const AnimatedMetricGraphic: React.FC<{ result?: string }> = ({ result }) => {
    const isReduction = result?.includes('reduction') || result?.includes('lower') || result?.includes('fewer');
    const isIncrease = result?.includes('increase') || result?.includes('higher') || result?.includes('faster') || result?.includes('uplift');
    const color = isReduction ? 'text-red-500' : 'text-green-500';
    const path = isReduction
      ? "M 10 70 Q 30 70 50 50 T 90 20"
      : "M 10 20 Q 30 20 50 40 T 90 70";

    if (!isReduction && !isIncrease) return null;

    return (
        <svg viewBox="0 0 100 90" className="w-full h-auto my-4">
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path d={path} strokeWidth="6" fill="none" strokeLinecap="round" className={`stroke-current ${color} opacity-30`} filter="url(#glow)" />
            <path d={path} strokeWidth="6" fill="none" strokeLinecap="round" className={`stroke-current ${color} path-animate`} />
            <style>{`
                .path-animate {
                    stroke-dasharray: 200;
                    stroke-dashoffset: 200;
                    animation: draw-path 1.5s ease-out forwards;
                    animation-delay: 0.5s;
                }
                @keyframes draw-path {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </svg>
    );
};

const ActionButtons: React.FC<{className?: string}> = ({ className }) => {
    const { contact } = portfolioData;
    const buttons = [
        { href: contact.hireLink, text: 'Book 15-min Intro', primary: true, external: false },
        { href: `mailto:${contact.email}`, text: 'Email Aadit', primary: false, external: false },
        { href: contact.linkedin, text: 'View LinkedIn', primary: false, external: true },
        { href: contact.resume, text: 'Download Resume (PDF)', primary: false, external: false }
    ];

    const baseClasses = "inline-flex items-center justify-center px-5 py-3 border text-base font-medium rounded-lg transition-all duration-300 transform hover:scale-105";
    const primaryClasses = "border-transparent text-white bg-brand-primary hover:bg-brand-secondary";
    const secondaryClasses = "border-light-border dark:border-dark-border text-light-text dark:text-dark-text bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600";

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
            {buttons.map(btn => (
                <a 
                    key={btn.text} 
                    href={btn.href} 
                    target={btn.external ? '_blank' : '_self'} 
                    rel={btn.external ? 'noopener noreferrer' : ''}
                    className={`${baseClasses} ${btn.primary ? primaryClasses : secondaryClasses}`}
                >
                    {btn.text}
                    {btn.external && <Icons.IconExternalLink className="w-4 h-4 ml-2" />}
                </a>
            ))}
        </div>
    );
};


// --- PAGE SPECIFIC COMPONENTS ---

const HighlightCard: React.FC<{ highlight: Highlight }> = ({ highlight }) => (
    <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl border border-light-border dark:border-dark-border shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 text-center">
        <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center mx-auto mb-4">
          <DynamicIcon name={highlight.icon} className="w-6 h-6" />
        </div>
        <p className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">{highlight.value}</p>
        <p className="text-slate-600 dark:text-slate-400 mt-1">{highlight.label}</p>
    </div>
);

const CaseStudyCard: React.FC<{ caseStudy: CaseStudy }> = ({ caseStudy }) => (
    <Link 
        to={`/case-studies/${caseStudy.id}`}
        className="block bg-light-card dark:bg-dark-card p-8 rounded-2xl border border-light-border dark:border-dark-border shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform group"
        onClick={() => analytics.trackEvent('case_opened', { caseId: caseStudy.id, source: 'card' })}
    >
        <div className="flex flex-wrap gap-2 mb-4">
            {caseStudy.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
        </div>
        <h3 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2 group-hover:text-brand-primary dark:group-hover:text-brand-secondary">{caseStudy.title}</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">{caseStudy.summary}</p>
        <div className="border-t border-light-border dark:border-dark-border pt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Primary Metric</p>
            <p className="font-medium text-light-text dark:text-dark-text">{caseStudy.metrics.primary}</p>
            {caseStudy.metrics.result && <p className="text-brand-primary dark:text-brand-secondary font-bold">{caseStudy.metrics.result}</p>}
        </div>
        <div className="mt-6 flex items-center text-brand-primary dark:text-brand-secondary font-semibold">
            View Case Study <Icons.IconArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
        </div>
    </Link>
);

const PrintableArtifact: React.FC<{ title: string, children: React.ReactNode }> = ({title, children}) => {
    return (
        <div className="p-8 print:p-2">
            <h1 className="text-3xl font-bold mb-2">{portfolioData.site.owner}</h1>
            <h2 className="text-2xl text-slate-700 mb-8">{title}</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {children}
            </div>
        </div>
    );
};

const PrintablePRD: React.FC<{ caseStudy: CaseStudy }> = ({caseStudy}) => {
  const { prd } = caseStudy.artifacts;
  return (
    <PrintableArtifact title={`PRD: ${caseStudy.title}`}>
        <h3>1. Context & Problem</h3>
        <p>{prd.context}</p>
        <h3>2. Goals & Non-Goals</h3>
        <ul>
            <li><strong>Primary Metric:</strong> {prd.goals.primaryMetric}</li>
            {prd.goals.items.map((g, i) => <li key={i}>{g}</li>)}
        </ul>
        <p><strong>Non-Goals for v1:</strong> {prd.nonGoals.join(', ')}.</p>
        <h3>3. Users & Insights</h3>
        {prd.users.map((u, i) => (
            <div key={i}>
                <h4>{u.persona}</h4>
                <ul>{u.insights.map((insight, j) => <li key={j}>{insight}</li>)}</ul>
            </div>
        ))}
        <h3>4. Solution Overview</h3>
        <p>{prd.solutionOverview}</p>
        <h3>5. Scope (MVP)</h3>
        <ul>{prd.scope.map((s, i) => <li key={i}>{s}</li>)}</ul>
        <h3>6. Metrics & Instrumentation</h3>
        <p>{prd.metrics.kpiTree}</p>
        <ul>{prd.metrics.events.map((e, i) => <li key={i}><strong>{e.name}</strong>: {e.properties.join(', ')}</li>)}</ul>
        <h3>7. Risks & Tradeoffs</h3>
        <ul>{prd.risks.map((r, i) => <li key={i}>{r}</li>)}</ul>
        <h3>8. Launch Plan (Roadmap)</h3>
        <h4>Now</h4><ul>{prd.launchPlan.now.map((item, i) => <li key={i}>{item}</li>)}</ul>
        <h4>Next</h4><ul>{prd.launchPlan.next.map((item, i) => <li key={i}>{item}</li>)}</ul>
        <h4>Later</h4><ul>{prd.launchPlan.later.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </PrintableArtifact>
  );
};

const PrintableTrackingPlan: React.FC<{ caseStudy: CaseStudy }> = ({caseStudy}) => {
    const { trackingPlan } = caseStudy.artifacts;
    return (
        <PrintableArtifact title={`Tracking Plan: ${caseStudy.title}`}>
            <h3>Primary Metric</h3>
            <p>{trackingPlan.primaryMetric}</p>
            <h3>Events</h3>
            {trackingPlan.events.map((e, i) => (
                <div key={i} style={{marginBottom: '1rem'}}>
                    <strong>{e.name}</strong>
                    <p style={{margin: '0 0 0.25rem 0'}}>{e.description}</p>
                    <p style={{margin:0}}>Properties: <code>{e.properties.join(', ')}</code></p>
                </div>
            ))}
            <h3>Dashboards</h3>
            <ul>
                {trackingPlan.dashboards.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
        </PrintableArtifact>
    );
};


// --- PAGES ---
const HomePage: React.FC = () => {
    const { site, highlights, cases } = portfolioData;
    usePageMetadata(site.title, site.tagline);
    
    const flagshipCase = cases.find(c => c.id === 'ai-code-reviewer');

    return (
        <>
            <Section className="text-center pt-20 md:pt-32">
                <Container>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-light-text dark:text-dark-text tracking-tighter mb-4 animate-fade-in-up"
                        style={{'--animation-delay': '100ms'} as React.CSSProperties}>
                        {site.owner}
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 animate-fade-in-up"
                       style={{'--animation-delay': '200ms'} as React.CSSProperties}>
                        {site.tagline}
                    </p>
                    {flagshipCase && (
                        <Link 
                            to={`/case-studies/${flagshipCase.id}`} 
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-brand-primary hover:bg-brand-secondary transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
                            style={{'--animation-delay': '300ms'} as React.CSSProperties}
                        >
                            View Flagship Case Study
                        </Link>
                    )}
                </Container>
            </Section>
            
            <Section id="highlights" className="bg-slate-100 dark:bg-slate-800/50">
                <Container>
                    <SectionTitle>Key Outcomes</SectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {highlights.map((highlight, i) => (
                          <div className="animate-fade-in-up" style={{'--animation-delay': `${100 * i}ms`} as React.CSSProperties} key={highlight.label}>
                            <HighlightCard highlight={highlight} />
                          </div>
                        ))}
                    </div>
                </Container>
            </Section>

            <Section id="case-studies">
                <Container>
                    <SectionTitle>Featured Case Studies</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cases.slice(0, 3).map((caseStudy, i) => (
                          <div className="animate-fade-in-up" style={{'--animation-delay': `${150 * i}ms`} as React.CSSProperties} key={caseStudy.id}>
                            <CaseStudyCard caseStudy={caseStudy} />
                          </div>
                        ))}
                    </div>
                </Container>
            </Section>
        </>
    );
};

const CaseStudiesIndexPage: React.FC = () => {
    usePageMetadata(`Case Studies | ${portfolioData.site.owner}`, 'A collection of product management case studies.');
    return (
        <Section>
            <Container>
                <SectionTitle>Case Studies</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {portfolioData.cases.map((caseStudy, i) => (
                       <div className="animate-fade-in-up" style={{'--animation-delay': `${100 * i}ms`} as React.CSSProperties} key={caseStudy.id}>
                        <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
                       </div>
                    ))}
                </div>
            </Container>
        </Section>
    );
};

const CaseStudyDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const caseStudy = portfolioData.cases.find(c => c.id === slug);
    const [printingArtifact, setPrintingArtifact] = useState<'prd' | 'tp' | null>(null);

    const handlePrint = useCallback((artifact: 'prd' | 'tp') => {
        analytics.trackEvent('artifact_downloaded', { caseId: slug, artifactType: artifact });
        setPrintingArtifact(artifact);
    }, [slug]);

    useEffect(() => {
        if (printingArtifact) {
            const handleAfterPrint = () => {
                setPrintingArtifact(null);
                window.removeEventListener('afterprint', handleAfterPrint);
            };
            window.addEventListener('afterprint', handleAfterPrint);
            setTimeout(() => window.print(), 100);
        }
    }, [printingArtifact]);

    usePageMetadata(caseStudy?.title, caseStudy?.summary, caseStudy ? {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": caseStudy.title,
      "description": caseStudy.summary,
      "author": {
        "@type": "Person",
        "name": portfolioData.site.owner
      },
      "keywords": caseStudy.tags.join(', ')
    } : undefined);

    if (!caseStudy) {
        return <Section><Container>Case study not found.</Container></Section>;
    }

    const sectionContent = [
        { title: 'Problem', content: caseStudy.sections.problem },
        { title: 'Users & Insights', content: caseStudy.sections.users },
        { title: 'Hypothesis', content: caseStudy.sections.hypothesis },
        { title: 'Scope (MVP)', content: caseStudy.sections.scope },
        { title: 'Solution Overview', content: caseStudy.sections.solution },
        { title: 'Results', content: caseStudy.sections.results },
        { title: 'Decisions & Tradeoffs', content: caseStudy.sections.tradeoffs },
        { title: 'Risks', content: caseStudy.sections.risks },
        { title: "What's Next", content: caseStudy.sections.next },
    ];
    
    const sectionIcons: { [key: string]: React.ComponentType<any> } = {
        'Problem': Icons.IconBug,
        'Users & Insights': Icons.IconUsers,
        'Hypothesis': Icons.IconLightbulb,
        'Scope (MVP)': Icons.IconTarget,
        'Solution Overview': Icons.IconCode,
        'Results': Icons.IconTrendingUp,
        'Decisions & Tradeoffs': Icons.IconRoadmap,
        'Risks': Icons.IconShieldCheck,
        "What's Next": Icons.IconFlag
    };

    return (
        <>
            <style>{`
                @media print {
                  body * { visibility: hidden; }
                  .printable-area, .printable-area * { visibility: visible; }
                  .printable-area { position: absolute; left: 0; top: 0; width: 100%; }
                }
            `}</style>
            
            <div className={printingArtifact ? 'hidden' : ''}>
                <Section className="pt-16 pb-8 md:pt-24 md:pb-12 bg-slate-100 dark:bg-slate-800/50">
                    <Container>
                        <div className="flex flex-wrap gap-2 mb-4 animate-fade-in-up">
                            {caseStudy.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-light-text dark:text-dark-text tracking-tight animate-fade-in-up" style={{'--animation-delay': '100ms'} as React.CSSProperties}>{caseStudy.title}</h1>
                        <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl animate-fade-in-up" style={{'--animation-delay': '200ms'} as React.CSSProperties}>{caseStudy.summary}</p>
                    </Container>
                </Section>
                <Section className="py-12">
                    <Container>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 prose prose-lg dark:prose-invert max-w-none">
                                <div className="mb-12 animate-fade-in-up" style={{'--animation-delay': `100ms`} as React.CSSProperties}>
                                    <CaseStudyGraphic caseId={caseStudy.id} />
                                </div>

                                {sectionContent.map((section, i) => {
                                    const Icon = sectionIcons[section.title];
                                    return(
                                        <div key={section.title} className="animate-fade-in-up" style={{'--animation-delay': `${i * 100}ms`} as React.CSSProperties}>
                                            <h2 className='flex items-center'>
                                                {Icon && <Icon className="w-6 h-6 mr-3 text-brand-primary dark:text-brand-secondary" />}
                                                {section.title}
                                            </h2>
                                            <p>{section.content}</p>
                                        </div>
                                    )
                                })}
                            </div>
                            <aside className="lg:sticky top-24 self-start animate-fade-in" style={{'--animation-delay': '300ms'} as React.CSSProperties}>
                                <div className="bg-light-card dark:bg-dark-card p-6 rounded-2xl border border-light-border dark:border-dark-border shadow-sm">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 text-center">Key Outcome</h3>
                                    <AnimatedMetricGraphic result={caseStudy.metrics.result} />
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-center">{caseStudy.metrics.primary}</p>
                                    {caseStudy.metrics.result && <p className="text-2xl font-bold text-brand-primary dark:text-brand-secondary text-center">{caseStudy.metrics.result}</p>}
                                    
                                    <div className="border-t border-light-border dark:border-dark-border my-6"></div>

                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Artifacts</h3>
                                    <div className="space-y-3">
                                        <button onClick={() => handlePrint('prd')} className="w-full flex items-center justify-center px-4 py-2 border border-light-border dark:border-dark-border text-base font-medium rounded-lg text-light-text dark:text-dark-text bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                                            <Icons.IconDownload className="w-5 h-5 mr-2" /> Download PRD (PDF)
                                        </button>
                                        <button onClick={() => handlePrint('tp')} className="w-full flex items-center justify-center px-4 py-2 border border-light-border dark:border-dark-border text-base font-medium rounded-lg text-light-text dark:text-dark-text bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                                            <Icons.IconDownload className="w-5 h-5 mr-2" /> Download Tracking Plan (PDF)
                                        </button>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </Container>
                </Section>
            </div>
            
            {printingArtifact && (
                <div className="printable-area bg-white text-black">
                  {printingArtifact === 'prd' && <PrintablePRD caseStudy={caseStudy} />}
                  {printingArtifact === 'tp' && <PrintableTrackingPlan caseStudy={caseStudy} />}
                </div>
            )}
        </>
    );
};

const ArtifactsPage: React.FC = () => {
    usePageMetadata(`Artifacts | ${portfolioData.site.owner}`, 'Downloadable Product Requirement Documents (PRDs), Tracking Plans, and Roadmaps.');
    const { cases } = portfolioData;

    return (
        <Section>
            <Container>
                <SectionTitle>Artifacts Library</SectionTitle>
                <div className="space-y-12">
                    {cases.map((caseStudy, i) => (
                        <div key={caseStudy.id} className="bg-light-card dark:bg-dark-card p-8 rounded-2xl border border-light-border dark:border-dark-border shadow-sm animate-fade-in-up" style={{'--animation-delay': `${i * 150}ms`} as React.CSSProperties}>
                            <h3 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">{caseStudy.title}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                               <Link to={`/case-studies/${caseStudy.id}`} className="flex items-center justify-center px-4 py-3 border border-light-border dark:border-dark-border text-base font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all transform hover:scale-105"><Icons.IconDownload className="w-5 h-5 mr-2"/>PRD</Link>
                               <Link to={`/case-studies/${caseStudy.id}`} className="flex items-center justify-center px-4 py-3 border border-light-border dark:border-dark-border text-base font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all transform hover:scale-105"><Icons.IconDownload className="w-5 h-5 mr-2"/>Tracking Plan</Link>
                               <div className="flex items-center justify-center px-4 py-3 border border-dashed border-light-border dark:border-dark-border text-base font-medium rounded-lg text-slate-400 dark:text-slate-500">Roadmap (in case study)</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>
    );
};

const skillIcons: { [key: string]: React.ComponentType<any> } = {
    "Strategy": Icons.IconLightbulb,
    "Research": Icons.IconSearch,
    "Roadmapping": Icons.IconRoadmap,
    "Writing": Icons.IconPencil,
    "Experimentation": Icons.IconFlask,
    "Tracking": Icons.IconClipboardList,
    "Alignment": Icons.IconUsers,
    "AI/LLM": Icons.IconCode,
    "Architecture": Icons.IconCode,
    "Data": Icons.IconDatabase,
};

const getSkillIcon = (skill: string) => {
    const key = Object.keys(skillIcons).find(k => skill.toLowerCase().includes(k.toLowerCase()));
    return key ? skillIcons[key] : Icons.IconCheckCircle;
};

const AboutPage: React.FC = () => {
  const { site, contact, skills, resume } = portfolioData;
  usePageMetadata(`About ${site.owner}`, site.positioning, {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": site.owner,
      "jobTitle": "Product Manager",
      "worksFor": {
        "@type": "Organization",
        "name": "Software Engineering"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Toronto",
        "addressCountry": "CA"
      },
      "email": contact.email,
      "url": contact.portfolio,
      "sameAs": [
        contact.linkedin,
        contact.github
      ],
      "knowsAbout": skills.join(', '),
  });

  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="md:col-span-2 animate-fade-in-up">
            <h1 className="text-4xl font-bold text-light-text dark:text-dark-text mb-2">Aadit Mehrotra</h1>
            <p className="text-xl text-brand-primary dark:text-brand-secondary font-medium mb-6">Product Manager (ex-Software Engineer)</p>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{contact.location}</p>

            <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 mb-8">
                <p>{site.positioning}</p>
            </div>
            <ActionButtons />
          </div>
          <div className="md:col-span-1 animate-fade-in" style={{'--animation-delay': '200ms'} as React.CSSProperties}>
            <img src={`https://i.pravatar.cc/400?u=${site.owner.replace(/\s/g, '')}`} alt={site.owner} className="rounded-2xl w-full shadow-lg" />
          </div>
        </div>
        
        <div className="mt-20 md:mt-24">
            <SectionTitle>Core Skills</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {skills.map((skill, i) => {
                  const Icon = getSkillIcon(skill);
                  return (
                      <div key={skill} className="bg-light-card dark:bg-dark-card p-4 rounded-xl border border-light-border dark:border-dark-border text-center flex flex-col items-center justify-center animate-fade-in-up transition-transform hover:scale-105" style={{'--animation-delay': `${50 * i}ms`} as React.CSSProperties}>
                          <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center mb-3">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium text-light-text dark:text-dark-text">{skill}</span>
                      </div>
                  )
              })}
            </div>
        </div>

        <div className="mt-20 md:mt-24">
            <SectionTitle>Experience Highlights</SectionTitle>
            <div className="space-y-4 max-w-4xl mx-auto">
                {resume.map((bullet, i) => (
                    <div key={bullet.id} className="bg-light-card dark:bg-dark-card p-4 rounded-lg border border-light-border dark:border-dark-border flex items-start animate-fade-in-up" style={{'--animation-delay': `${i * 100}ms`} as React.CSSProperties}>
                        <Icons.IconCheckCircle className="w-5 h-5 text-brand-primary dark:text-brand-secondary flex-shrink-0 mt-1 mr-4" />
                        <p className="text-slate-700 dark:text-slate-300">
                            {bullet.content}
                            {bullet.caseStudyId && (
                                <Link to={`/case-studies/${bullet.caseStudyId}`} className="text-sm text-brand-primary dark:text-brand-secondary font-semibold ml-2 whitespace-nowrap">
                                    [Read More]
                                </Link>
                            )}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </Container>
    </Section>
  );
};

const ContactPage: React.FC = () => {
    const { site, contact } = portfolioData;
    usePageMetadata(`Contact ${site.owner}`, `Get in touch with ${site.owner}.`, {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "mainEntity": {
            "@type": "Person",
            "name": site.owner,
            "email": contact.email,
            "url": contact.portfolio,
            "sameAs": [
                contact.linkedin,
                contact.github
            ]
        }
    });
    const [submitted, setSubmitted] = useState(false);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        analytics.trackEvent('contact_submitted', {
            roleInterest: formData.get('role'),
            companySize: formData.get('company-size'),
            referral: formData.get('referral'),
        });
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <Section className="text-center">
                <Container>
                    <div className="relative inline-block mb-4 animate-fade-in-up">
                        <div className="absolute -inset-2 bg-green-500/20 rounded-full animate-ping"></div>
                        <Icons.IconCheckCircle className="relative w-16 h-16 text-green-500 mx-auto"/>
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-light-text dark:text-dark-text animate-fade-in-up" style={{'--animation-delay': '100ms'} as React.CSSProperties}>Thank You!</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 animate-fade-in-up" style={{'--animation-delay': '200ms'} as React.CSSProperties}>Your message has been sent. I'll get back to you shortly.</p>
                </Container>
            </Section>
        );
    }

    return (
        <Section>
            <Container className="max-w-2xl">
                <SectionTitle>Contact Me</SectionTitle>
                <div className="text-center mb-12 animate-fade-in-up" style={{'--animation-delay': '100ms'} as React.CSSProperties}>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                        Feel free to reach out via the form below or directly at <a href={`mailto:${contact.email}`} className="text-brand-primary dark:text-brand-secondary font-medium">{contact.email}</a>.
                    </p>
                    <div className="max-w-md mx-auto">
                        <ActionButtons />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="text-left space-y-6 bg-light-card dark:bg-dark-card p-8 rounded-2xl border border-light-border dark:border-dark-border shadow-md animate-fade-in-up" style={{'--animation-delay': '200ms'} as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                            <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-light-border dark:border-dark-border shadow-sm focus:border-brand-primary focus:ring-brand-primary bg-slate-100/50 dark:bg-dark-background" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                            <input type="email" name="email" id="email" required className="mt-1 block w-full rounded-md border-light-border dark:border-dark-border shadow-sm focus:border-brand-primary focus:ring-brand-primary bg-slate-100/50 dark:bg-dark-background" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role Interest</label>
                            <select id="role" name="role" className="mt-1 block w-full rounded-md border-light-border dark:border-dark-border shadow-sm focus:border-brand-primary focus:ring-brand-primary bg-slate-100/50 dark:bg-dark-background">
                                <option>Product Manager</option>
                                <option>Technical PM</option>
                                <option>Senior PM</option>
                                <option>Other</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="company-size" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Company Size</label>
                            <select id="company-size" name="company-size" className="mt-1 block w-full rounded-md border-light-border dark:border-dark-border shadow-sm focus:border-brand-primary focus:ring-brand-primary bg-slate-100/50 dark:bg-dark-background">
                                <option>1-50</option>
                                <option>51-200</option>
                                <option>201-1000</option>
                                <option>1000+</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="referral" className="block text-sm font-medium text-slate-700 dark:text-slate-300">How did you hear about me?</label>
                        <input type="text" name="referral" id="referral" className="mt-1 block w-full rounded-md border-light-border dark:border-dark-border shadow-sm focus:border-brand-primary focus:ring-brand-primary bg-slate-100/50 dark:bg-dark-background" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                        <textarea id="message" name="message" rows={4} required className="mt-1 block w-full rounded-md border-light-border dark:border-dark-border shadow-sm focus:border-brand-primary focus:ring-brand-primary bg-slate-100/50 dark:bg-dark-background"></textarea>
                    </div>
                    <div>
                        <button type="submit" className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-primary hover:bg-brand-secondary transition-colors">Send Message</button>
                    </div>
                </form>
            </Container>
        </Section>
    );
};


// --- MAIN APP ---
const AppWrapper: React.FC = () => {
    const location = useLocation();
    return (
        <div className="flex flex-col min-h-screen text-light-text dark:text-dark-text">
            <Navbar />
            <main key={location.pathname} className="flex-grow animate-fade-in">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/case-studies" element={<CaseStudiesIndexPage />} />
                    <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
                    <Route path="/artifacts" element={<ArtifactsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<HomePage />} />
                </Routes>
            </main>
            <ContactCTA />
            <Footer />
        </div>
    );
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <ScrollToTop />
        <AppWrapper />
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;