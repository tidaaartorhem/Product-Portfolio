import type { PortfolioData, CaseStudy, CaseStudyArtifacts } from './types';

// Helper to generate placeholder data for new case studies
const createPlaceholderArtifacts = (title: string): CaseStudyArtifacts => ({
  prd: {
    context: `This document details the problem, context, and requirements for the ${title} project, outlining the path from discovery to launch.`,
    goals: {
      primaryMetric: `Define and track the primary success metric for ${title}.`,
      items: ["Placeholder Goal: Achieve target for primary metric.", "Placeholder Goal: Ensure a successful MVP launch."],
    },
    nonGoals: ["Replacing entire legacy systems at once.", "Boiling the ocean; features outside of core MVP scope."],
    users: [{ persona: "Primary User Persona", insights: ["'This process is currently too slow and inefficient.'"] }],
    solutionOverview: `A high-level overview of the proposed technical and product solution for the ${title} initiative.`,
    scope: ["User Story: As a [persona], I can [action] to achieve [value].", "Technical Requirement: System must handle X TPS with Y latency."],
    metrics: {
      kpiTree: "Defines the hierarchy of metrics from north-star down to driver metrics.",
      events: [{ name: "user_action_placeholder", properties: ["userId", "timestamp", "source"] }],
    },
    risks: ["Technical Risk: Integration complexity with legacy systems.", "Adoption Risk: Users may resist changes to their workflow."],
    launchPlan: {
      now: ["Finalize MVP scope and technical design.", "Begin pilot with a small user group."],
      next: ["Gather feedback from pilot and iterate.", "Expand rollout to a larger audience."],
      later: ["Achieve general availability.", "Plan for v2 features based on learnings."],
    },
  },
  trackingPlan: {
    primaryMetric: `Primary metric to be tracked for ${title}.`,
    events: [{ name: "placeholder_event", properties: ["userId"], description: "Fires when a user performs a key action." }],
    dashboards: ["A real-time dashboard to monitor the primary metric and user engagement."],
  },
  roadmap: {
    now: ["Launch MVP", "Onboard initial set of users"],
    next: ["Iterate based on feedback", "Expand feature set"],
    later: ["Scale the solution", "Explore new use cases"],
  },
});

const createPlaceholderSections = (summary: string) => ({
    problem: `The core problem this project aimed to solve was related to: ${summary}`,
    users: "The primary users were internal teams and external customers who faced challenges with the existing system.",
    hypothesis: "Our central hypothesis was that by implementing this solution, we could significantly improve the primary metric.",
    scope: "The MVP was tightly scoped to address the most critical user pain points and validate our core hypothesis quickly.",
    solution: `We designed and implemented a solution that involved a combination of new services, UI components, and backend optimizations.`,
    results: "The project was successful in moving the primary metric and received positive feedback from initial user groups.",
    tradeoffs: "Key tradeoffs were made between speed of delivery, feature completeness, and long-term technical debt.",
    risks: "We identified and actively mitigated risks related to technical implementation, user adoption, and project dependencies.",
    next: "Future iterations will focus on scaling the solution, adding secondary features, and optimizing performance further.",
});

