// Realistic mock dataset for TalentBro — Sardar Vallabhbhai Institute of Technology, Pune.
// Deterministic (no randomness) so SSR and client render identically.

export type Department =
  | "Computer Engineering"
  | "Information Technology"
  | "Electronics & Telecom"
  | "Mechanical Engineering"
  | "Civil Engineering"
  | "AI & Data Science";

export const DEPARTMENTS: Department[] = [
  "Computer Engineering",
  "Information Technology",
  "Electronics & Telecom",
  "Mechanical Engineering",
  "Civil Engineering",
  "AI & Data Science",
];

export type StudentStatus = "Placed" | "In Process" | "Unplaced" | "Higher Studies";

export interface Student {
  id: string;
  roll: string;
  name: string;
  department: Department;
  year: number;
  cgpa: number;
  backlogs: number;
  email: string;
  phone: string;
  city: string;
  status: StudentStatus;
  offers: number;
  package: number | null; // LPA
  company: string | null;
  aiScore: number;
  skills: string[];
}

const FIRST = [
  "Aarav", "Ananya", "Rohan", "Ishita", "Kabir", "Meera", "Siddharth", "Priya",
  "Aditya", "Sneha", "Vivek", "Nikita", "Arjun", "Divya", "Harsh", "Tanvi",
  "Rahul", "Pooja", "Manav", "Shreya", "Karan", "Aishwarya", "Nikhil", "Riya",
  "Omkar", "Sanjana", "Yash", "Kavya", "Pranav", "Trisha", "Devansh", "Neha",
  "Sarthak", "Anjali", "Rutuja", "Aniket", "Mrunal", "Sagar", "Prachi", "Varun",
  "Ira", "Krishna", "Bhavesh", "Sakshi", "Tejas", "Gauri", "Aman", "Snehal",
  "Rishabh", "Vaishnavi", "Chirag", "Aditi", "Parth", "Namrata", "Sahil", "Payal",
];

const LAST = [
  "Sharma", "Deshmukh", "Iyer", "Patil", "Nair", "Kulkarni", "Reddy", "Joshi",
  "Chatterjee", "Gowda", "Bhattacharya", "Mehta", "Rane", "Pillai", "Verma",
  "Shetty", "Banerjee", "Chavan", "Agarwal", "Sinha", "Menon", "Jadhav",
];

const CITIES = ["Pune", "Nashik", "Nagpur", "Mumbai", "Kolhapur", "Aurangabad", "Solapur", "Thane"];

const SKILLS = [
  ["React", "Node.js", "PostgreSQL"],
  ["Java", "Spring Boot", "MySQL"],
  ["Python", "Pandas", "Scikit-learn"],
  ["C++", "DSA", "System Design"],
  ["AutoCAD", "SolidWorks", "ANSYS"],
  ["VLSI", "Verilog", "Embedded C"],
  ["Flutter", "Firebase", "Dart"],
  ["AWS", "Docker", "Kubernetes"],
  ["Tableau", "SQL", "Excel"],
  ["STAAD Pro", "Revit", "Surveying"],
];

export const COMPANY_NAMES = [
  "Infosys", "Tata Consultancy Services", "Wipro", "Persistent Systems",
  "Zensar Technologies", "Bajaj Finserv", "Tech Mahindra", "Cognizant",
  "L&T Technology Services", "Deloitte India", "Mahindra & Mahindra",
  "Kalyani Group", "Barclays Pune", "Amdocs", "Quick Heal", "Icertis",
];

const DEPT_CODE: Record<Department, string> = {
  "Computer Engineering": "CO",
  "Information Technology": "IT",
  "Electronics & Telecom": "EC",
  "Mechanical Engineering": "ME",
  "Civil Engineering": "CE",
  "AI & Data Science": "AD",
};

function pick<T>(arr: readonly T[], i: number): T {
  return arr[((i % arr.length) + arr.length) % arr.length] as T;
}

