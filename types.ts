export interface SiteData {
  owner: string;
  title: string;
  tagline: string;
  positioning: string;
}

export interface ContactData {
  email: string;
  portfolio: string;
  linkedin: string;
  github: string;
  location: string;
  hireLink: string;
  resume: string;
}

export interface Highlight {
  label: string;
  value: string;
  icon: string;
}

export interface CaseStudyMetric {
  primary: string;
  result?: string;
}

export interface CaseStudyArtifacts {
  prd: Prd;
  trackingPlan: TrackingPlan;
  roadmap: Roadmap;
}

export interface CaseStudy {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  metrics: CaseStudyMetric;
  sections: {
    problem: string;
    users: string;
    hypothesis: string;
    scope: string;
    solution: string;
    results: string;
    tradeoffs: string;
    risks: string;
    next: string;
  };
  artifacts: CaseStudyArtifacts;
}

export interface Prd {
  context: string;
  goals: {
    primaryMetric: string;
    items: string[];
  };
  nonGoals: string[];
  users: Array<{ persona: string; insights: string[] }>;
  solutionOverview: string;
  scope: string[];
  metrics: {
    kpiTree: string;
    events: Array<{ name: string; properties: string[] }>;
  };
  risks: string[];
  launchPlan: {
    now: string[];
    next: string[];
    later: string[];
  };
}

export interface TrackingPlan {
  primaryMetric: string;
  events: Array<{ name: string; properties: string[]; description: string }>;
  dashboards: string[];
}

export interface Roadmap {
  now: string[];
  next: string[];
  later: string[];
}

export interface ResumeBullet {
  id: string;
  content: string;
  caseStudyId?: string;
}

export interface PortfolioData {
  site: SiteData;
  contact: ContactData;
  highlights: Highlight[];
  cases: CaseStudy[];
  skills: string[];
  resume: ResumeBullet[];
}

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}