const newCases: CaseStudy[] = [
    {
      id: "design-system", 
      title: "Design System & Component Library", 
      summary: "Standardized UI components and docs to speed delivery and reduce rework.", 
      tags: ["Design System", "Front-end", "UX"], 
      metrics: {primary: "Time to Implement Common UI", result: "Reduced dev effort"},
      sections: createPlaceholderSections("Inconsistent UI and slow development cycles."),
      artifacts: createPlaceholderArtifacts("Design System & Component Library"),
    },
    {
      id: "legacy-integration", 
      title: "Legacy Systems Integration Layer", 
      summary: "Camel-based middleware to decouple modern apps from mainframe systems.", 
      tags: ["Platform", "Integration", "Backend"], 
      metrics: {primary: "Integration Success Rate"},
      sections: createPlaceholderSections("Difficulty interfacing with legacy mainframe systems."),
      artifacts: createPlaceholderArtifacts("Legacy Systems Integration Layer"),
    },
    {
      id: "api-performance", 
      title: "API Performance & Scalability", 
      summary: "Redis caching and SQL tuning to improve p95 latency and throughput.", 
      tags: ["Backend", "Performance", "Scalability"], 
      metrics: {primary: "p95 Latency"},
      sections: createPlaceholderSections("High latency and scalability issues in critical APIs."),
      artifacts: createPlaceholderArtifacts("API Performance & Scalability"),
    },
    {
      id: "schema-forms", 
      title: "Schema-Driven Forms", 
      summary: "Reduce invalid submissions with schema-based validation and guidance.", 
      tags: ["UX", "Platform", "Front-end"], 
      metrics: {primary: "Invalid Submission Rate", result: "~10% reduction"},
      sections: createPlaceholderSections("High rate of validation errors in complex user-facing forms."),
      artifacts: createPlaceholderArtifacts("Schema-Driven Forms"),
    },
    {
      id: "deploy-velocity", 
      title: "Deployment Velocity (Kubernetes)", 
      summary: "Standardized orchestration to speed safe deploys.", 
      tags: ["Platform", "DevOps", "Kubernetes"], 
      metrics: {primary: "p95 Deploy Time", result: "~10% faster"},
      sections: createPlaceholderSections("Slow and unreliable deployment processes."),
      artifacts: createPlaceholderArtifacts("Deployment Velocity"),
    },
    {
      id: "data-access-optimization", 
      title: "Data Access Optimization (Relational)", 
      summary: "Normalized schema and indexing to accelerate read paths.", 
      tags: ["Data", "Backend", "SQL"], 
      metrics: {primary: "Query p95", result: "~25% faster"},
      sections: createPlaceholderSections("Slow database queries affecting application performance."),
      artifacts: createPlaceholderArtifacts("Data Access Optimization"),
    },
    {
      id: "digital-notifications", 
      title: "Digital Notifications Platform", 
      summary: "Web-based notifications to reduce costs and improve timeliness.", 
      tags: ["GovTech", "Engagement", "Platform"], 
      metrics: {primary: "Cost per Notification", result: "~30% lower"},
      sections: createPlaceholderSections("High costs and delays associated with physical mail for citizen communications."),
      artifacts: createPlaceholderArtifacts("Digital Notifications Platform"),
    },
    {
      id: "nosql-search", 
      title: "NoSQL Aggregation & Search Tuning", 
      summary: "Optimized aggregations and caching to reduce perceived search lag.", 
      tags: ["Backend", "Search", "NoSQL"], 
      metrics: {primary: "Search p95", result: "~10% lower lag"},
      sections: createPlaceholderSections("Slow search and aggregation queries in a high-traffic NoSQL database."),
      artifacts: createPlaceholderArtifacts("NoSQL Aggregation & Search Tuning"),
    },
    {
      id: "risk-analytics", 
      title: "Risk Analytics Microservice", 
      summary: "Python microservice for VaR/Sharpe with async jobs and strong test coverage.", 
      tags: ["Fintech", "Data", "Python"], 
      metrics: {primary: "Processing Time", result: "~12% faster; 90% test coverage"},
      sections: createPlaceholderSections("Manual and slow risk calculation processes in a fintech environment."),
      artifacts: createPlaceholderArtifacts("Risk Analytics Microservice"),
    },
    {
      id: "vehicle-safety-engagement", 
      title: "Vehicle Safety Engagement (Mobile)", 
      summary: "Push notifications for timely booking/safety updates.", 
      tags: ["Mobile", "Engagement", "Notifications"], 
      metrics: {primary: "Notification CTR", result: "~25% uplift"},
      sections: createPlaceholderSections("Users missing critical updates about vehicle safety and bookings."),
      artifacts: createPlaceholderArtifacts("Vehicle Safety Engagement"),
    },
    {
      id: "foodprint", 
      title: "FoodPrint — AI Sustainability App", 
      summary: "AI-powered grocery swaps to reduce carbon impact.", 
      tags: ["AI", "Consumer", "Mobile"], 
      metrics: {primary: "Adoption & Swap Rate"},
      sections: createPlaceholderSections("Lack of consumer awareness and tools for making sustainable grocery choices."),
      artifacts: createPlaceholderArtifacts("FoodPrint AI App"),
    }
];