function build(): Student[] {
  const out: Student[] = [];
  for (let i = 0; i < 168; i++) {
    const dept = pick(DEPARTMENTS, i);
    const name = `${pick(FIRST, i)} ${pick(LAST, i * 7)}`;
    const cgpa = Number((6.1 + ((i * 13) % 38) / 10).toFixed(2));
    const backlogs = (i * 5) % 11 === 0 ? 1 : 0;
    const seed = (i * 31) % 100;
    let status: StudentStatus;
    if (seed < 62) status = "Placed";
    else if (seed < 80) status = "In Process";
    else if (seed < 92) status = "Unplaced";
    else status = "Higher Studies";
    if (cgpa < 6.5 && status === "Placed") status = "In Process";
    const placed = status === "Placed";
    const pkg = placed ? Number((3.6 + ((i * 17) % 190) / 10).toFixed(1)) : null;
    out.push({
      id: `stu-${i + 1}`,
      roll: `${DEPT_CODE[dept]}22${String(101 + i).padStart(4, "0")}`,
      name,
      department: dept,
      year: 4,
      cgpa,
      backlogs,
      email: `${name.toLowerCase().replace(/ /g, ".")}${i}@svit.ac.in`,
      phone: `+91 9${String(800000000 + i * 137911).slice(0, 9)}`,
      city: pick(CITIES, i),
      status,
      offers: placed ? ((i % 4 === 0 ? 2 : 1) as number) : 0,
      package: pkg,
      company: placed ? pick(COMPANY_NAMES, i * 3) : null,
      aiScore: 48 + ((i * 29) % 51),
      skills: pick(SKILLS, i),
    });
  }
  return out;
}

export const students: Student[] = build();

export type CompanyTier = "Super Dream" | "Dream" | "Core" | "Mass";

export interface Company {
  id: string;
  name: string;
  sector: string;
  tier: CompanyTier;
  hq: string;
  spoc: string;
  spocEmail: string;
  ctcMin: number;
  ctcMax: number;
  openRoles: string[];
  offers2026: number;
  status: "Active" | "Onboarding" | "Archived";
  eligibility: string;
  since: number;
}

const SECTORS = ["IT Services", "Product", "BFSI", "Manufacturing", "Consulting", "Cybersecurity"];
const TIERS: CompanyTier[] = ["Super Dream", "Dream", "Core", "Mass"];
const HQ = ["Bengaluru", "Pune", "Mumbai", "Hyderabad", "Chennai", "Gurugram"];
const ROLES = [
  ["SDE-1", "QA Engineer"],
  ["Systems Engineer", "Analyst"],
  ["Data Analyst", "ML Engineer"],
  ["Design Engineer", "Graduate Trainee"],
  ["Risk Analyst", "Associate Consultant"],
  ["Security Analyst", "SOC Engineer"],
];

export const companies: Company[] = COMPANY_NAMES.map((name, i) => ({
  id: `cmp-${i + 1}`,
  name,
  sector: pick(SECTORS, i),
  tier: pick(TIERS, i * 3),
  hq: pick(HQ, i),
  spoc: `${pick(FIRST, i * 5)} ${pick(LAST, i * 2)}`,
  spocEmail: `campus.hiring@${name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 12)}.com`,
  ctcMin: 3.5 + (i % 5),
  ctcMax: 7 + ((i * 3) % 18),
  openRoles: pick(ROLES, i),
  offers2026: 4 + ((i * 11) % 38),
  status: i % 9 === 0 ? "Onboarding" : i % 13 === 0 ? "Archived" : "Active",
  eligibility: `CGPA ≥ ${(6 + (i % 3) * 0.5).toFixed(1)}, ≤ ${i % 2} active backlog`,
  since: 2012 + (i % 12),
}));

export type DriveStage =
  | "Registration"
  | "Aptitude Test"
  | "Technical Round"
  | "HR Round"
  | "Offer Rollout";

export const DRIVE_STAGES: DriveStage[] = [
  "Registration",
  "Aptitude Test",
  "Technical Round",
  "HR Round",
  "Offer Rollout",
];

export interface Drive {
  id: string;
  company: string;
  role: string;
  ctc: number;
  date: string;
  mode: "On-campus" | "Virtual" | "Pool Campus";
  venue: string;
  stage: DriveStage;
  status: "Live" | "Upcoming" | "Completed";
  registered: number;
  shortlisted: number;
  interviewed: number;
  offers: number;
  departments: Department[];
  minCgpa: number;
}

