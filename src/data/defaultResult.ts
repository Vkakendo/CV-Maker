import { OptimizationResult } from '../types';

export const DEFAULT_OPTIMIZATION_RESULT: OptimizationResult = {
  atsScoreBefore: 58,
  atsScoreAfter: 96,
  summary: {
    executiveOverview: "Strong candidate baseline transformed into a Tier-1 Staff Distributed Systems profile with rigorous Google X-Y-Z quantifiable metrics and 96% ATS keyword alignment.",
    keyChanges: [
      "Targeted Staff & Principal Distributed Systems roles with high-throughput metrics.",
      "Rewrote 100% of experience bullets using Google's Achieved [X], measured by [Y], by doing [Z] formula.",
      "Extracted and integrated mission-critical keywords: Go (Golang), gRPC, Kafka, Distributed Consensus, and Kubernetes.",
      "Audited single-column text hierarchy for strict compliance with Taleo, Workday, and Greenhouse ATS engines."
    ],
    matchedKeywords: [
      { keyword: "Go / Golang", category: "Language", status: "Newly Integrated", relevance: "Critical" },
      { keyword: "gRPC & Protobuf", category: "Protocol", status: "Newly Integrated", relevance: "Critical" },
      { keyword: "Distributed Consensus / Raft", category: "Architecture", status: "Newly Integrated", relevance: "High" },
      { keyword: "Apache Kafka", category: "Streaming", status: "Newly Integrated", relevance: "Critical" },
      { keyword: "Kubernetes (K8s)", category: "Infrastructure", status: "Elevated", relevance: "High" },
      { keyword: "PostgreSQL Sharding & Tuning", category: "Database", status: "Elevated", relevance: "High" },
      { keyword: "SRE / SLOs (99.99% Uptime)", category: "Methodology", status: "Newly Integrated", relevance: "High" },
    ],
    missingGaps: [
      { keyword: "Rust / C++", suggestion: "Optional secondary systems languages; Go and gRPC strongly cover primary concurrency mandates." }
    ],
    xyzTransforms: [
      {
        original: "Built backend APIs for high-volume customer transaction systems.",
        optimized: "Architected asynchronous transaction processing pipeline in Go and Kafka, achieving 180,000 QPS with p99 latency <14ms by replacing blocking REST polling with streaming gRPC.",
        actionVerb: "Architected",
        achievedX: "180,000 QPS transaction pipeline with <14ms p99 latency",
        measuredByY: "Slashing latency by 65% and scaling to 180k req/sec",
        byDoingZ: "Replacing blocking REST polling with streaming gRPC and Kafka"
      },
      {
        original: "Decreased query response times on PostgreSQL database tables by adding indexes and query tuning.",
        optimized: "Optimized enterprise PostgreSQL data tier across 250M+ rows, slashing p99 query latency by 42% and eliminating query timeouts by implementing table partitioning and connection pooling.",
        actionVerb: "Optimized",
        achievedX: "Slashing query latency by 42% across 250M+ rows",
        measuredByY: "42% latency reduction and zero production query timeouts",
        byDoingZ: "Implementing composite indexing, table partitioning, and connection pooling"
      },
      {
        original: "Worked on microservices migration from a monolithic Rails codebase to Go and gRPC.",
        optimized: "Spearheaded zero-downtime migration of 14 monolithic legacy services into distributed Go microservices, reducing AWS cloud infrastructure costs by $180,000/year through containerized Kubernetes auto-scaling.",
        actionVerb: "Spearheaded",
        achievedX: "Zero-downtime microservices decomposition and $180k/year savings",
        measuredByY: "$180,000 annual cloud reduction across 14 services",
        byDoingZ: "Decomposing Ruby on Rails into containerized Go microservices on Kubernetes"
      }
    ],
    atsComplianceChecks: [
      { category: "Layout Structure", status: "Pass", details: "Strict single-column text flow. Zero multi-column tables, text frames, or graphics." },
      { category: "Typography & Fonts", status: "Pass", details: "Standard system-safe vector typography readable by all commercial parsers." },
      { category: "Section Header Standard", status: "Pass", details: "Standardized canonical headings (Experience, Education, Skills, Summary)." },
      { category: "Date & Formatting", status: "Pass", details: "Clean year and range notation (2021 – Present)." }
    ]
  },
  tailoredCv: {
    header: {
      name: "ALEX R. MORGAN",
      title: "Staff Distributed Systems Engineer",
      email: "alex.morgan.dev@email.com",
      phone: "(415) 555-0182",
      location: "San Francisco, CA (Open to Remote)",
      linkedin: "linkedin.com/in/alexrmorgan-dev",
      portfolio: "github.com/alexmorgan-dev",
    },
    summary: "High-impact Staff Distributed Systems Engineer with 6+ years designing, architecting, and scaling mission-critical cloud backends processing over 500K QPS with sub-15ms latencies. Recognized for decoupling monolithic legacy codebases into resilient Go and gRPC microservices, championing 99.999% high-availability SLAs, and optimizing multi-region data persistence across Kubernetes and AWS architectures.",
    coreCompetencies: [
      "Distributed Systems Architecture",
      "High-Throughput Go & gRPC",
      "Event-Driven Pipelines (Kafka)",
      "Database Sharding & Partitioning",
      "Kubernetes & Terraform IaC",
      "Site Reliability Engineering (SRE)",
      "Distributed Consensus & Caching",
      "Zero-Downtime Rollouts"
    ],
    experience: [
      {
        company: "CloudScale Technologies",
        role: "Senior Software Engineer (Distributed Systems)",
        location: "San Francisco, CA",
        startDate: "2021",
        endDate: "Present",
        bullets: [
          "Architected asynchronous event-driven payment processing pipeline in Go and Apache Kafka, processing 180,000 QPS with p99 latency <14ms by replacing synchronous REST polling with high-efficiency gRPC streaming.",
          "Spearheaded zero-downtime migration of 14 legacy monolithic services into containerized Go microservices on Kubernetes (EKS), reducing annual AWS cloud infrastructure expenditures by $180,000.",
          "Optimized enterprise PostgreSQL data tier across 250M+ rows, slashing p99 query latency by 42% and eliminating production timeout anomalies through composite indexing, table partitioning, and connection pooling.",
          "Championed site reliability engineering (SRE) observability by instrumenting OpenTelemetry, Prometheus, and Grafana alerting, sustaining 99.99% system uptime across multi-region clusters.",
          "Mentored and guided 6 mid-level engineers in distributed consensus design, concurrent programming idioms, and clean test-driven design."
        ]
      },
      {
        company: "Apex Data Systems",
        role: "Software Engineer (Backend & Telemetry)",
        location: "Austin, TX",
        startDate: "2018",
        endDate: "2021",
        bullets: [
          "Engineered distributed IoT telemetry ingestion service handling 45M daily device events using Python, Redis, and Amazon ECS, cutting event ingestion lag from 8 seconds to under 250 milliseconds.",
          "Designed multi-tiered caching topology using Redis cluster and Memcached, offloading 65% of repetitive read operations from primary transactional relational databases.",
          "Automated end-to-end continuous deployment pipelines utilizing Docker, GitHub Actions, and Terraform, shortening deployment lead time from 4 days to 22 minutes.",
          "Participated in tier-1 incident response rotations, authoring 15+ comprehensive post-mortems and instituting automated runbooks that reduced mean time to resolution (MTTR) by 38%."
        ]
      }
    ],
    projects: [
      {
        title: "K-Raft Consensus Engine",
        role: "Creator & Lead Maintainer",
        link: "github.com/alexmorgan-dev/k-raft",
        startDate: "2023",
        endDate: "Present",
        bullets: [
          "Developed an open-source Raft distributed consensus protocol implementation in Go featuring leader election, log replication, and snapshotting.",
          "Benchmarked against Etcd achieving 85,000 commits/second across a 5-node cluster with zero data loss under simulated network partitions."
        ]
      }
    ],
    education: [
      {
        institution: "University of Texas at Austin",
        degree: "Bachelor of Science in Computer Science",
        location: "Austin, TX",
        graduationDate: "2018",
        honors: "Magna Cum Laude (GPA: 3.88/4.0)"
      }
    ],
    skills: [
      {
        category: "Programming & Languages",
        items: ["Go (Golang)", "Python", "TypeScript", "SQL", "Bash", "Protobuf"]
      },
      {
        category: "Distributed & Cloud Architecture",
        items: ["gRPC", "Apache Kafka", "Kubernetes (K8s)", "Docker", "AWS (EC2, EKS, S3, RDS)", "Terraform IaC"]
      },
      {
        category: "Databases & Storage",
        items: ["PostgreSQL (Query Tuning, Sharding)", "Redis", "Distributed Caching", "DynamoDB"]
      },
      {
        category: "Reliability & Observability",
        items: ["Prometheus", "Grafana", "OpenTelemetry", "SLO/SLA Management", "CI/CD Pipelines"]
      }
    ],
    certifications: [
      {
        name: "AWS Certified Solutions Architect – Professional",
        issuer: "Amazon Web Services",
        date: "2023"
      },
      {
        name: "Certified Kubernetes Administrator (CKA)",
        issuer: "Cloud Native Computing Foundation (CNCF)",
        date: "2022"
      }
    ],
    languages: [
      { language: "English", proficiency: "Native / Bilingual" },
      { language: "German", proficiency: "Professional Working (B2)" },
    ],
    references: [
      {
        name: "Dr. Marcus Vance",
        title: "VP of Engineering",
        company: "CloudScale Technologies",
        contact: "m.vance@cloudscale.io • (415) 555-0199"
      },
      {
        name: "Elena Rostova",
        title: "Principal Infrastructure Architect",
        company: "Apex Data Systems",
        contact: "elena.rostova@apexdata.com"
      }
    ],
    formattedText: `ALEX R. MORGAN
San Francisco, CA (Open to Remote) | (415) 555-0182 | alex.morgan.dev@email.com
LinkedIn: linkedin.com/in/alexrmorgan-dev | Portfolio: github.com/alexmorgan-dev

EXECUTIVE SUMMARY
High-impact Staff Distributed Systems Engineer with 6+ years designing, architecting, and scaling mission-critical cloud backends processing over 500K QPS with sub-15ms latencies. Recognized for decoupling monolithic legacy codebases into resilient Go and gRPC microservices, championing 99.999% high-availability SLAs, and optimizing multi-region data persistence across Kubernetes and AWS architectures.

CORE COMPETENCIES
Distributed Systems Architecture • High-Throughput Go & gRPC • Event-Driven Pipelines (Kafka) • Database Sharding & Partitioning • Kubernetes & Terraform IaC • Site Reliability Engineering (SRE) • Distributed Consensus & Caching • Zero-Downtime Rollouts

PROFESSIONAL EXPERIENCE

CloudScale Technologies — San Francisco, CA
Senior Software Engineer (Distributed Systems) | 2021 – Present
- Architected asynchronous event-driven payment processing pipeline in Go and Apache Kafka, processing 180,000 QPS with p99 latency <14ms by replacing synchronous REST polling with high-efficiency gRPC streaming.
- Spearheaded zero-downtime migration of 14 legacy monolithic services into containerized Go microservices on Kubernetes (EKS), reducing annual AWS cloud infrastructure expenditures by $180,000.
- Optimized enterprise PostgreSQL data tier across 250M+ rows, slashing p99 query latency by 42% and eliminating production timeout anomalies through composite indexing, table partitioning, and connection pooling.
- Championed site reliability engineering (SRE) observability by instrumenting OpenTelemetry, Prometheus, and Grafana alerting, sustaining 99.99% system uptime across multi-region clusters.
- Mentored and guided 6 mid-level engineers in distributed consensus design, concurrent programming idioms, and clean test-driven design.

Apex Data Systems — Austin, TX
Software Engineer (Backend & Telemetry) | 2018 – 2021
- Engineered distributed IoT telemetry ingestion service handling 45M daily device events using Python, Redis, and Amazon ECS, cutting event ingestion lag from 8 seconds to under 250 milliseconds.
- Designed multi-tiered caching topology using Redis cluster and Memcached, offloading 65% of repetitive read operations from primary transactional relational databases.
- Automated end-to-end continuous deployment pipelines utilizing Docker, GitHub Actions, and Terraform, shortening deployment lead time from 4 days to 22 minutes.
- Participated in tier-1 incident response rotations, authoring 15+ comprehensive post-mortems and instituting automated runbooks that reduced mean time to resolution (MTTR) by 38%.

PROJECTS & INITIATIVES
K-Raft Consensus Engine (Creator & Maintainer) | 2023 – Present
- Developed an open-source Raft distributed consensus protocol implementation in Go featuring leader election, log replication, and snapshotting.
- Benchmarked against Etcd achieving 85,000 commits/second across a 5-node cluster with zero data loss under simulated network partitions.

EDUCATION
University of Texas at Austin — Austin, TX
Bachelor of Science in Computer Science | Magna Cum Laude (GPA: 3.88/4.0) | 2018

SKILLS & TECHNOLOGIES
- Programming & Languages: Go (Golang), Python, TypeScript, SQL, Bash, Protobuf
- Distributed & Cloud Architecture: gRPC, Apache Kafka, Kubernetes (K8s), Docker, AWS (EC2, EKS, S3, RDS), Terraform IaC
- Databases & Storage: PostgreSQL (Query Tuning, Sharding), Redis, Distributed Caching, DynamoDB
- Reliability & Observability: Prometheus, Grafana, OpenTelemetry, SLO/SLA Management, CI/CD Pipelines

CERTIFICATIONS
- AWS Certified Solutions Architect – Professional (2023)
- Certified Kubernetes Administrator (CKA) (2022)
`,
    markdownText: `# ALEX R. MORGAN
**Staff Distributed Systems Engineer**

San Francisco, CA (Open to Remote) | (415) 555-0182 | alex.morgan.dev@email.com
LinkedIn: linkedin.com/in/alexrmorgan-dev | Portfolio: github.com/alexmorgan-dev

---

## EXECUTIVE SUMMARY
High-impact Staff Distributed Systems Engineer with 6+ years designing, architecting, and scaling mission-critical cloud backends processing over 500K QPS with sub-15ms latencies.

## CORE COMPETENCIES
Distributed Systems Architecture • High-Throughput Go & gRPC • Event-Driven Pipelines (Kafka) • Database Sharding & Partitioning • Kubernetes & Terraform IaC

## PROFESSIONAL EXPERIENCE
### Senior Software Engineer (Distributed Systems) | CloudScale Technologies
*2021 – Present | San Francisco, CA*
- Architected asynchronous event-driven payment processing pipeline in Go and Apache Kafka, processing 180,000 QPS with p99 latency <14ms.
- Spearheaded zero-downtime migration of 14 legacy monolithic services into containerized Go microservices on Kubernetes (EKS), reducing annual AWS cloud infrastructure expenditures by $180,000.
- Optimized enterprise PostgreSQL data tier across 250M+ rows, slashing p99 query latency by 42%.

### Software Engineer (Backend & Telemetry) | Apex Data Systems
*2018 – 2021 | Austin, TX*
- Engineered distributed IoT telemetry ingestion service handling 45M daily device events using Python, Redis, and Amazon ECS.
- Designed multi-tiered caching topology using Redis cluster and Memcached, offloading 65% of repetitive read operations.
`,
  },
};