export const portfolioData: PortfolioData = {
  site: {
    owner: "Aadit Mehrotra",
    title: "Aadit Mehrotra — Product Manager (ex-Software Engineer)",
    tagline: "Product-minded engineer who ships measurable outcomes.",
    positioning: "I’m a software engineer pivoting into product management, focused on turning ambiguous business problems into measurable outcomes. I work end-to-end—discovery, prioritization, delivery, and instrumentation—while partnering with Engineering, Design, and Operations. My superpower: translating technical complexity into product decisions that move a KPI.",
  },
  contact: {
    email: "aaditm2000@gmail.com",
    portfolio: "https://aadit1901.vercel.app/",
    linkedin: "https://www.linkedin.com/in/aadit-mehrotra/",
    github: "https://github.com/tidaaartorhem",
    location: "Toronto, Canada",
    hireLink: "#",
    resume: "#",
  },
  highlights: [
    { label: "Fewer post-merge defects", value: "12%", icon: "Bug" },
    { label: "Faster deployments", value: "10%", icon: "Rocket" },
    { label: "Faster queries", value: "25%", icon: "TrendingUp" },
    { label: "Fewer validation errors", value: "10%", icon: "ShieldCheck" },
    { label: "Lower mailing costs", value: "30%", icon: "Mail" },
    { label: "Higher engagement", value: "25%", icon: "UsersGroup" },
  ],
  skills: [
    "Product Strategy", "Discovery & Research", "Roadmapping", "PRD Writing",
    "Experimentation", "KPI Trees & Tracking Plans", "Stakeholder Alignment",
    "AI/LLM Feature Design", "Technical Architecture & APIs", "Data Analysis",
  ],
  resume: [
    {
      id: 'resume-1',
      content: "Owned v1 of an AI-assisted code review workflow; defined success metric (post‑merge defects), piloted on two repos, reduced defects ~12% while improving PR cycle time.",
      caseStudyId: "ai-code-reviewer",
    },
    {
      id: 'resume-2',
      content: "Framed discovery and value prop for a Confluence→Jira authoring assistant; scoped MVP templates, set acceptance criteria, validated fit via pilot analytics.",
      caseStudyId: "confluence-jira-assistant",
    },
    {
      id: 'resume-3',
      content: "Product-shaped a real-time ops dashboard to shorten time‑to‑insight; prioritized top workflows, defined engagement metrics, standardized reusable components.",
      caseStudyId: "realtime-ops-dashboard",
    },
    { id: 'resume-4', content: "Partnered with backend to cut p95 latency via cache + index plan; aligned SLAs; validated with synthetic + prod telemetry." },
    { id: 'resume-5', content: "Shipped a schema-driven form system; used error rate as north-star and drove ~10% reduction in validation errors." },
    { id: 'resume-6', content: "Owned deployment experience improvements; mapped release journey, set p95 goal, achieved ~10% faster deploys." },
    { id: 'resume-7', content: "Led data-access optimization; defined read SLAs for high-impact endpoints and delivered ~25% faster queries." },
  ],
  cases: [
    {
      id: "ai-code-reviewer",
      title: "AI Code Reviewer",
      summary: "Reduced post-merge defects and sped up PR cycles with AI-assisted review.",
      tags: ["AI", "DevEx", "Quality"],
      metrics: { primary: "post-merge defect rate", result: "~12% reduction" },
      sections: {
        problem: "Post-merge defects and high review latency created significant rework, delayed releases, and increased the risk of missing customer SLAs.",
        users: "Primary users are Developers and Release Managers. Developers are frustrated by slow, inconsistent reviews. Release Managers are concerned about quality gates and release stability.",
        hypothesis: "An AI-assisted reviewer that automatically flags risky diffs, style violations, and potential regressions during the CI process can reduce defect leakage and accelerate PR cycles.",
        scope: "The MVP focuses on high-volume repositories first to maximize impact. It includes a configurable precision threshold to minimize noise, an opt-in model for teams, and a global kill-switch for safety.",
        solution: "We built a CI integration (GitHub Action) that analyzes pull requests. It posts inline annotations for potential issues directly in the PR diff. A separate dashboard allows teams to track flag acceptance rates and override patterns.",
        results: "The pilot program resulted in a ~12% reduction in post-merge defects in participating repos. We also observed a measurable improvement in average PR cycle time as the AI handled initial-pass reviews.",
        tradeoffs: "We tuned the model for high precision over recall to build developer trust and reduce false positive fatigue. We chose a staged rollout to two key repos before a wider org-wide deployment to gather feedback and iterate. Cost guardrails were implemented to monitor and control inference costs.",
        risks: "Key risks include model drift over time requiring retraining, the potential for excessive 'noise' frustrating developers, and ensuring the privacy of proprietary code.",
        next: "Future plans include expanding the rule set to cover more languages and bug categories, A/B testing different precision thresholds to find the optimal balance, and developing a model to calculate the 'cost-per-prevented-defect'.",
      },
      artifacts: {
        prd: {
          context: "Post-merge defects are a major source of rework and instability. Current manual review processes are slow and inconsistent.",
          goals: {
            primaryMetric: "Reduce post-merge defect rate by 10% in Q3.",
            items: ["Decrease PR cycle time for small-to-medium changes.", "Increase developer satisfaction with the review process."]
          },
          nonGoals: ["Replacing human reviewers entirely.", "Flagging architectural issues.", "Supporting languages outside of TypeScript and Python in v1."],
          users: [
            { persona: "Developer", insights: ["'Reviews are a bottleneck.'", "'I waste time on trivial style nits.'"] },
            { persona: "Release Manager", insights: ["'We need a better quality gate before production.'"] }
          ],
          solutionOverview: "A GitHub Action that uses a pre-trained LLM to scan code diffs and posts comments on lines with potential bugs, style issues, or missing test coverage.",
          scope: ["User Story 1: As a dev, I see AI-generated comments on my PR.", "User Story 2: As a dev, I can dismiss a suggestion.", "User Story 3: As a team lead, I can enable or disable the reviewer on my repo."],
          metrics: {
            kpiTree: "Fewer Defects -> Higher Quality -> Faster Releases",
            events: [
              { name: "ai_flag_added", properties: ["repoId", "fileType", "severity", "modelVersion"] },
              { name: "flag_overridden", properties: ["repoId", "flagId", "reason"] },
            ]
          },
          risks: ["Model generates too many false positives.", "Inference costs exceed budget.", "Developers ignore the suggestions."],
          launchPlan: {
            now: ["Pilot with platform team repo.", "Build feedback collection mechanism."],
            next: ["Onboard 2-3 more teams.", "Develop analytics dashboard."],
            later: ["Org-wide rollout announcement.", "Explore custom, self-hosted models."],
          },
        },
        trackingPlan: {
          primaryMetric: "Post-merge defect rate",
          events: [
            { name: "ai_flag_added", properties: ["repoId", "fileType", "severity", "modelVersion"], description: "Fires when the AI adds a new suggestion to a PR." },
            { name: "flag_overridden", properties: ["repoId", "userId", "flagId"], description: "Fires when a user dismisses or ignores an AI suggestion." },
            { name: "defect_postmerge", properties: ["repoId", "commitHash", "severity"], description: "Logged when a bug is found in code that has been merged." }
          ],
          dashboards: ["Weekly trend of post-merge defects by repo.", "Adoption dashboard showing AI flag acceptance rate."]
        },
        roadmap: {
          now: ["Launch pilot in 2 repos", "Implement cost guardrails", "Basic feedback form"],
          next: ["Expand rule set for Python", "A/B test precision thresholds", "Build admin dashboard"],
          later: ["Org-wide rollout", "Integrate with security scanner", "Explore self-hosted models"],
        },
      },
    },
    {
      id: "confluence-jira-assistant",
      title: "Confluence → Jira Authoring Assistant",
      summary: "Context-aware drafting to speed consistent user stories and test cases.",
      tags: ["AI", "Productivity", "Workflow"],
      metrics: { primary: "time to first draft", result: "Significant reduction in pilot" },
      sections: {
        problem: "Product Managers and QA Engineers spent hours manually drafting user stories and test scenarios from Confluence requirement docs. The quality and format were inconsistent, leading to rework.",
        users: "Product Managers, QA Engineers, Engineering Managers.",
        hypothesis: "A context-aware authoring assistant can parse Confluence pages and produce high-quality, consistent first drafts of Jira tickets faster.",
        scope: "The MVP focuses on generating a standard User Story with stubbed-out acceptance criteria and a basic test plan. It includes a simple review-and-edit workflow before creating the ticket.",
        solution: "We developed a Jira plugin that adds a 'Create from Confluence' option. Users provide a Confluence link, and the tool uses an LLM to parse the content and generate a structured Jira story draft in a modal.",
        results: "The pilot program showed a significant reduction in authoring time for new stories. We also received positive feedback on the improved standardization of ticket formats across teams.",
        tradeoffs: "We prioritized template rigidity over flexibility in the MVP to ensure consistency. Prompt engineering was a tradeoff between generation quality and token costs.",
        risks: "The primary risk is model hallucination, where the AI generates inaccurate or irrelevant acceptance criteria. Over-reliance on the tool could also reduce critical thinking.",
        next: "The roadmap includes building a template library for different ticket types (bugs, tasks, spikes), implementing hallucination guardrails, and adding usage analytics to identify popular features.",
      },
      artifacts: {
        prd: {
          context: "Ticket authoring is a time-consuming and inconsistent process, slowing down the product development lifecycle.",
          goals: {
            primaryMetric: "Reduce average time-to-first-draft for Jira stories by 50%.",
            items: ["Improve consistency of story format.", "Reduce QA clarification questions."]
          },
          nonGoals: ["Automating ticket creation without human review.", "Supporting custom Confluence macros in v1."],
          users: [
            { persona: "Product Manager", insights: ["'I spend half my Monday writing tickets.'"] }
          ],
          solutionOverview: "A Jira plugin that ingests a Confluence URL and generates a story draft using a predefined template and an LLM.",
          scope: ["Generate title and description.", "Generate 3-5 acceptance criteria based on content.", "Allow user to edit before creation."],
          metrics: {
            kpiTree: "Faster Drafting -> Faster Sprints -> Higher Velocity",
            events: [
              { name: "draft_generated", properties: ["source", "modelVersion"] },
              { name: "draft_accepted", properties: ["editRatio"] },
            ]
          },
          risks: ["Generated content is low quality or incorrect.", "High API costs."],
          launchPlan: {
            now: ["Pilot with 2 PMs and 1 QA.", "Manual cost monitoring."],
            next: ["Expand pilot to the entire product team.", "Add support for Bug templates."],
            later: ["General availability for the organization."],
          },
        },
        trackingPlan: {
          primaryMetric: "Time to first draft",
          events: [
            { name: "assistant_invoked", properties: ["userId", "source"], description: "Fires when the generation process is started." },
            { name: "draft_created", properties: ["userId", "timeToCreateMs", "editRatio"], description: "Fires when a user saves the draft as a Jira ticket." }
          ],
          dashboards: ["Weekly trends for authoring time.", "Adoption rate by team."]
        },
        roadmap: {
          now: ["User Story template", "Acceptance criteria stubbing", "Review & edit workflow"],
          next: ["Template library (bug, spike)", "Hallucination guardrails", "Usage analytics"],
          later: ["Support for custom fields", "Batch creation from parent page", "Team-specific templates"],
        },
      },
    },
    {
      id: "realtime-ops-dashboard",
      title: "Real-time Policy Ops Dashboard",
      summary: "High‑performance dashboard to reduce time‑to‑insight and incident MTTR.",
      tags: ["Platform", "DataViz", "Operations"],
      metrics: { primary: "time-to-insight", result: "Faster decisions; component reuse" },
      sections: {
        problem: "Operations teams lacked live visibility into key policy processing workflows. Decisions were reactive, based on stale data from batch reports, delaying incident response.",
        users: "Operations Leads, Support Analysts, Business Stakeholders.",
        hypothesis: "A real-time dashboard visualizing the top 3-5 critical workflows will reduce time-to-insight and shorten Mean Time To Resolution (MTTR) for incidents.",
        scope: "The MVP includes visualizing the 3 top revenue-impacting workflows, providing a 24-hour historical view for comparison, and configurable alert thresholds for key metrics.",
        solution: "We built a high-performance dashboard using React, D3.js, and WebSockets for data streaming. The architecture was designed with reusable data visualization components for future use.",
        results: "The dashboard led to faster, data-driven decision-making during operational incidents. The standardized, reusable components were adopted by two other teams, saving development time.",
        tradeoffs: "We made a tradeoff between live data accuracy (sub-second) and infrastructure cost, opting for a 5-second refresh interval which met business needs. The complexity of the real-time infrastructure was a known tradeoff for the benefit of live insights.",
        risks: "Risks included data pipeline fragility and the potential for the dashboard to cause performance issues on underlying databases. We mitigated this with read-replicas and efficient queries.",
        next: "Next steps include adding more workflows to the dashboard, building self-serve alerting configuration, and providing drill-down capabilities into specific policy events.",
      },
      artifacts: {
        prd: {
          context: "Operations teams are blind to in-flight issues, leading to slow response times and potential revenue loss.",
          goals: {
            primaryMetric: "Reduce Time-to-Insight for P1 incidents from >1 hour to <5 minutes.",
            items: ["Provide a single source of truth for workflow health.", "Enable proactive issue detection."]
          },
          nonGoals: ["Replacing the existing BI tool.", "Providing user-level transaction data in v1."],
          users: [
            { persona: "Ops Lead", insights: ["'By the time I know there's a problem, it's already too late.'"] }
          ],
          solutionOverview: "A web-based dashboard with live charts for key workflow funnels, powered by a streaming data pipeline.",
          scope: ["Visualize 3 key workflows.", "5-second data refresh rate.", "Configurable email alerts for threshold breaches."],
          metrics: {
            kpiTree: "Faster Insight -> Faster Fixes -> Better Stability",
            events: [
              { name: "dashboard_viewed", properties: ["userId", "dashboardId"] },
              { name: "alert_triggered", properties: ["alertId", "value"] },
            ]
          },
          risks: ["Data pipeline latency.", "Dashboard becomes a performance bottleneck."],
          launchPlan: {
            now: ["Launch MVP for internal ops team.", "On-call rotation for support."],
            next: ["Onboard business stakeholders.", "Add 2 more workflows."],
            later: ["Develop self-service dashboard creation tools."],
          },
        },
        trackingPlan: {
          primaryMetric: "Time-to-insight",
          events: [
            { name: "dashboard_viewed", properties: ["userId", "dashboardName", "timeOnPage"], description: "Fires when a user loads and views a dashboard." },
            { name: "alert_configured", properties: ["userId", "metric", "threshold"], description: "Fires when a user creates or updates an alert." }
          ],
          dashboards: ["Engagement dashboard (daily active users, time on page).", "Incident MTTR weekly trend."]
        },
        roadmap: {
          now: ["Visualize 3 top workflows", "Historical view (24h)", "Alert thresholds"],
          next: ["Self-serve alerting", "Drill-down to transaction level", "Add 5 more workflows"],
          later: ["Anomaly detection alerts", "Public status page component", "Export to CSV"],
        },
      },
    },
    ...newCases,
  ],
};