export const drives: Drive[] = [
  {
    id: "drv-1", company: "Persistent Systems", role: "SDE-1", ctc: 11.5,
    date: "2026-09-02", mode: "On-campus", venue: "Seminar Hall A", stage: "Technical Round",
    status: "Live", registered: 412, shortlisted: 168, interviewed: 96, offers: 0,
    departments: ["Computer Engineering", "Information Technology", "AI & Data Science"], minCgpa: 7,
  },
  {
    id: "drv-2", company: "Bajaj Finserv", role: "Risk Analyst", ctc: 9.2,
    date: "2026-09-05", mode: "Virtual", venue: "MS Teams", stage: "Aptitude Test",
    status: "Live", registered: 288, shortlisted: 121, interviewed: 0, offers: 0,
    departments: ["Computer Engineering", "Information Technology", "Electronics & Telecom"], minCgpa: 6.5,
  },
  {
    id: "drv-3", company: "Infosys", role: "Systems Engineer", ctc: 6.5,
    date: "2026-09-11", mode: "Pool Campus", venue: "MIT Pune Campus", stage: "Registration",
    status: "Upcoming", registered: 517, shortlisted: 0, interviewed: 0, offers: 0,
    departments: DEPARTMENTS, minCgpa: 6,
  },
  {
    id: "drv-4", company: "Icertis", role: "ML Engineer", ctc: 14,
    date: "2026-09-18", mode: "On-campus", venue: "Innovation Lab", stage: "Registration",
    status: "Upcoming", registered: 143, shortlisted: 0, interviewed: 0, offers: 0,
    departments: ["AI & Data Science", "Computer Engineering"], minCgpa: 7.5,
  },
  {
    id: "drv-5", company: "Tata Consultancy Services", role: "Digital Cadre", ctc: 7.1,
    date: "2026-08-12", mode: "Virtual", venue: "TCS iON", stage: "Offer Rollout",
    status: "Completed", registered: 604, shortlisted: 288, interviewed: 214, offers: 137,
    departments: DEPARTMENTS, minCgpa: 6,
  },
  {
    id: "drv-6", company: "Kalyani Group", role: "Design Engineer", ctc: 6.8,
    date: "2026-08-19", mode: "On-campus", venue: "Workshop Block", stage: "Offer Rollout",
    status: "Completed", registered: 196, shortlisted: 88, interviewed: 61, offers: 29,
    departments: ["Mechanical Engineering", "Civil Engineering"], minCgpa: 6.5,
  },
  {
    id: "drv-7", company: "Barclays Pune", role: "Technology Analyst", ctc: 16.5,
    date: "2026-09-24", mode: "On-campus", venue: "Seminar Hall B", stage: "Registration",
    status: "Upcoming", registered: 98, shortlisted: 0, interviewed: 0, offers: 0,
    departments: ["Computer Engineering", "Information Technology"], minCgpa: 8,
  },
  {
    id: "drv-8", company: "Quick Heal", role: "Security Analyst", ctc: 8.4,
    date: "2026-09-08", mode: "Virtual", venue: "Zoom", stage: "HR Round",
    status: "Live", registered: 174, shortlisted: 64, interviewed: 41, offers: 12,
    departments: ["Computer Engineering", "Electronics & Telecom", "Information Technology"], minCgpa: 6.5,
  },
];

export const funnel = [
  { stage: "Registered", value: 2432 },
  { stage: "Eligible", value: 1988 },
  { stage: "Shortlisted", value: 1146 },
  { stage: "Interviewed", value: 742 },
  { stage: "Offered", value: 418 },
  { stage: "Accepted", value: 361 },
];

export const monthlyPlacements = [
  { month: "Jul", offers: 24, drives: 3, avgCtc: 6.2 },
  { month: "Aug", offers: 186, drives: 7, avgCtc: 7.1 },
  { month: "Sep", offers: 142, drives: 9, avgCtc: 8.4 },
  { month: "Oct", offers: 98, drives: 6, avgCtc: 9.1 },
  { month: "Nov", offers: 76, drives: 5, avgCtc: 9.8 },
  { month: "Dec", offers: 54, drives: 4, avgCtc: 10.4 },
  { month: "Jan", offers: 88, drives: 6, avgCtc: 11.2 },
  { month: "Feb", offers: 61, drives: 4, avgCtc: 10.1 },
];

export const yearlyTrend = [
  { year: "2021", rate: 68, avgCtc: 5.1 },
  { year: "2022", rate: 74, avgCtc: 5.9 },
  { year: "2023", rate: 79, avgCtc: 6.8 },
  { year: "2024", rate: 83, avgCtc: 7.6 },
  { year: "2025", rate: 86, avgCtc: 8.3 },
  { year: "2026", rate: 89, avgCtc: 9.4 },
];

export interface AiInterview {
  id: string;
  student: string;
  roll: string;
  department: Department;
  role: string;
  date: string;
  duration: string;
  overall: number;
  communication: number;
  technical: number;
  problemSolving: number;
  confidence: number;
  verdict: "Strong Hire" | "Hire" | "Borderline" | "Needs Work";
  summary: string;
  strengths: string[];
  gaps: string[];
}

export const aiInterviews: AiInterview[] = students.slice(0, 24).map((s, i) => {
  const overall = 52 + ((i * 17) % 46);
  return {
    id: `ai-${i + 1}`,
    student: s.name,
    roll: s.roll,
    department: s.department,
    role: pick(ROLES, i)[0] as string,
    date: `2026-08-${String(4 + (i % 20)).padStart(2, "0")}`,
    duration: `${22 + (i % 14)} min`,
    overall,
    communication: Math.min(99, overall + ((i * 5) % 11) - 5),
    technical: Math.min(99, overall + ((i * 7) % 13) - 6),
    problemSolving: Math.min(99, overall + ((i * 3) % 9) - 4),
    confidence: Math.min(99, overall + ((i * 11) % 15) - 7),
    verdict: (overall >= 85
      ? "Strong Hire"
      : overall >= 72
        ? "Hire"
        : overall >= 62
          ? "Borderline"
          : "Needs Work") as AiInterview["verdict"],
    summary:
      overall >= 80
        ? "Structured answers with clear trade-off reasoning. Handled follow-ups on scalability without prompting."
        : overall >= 65
          ? "Solid fundamentals, occasionally verbose. Needed a hint on the second DSA problem before converging."
          : "Struggled to articulate approach before coding. Core concepts present but recall is shaky under time pressure.",
    strengths: [
      ["Clear STAR-format answers", "Strong DSA recall", "Good clarifying questions"],
      ["Confident delivery", "Project depth", "Handles ambiguity well"],
      ["Fundamentals in DBMS", "Polite and coachable", "Domain curiosity"],
    ][i % 3] as string[],
    gaps: [
      ["System design vocabulary", "Time complexity analysis"],
      ["Filler words", "Rushed conclusions"],
      ["OS & networking basics", "Struggles with edge cases"],
    ][i % 3] as string[],
  };
});

export const aiSkillRadar = [
  { skill: "Communication", score: 78, benchmark: 72 },
  { skill: "Technical", score: 71, benchmark: 74 },
  { skill: "Problem Solving", score: 74, benchmark: 70 },
  { skill: "Confidence", score: 68, benchmark: 69 },
  { skill: "Domain Depth", score: 65, benchmark: 71 },
];

export interface Schedule {
  id: string;
  title: string;
  company: string;
  date: string;
  time: string;
  venue: string;
  type: "Drive" | "PPT" | "Test" | "Interview" | "Training";
}

export const schedules: Schedule[] = [
  { id: "sc-1", title: "Pre-placement Talk", company: "Icertis", date: "Sep 01", time: "10:00 AM", venue: "Auditorium", type: "PPT" },
  { id: "sc-2", title: "Technical Round — Batch 3", company: "Persistent Systems", date: "Sep 02", time: "09:30 AM", venue: "Seminar Hall A", type: "Interview" },
  { id: "sc-3", title: "Online Aptitude Test", company: "Bajaj Finserv", date: "Sep 05", time: "02:00 PM", venue: "MS Teams", type: "Test" },
  { id: "sc-4", title: "Mock AI Interview Sprint", company: "TalentBro AI", date: "Sep 06", time: "11:00 AM", venue: "Lab 402", type: "Training" },
  { id: "sc-5", title: "Pool Campus Drive", company: "Infosys", date: "Sep 11", time: "08:30 AM", venue: "MIT Pune", type: "Drive" },
  { id: "sc-6", title: "Final HR Round", company: "Quick Heal", date: "Sep 08", time: "03:00 PM", venue: "Zoom", type: "Interview" },
];

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  category: "Drive" | "Student" | "Company" | "System" | "AI";
  read: boolean;
  priority: "High" | "Normal";
}

export const notifications: Notification[] = [
  { id: "n-1", title: "Barclays Pune raised CGPA cutoff", body: "Eligibility for the Technology Analyst drive is now CGPA ≥ 8.0. 34 registered students became ineligible.", time: "12 min ago", category: "Company", read: false, priority: "High" },
  { id: "n-2", title: "Persistent Systems shortlist published", body: "168 of 412 registered students cleared the aptitude round. Technical interviews begin Sep 02.", time: "1 hr ago", category: "Drive", read: false, priority: "High" },
  { id: "n-3", title: "AI interview batch completed", body: "24 mock interviews evaluated. Average score 74/100, up 6 points from last batch.", time: "3 hrs ago", category: "AI", read: false, priority: "Normal" },
  { id: "n-4", title: "12 students missing resume uploads", body: "Final-year students from Mechanical and Civil have incomplete profiles ahead of the Kalyani drive.", time: "5 hrs ago", category: "Student", read: true, priority: "Normal" },
  { id: "n-5", title: "Quick Heal rolled out 12 offers", body: "Offer letters dispatched to shortlisted Security Analyst candidates. Acceptance window closes Sep 15.", time: "Yesterday", category: "Drive", read: true, priority: "Normal" },
  { id: "n-6", title: "Monthly placement report generated", body: "August 2026 report is ready with 186 offers recorded across 7 drives.", time: "Yesterday", category: "System", read: true, priority: "Normal" },
  { id: "n-7", title: "Icertis confirmed campus visit", body: "PPT scheduled for Sep 01 at the main auditorium. 143 students registered so far.", time: "2 days ago", category: "Company", read: true, priority: "Normal" },
];

export const reports = [
  { id: "rp-1", name: "Annual Placement Report 2025-26", period: "Jun 2025 – Feb 2026", type: "Annual", records: 2432, generated: "Feb 24, 2026", size: "4.2 MB" },
  { id: "rp-2", name: "Department-wise Placement Summary", period: "Aug 2026", type: "Department", records: 168, generated: "Aug 24, 2026", size: "820 KB" },
  { id: "rp-3", name: "Company Engagement Ledger", period: "FY 2025-26", type: "Company", records: 16, generated: "Aug 20, 2026", size: "512 KB" },
  { id: "rp-4", name: "AICTE / NAAC Placement Disclosure", period: "AY 2025-26", type: "Compliance", records: 2432, generated: "Aug 18, 2026", size: "1.8 MB" },
  { id: "rp-5", name: "AI Interview Readiness Digest", period: "Aug 2026", type: "AI", records: 24, generated: "Aug 23, 2026", size: "340 KB" },
  { id: "rp-6", name: "Unplaced Students Action Plan", period: "Aug 2026", type: "Department", records: 41, generated: "Aug 22, 2026", size: "260 KB" },
];

// ---- derived ----

export function deptStats() {
  return DEPARTMENTS.map((d) => {
    const list = students.filter((s) => s.department === d);
    const placed = list.filter((s) => s.status === "Placed");
    const avg = placed.length
      ? placed.reduce((a, b) => a + (b.package ?? 0), 0) / placed.length
      : 0;
    const highest = placed.reduce((a, b) => Math.max(a, b.package ?? 0), 0);
    return {
      department: d,
      short: d.split(" ")[0],
      total: list.length,
      placed: placed.length,
      rate: Math.round((placed.length / Math.max(1, list.length)) * 100),
      avgCtc: Number(avg.toFixed(1)),
      highest: Number(highest.toFixed(1)),
    };
  });
}

export function overviewKpis() {
  const placed = students.filter((s) => s.status === "Placed");
  const packages = placed.map((s) => s.package ?? 0);
  const avg = packages.reduce((a, b) => a + b, 0) / Math.max(1, packages.length);
  return {
    totalStudents: students.length,
    placed: placed.length,
    rate: Math.round((placed.length / students.length) * 100),
    avgCtc: Number(avg.toFixed(1)),
    highestCtc: Number(Math.max(...packages).toFixed(1)),
    activeDrives: drives.filter((d) => d.status !== "Completed").length,
    recruiters: companies.filter((c) => c.status === "Active").length,
    offers: placed.reduce((a, b) => a + b.offers, 0),
  };
}

export const ctcBands = [
  { band: "3–6 LPA", students: 96 },
  { band: "6–9 LPA", students: 128 },
  { band: "9–12 LPA", students: 74 },
  { band: "12–16 LPA", students: 41 },
  { band: "16+ LPA", students: 22 },
];
