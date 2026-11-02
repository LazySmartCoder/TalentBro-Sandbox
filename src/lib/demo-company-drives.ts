// Local dummy data for the student Companies & Drives screen. This page is a
// straight copy of the frontend one, running backendless inside the sandbox.

export type DemoCompanyTier = "super_dream" | "dream" | "core" | "mass";

export type DemoCompany = {
  id: number;
  company_id: string;
  company_name: string;
  industry: string;
  company_description: string;
  website: string;
  company_logo: string;
  company_ai_info: { name: string; short_desc: string; known_for: string; big_desc: string }[];
  eligible_courses: string[];
  eligible_branches: string[];
  minimum_cgpa: number | null;
  maximum_backlogs: number | null;
  graduation_year: number | null;
  salary_min: number | null;
  salary_max: number | null;
  work_location: string;
  openings: number | null;
  drive_count: number | null;
  tier: DemoCompanyTier;
};

export type DemoDrive = {
  drive_id: number;
  company_id: string;
  company_name: string;
  company_logo: string;
  website: string;
  title: string;
  industry: string;
  role: string;
  ctc_min: number | null;
  ctc_max: number | null;
  tier: DemoCompanyTier;
  mode: string;
  location: string;
  application_deadline: string | null;
  campus_visit_date: string | null;
  status: string;
  openings: number | null;
  eligible_courses: string[];
  eligible_branches: string[];
  minimum_cgpa: number | null;
  maximum_backlogs: number | null;
  required_skills: string[];
  preferred_skills: string[];
  selection_rounds: string[];
  placement_mode: string;
  offer_status: string;
  profile_match?: number | null;
  match_basis?: "skills" | "eligibility" | "none" | null;
  matched_skills?: string[];
  drive_mode: string;
  graduation_year: number | null;
  total_vacancies: number | null;
};

export type DemoCompanyDrives = {
  companies: DemoCompany[];
  drives: DemoDrive[];
  count: number;
  drive_count: number;
};

export type DemoCompanyDetail = {
  company: DemoCompany;
  drives: DemoDrive[];
};

export const demoCompanies: DemoCompany[] = [
  {
    id: 1,
    company_id: "CMP-001",
    company_name: "Tata Consultancy Services",
    industry: "IT Services",
    company_description:
      "India's largest IT services company, hiring across engineering, digital and consulting roles.",
    website: "https://www.tcs.com",
    company_logo: "",
    company_ai_info: [
      {
        name: "Company snapshot",
        short_desc: "Global IT services, consulting and business solutions organisation.",
        known_for: "Large-scale campus hiring and structured training programs.",
        big_desc:
          "TCS partners with leading institutions to hire thousands of graduates each year. Freshers join the TCS Initial Learning Program before moving into project teams.",
      },
    ],
    eligible_courses: ["B.Tech", "BCA", "MCA"],
    eligible_branches: ["CSE", "IT", "ECE", "Mechanical"],
    minimum_cgpa: 6,
    maximum_backlogs: 1,
    graduation_year: 2027,
    salary_min: 3.5,
    salary_max: 7,
    work_location: "Bengaluru, Mumbai, Pune",
    openings: 120,
    drive_count: 1,
    tier: "mass",
  },
  {
    id: 2,
    company_id: "CMP-002",
    company_name: "Zoho",
    industry: "Software Products",
    company_description:
      "Chennai-based product company building business software used by millions worldwide.",
    website: "https://zoho.com",
    company_logo: "",
    company_ai_info: [
      {
        name: "Company snapshot",
        short_desc: "Bootstrapped software product company with a strong engineering culture.",
        known_for: "Deep product work, in-house tools and a no-layoff reputation.",
        big_desc:
          "Zoho hires developers who enjoy building products end to end. Interviews focus on problem solving, data structures and clean code rather than trivia.",
      },
    ],
    eligible_courses: ["B.Tech", "BE", "MCA"],
    eligible_branches: ["CSE", "IT", "ECE"],
    minimum_cgpa: 7,
    maximum_backlogs: 0,
    graduation_year: 2027,
    salary_min: 8,
    salary_max: 14,
    work_location: "Chennai",
    openings: 25,
    drive_count: 1,
    tier: "dream",
  },
  {
    id: 3,
    company_id: "CMP-003",
    company_name: "Deloitte",
    industry: "Consulting",
    company_description:
      "Global professional services network hiring analysts across technology and business consulting.",
    website: "https://www.deloitte.com",
    company_logo: "",
    company_ai_info: [
      {
        name: "Company snapshot",
        short_desc: "Audit, consulting, financial advisory and tax services firm.",
        known_for: "Business technology analyst roles and client-facing projects.",
        big_desc:
          "Deloitte's campus program looks for strong communication, analytical thinking and the ability to work with clients from day one.",
      },
    ],
    eligible_courses: ["B.Tech", "BBA", "MBA"],
    eligible_branches: ["CSE", "IT", "ECE"],
    minimum_cgpa: 7.5,
    maximum_backlogs: 0,
    graduation_year: 2027,
    salary_min: 12,
    salary_max: 22,
    work_location: "Hyderabad",
    openings: 10,
    drive_count: 1,
    tier: "super_dream",
  },
  {
    id: 4,
    company_id: "CMP-004",
    company_name: "Infosys",
    industry: "IT Services",
    company_description:
      "Global leader in next-generation digital services and consulting with a large fresher intake.",
    website: "https://www.infosys.com",
    company_logo: "",
    company_ai_info: [],
    eligible_courses: ["B.Tech", "BCA", "BSc"],
    eligible_branches: ["CSE", "IT", "ECE"],
    minimum_cgpa: 6.5,
    maximum_backlogs: 1,
    graduation_year: 2027,
    salary_min: 4,
    salary_max: 9,
    work_location: "Pune",
    openings: 80,
    drive_count: 1,
    tier: "core",
  },
];

export const demoDrives: DemoDrive[] = [
  {
    drive_id: 1,
    company_id: "CMP-001",
    company_name: "Tata Consultancy Services",
    company_logo: "",
    website: "https://www.tcs.com",
    title: "TCS Ninja Hiring 2027",
    industry: "IT Services",
    role: "Assistant System Engineer",
    ctc_min: 3.5,
    ctc_max: 7,
    tier: "mass",
    mode: "On-campus",
    location: "Bengaluru",
    application_deadline: "2026-12-15",
    campus_visit_date: "2026-12-20",
    status: "Live",
    openings: 120,
    eligible_courses: ["B.Tech", "BCA", "MCA"],
    eligible_branches: ["CSE", "IT", "ECE", "Mechanical"],
    minimum_cgpa: 6,
    maximum_backlogs: 1,
    required_skills: ["Java", "SQL", "Communication"],
    preferred_skills: ["Spring Boot"],
    selection_rounds: ["Online Assessment", "Technical Interview", "HR Interview"],
    placement_mode: "full_time",
    offer_status: "pending",
    profile_match: 78,
    match_basis: "skills",
    matched_skills: ["Java", "SQL"],
    drive_mode: "campus",
    graduation_year: 2027,
    total_vacancies: 120,
  },
  {
    drive_id: 2,
    company_id: "CMP-002",
    company_name: "Zoho",
    company_logo: "",
    website: "https://zoho.com",
    title: "Zoho Developer Drive",
    industry: "Software Products",
    role: "Member Technical Staff",
    ctc_min: 8,
    ctc_max: 14,
    tier: "dream",
    mode: "Virtual",
    location: "Chennai",
    application_deadline: "2026-12-05",
    campus_visit_date: "2026-12-10",
    status: "Upcoming",
    openings: 25,
    eligible_courses: ["B.Tech", "BE", "MCA"],
    eligible_branches: ["CSE", "IT", "ECE"],
    minimum_cgpa: 7,
    maximum_backlogs: 0,
    required_skills: ["Java", "Data Structures", "Problem Solving"],
    preferred_skills: ["JavaScript"],
    selection_rounds: ["Coding Round", "Technical Interview", "HR Interview"],
    placement_mode: "full_time",
    offer_status: "pending",
    profile_match: 64,
    match_basis: "skills",
    matched_skills: ["Java"],
    drive_mode: "virtual",
    graduation_year: 2027,
    total_vacancies: 25,
  },
  {
    drive_id: 3,
    company_id: "CMP-003",
    company_name: "Deloitte",
    company_logo: "",
    website: "https://www.deloitte.com",
    title: "Deloitte Analyst Hiring",
    industry: "Consulting",
    role: "Business Technology Analyst",
    ctc_min: 12,
    ctc_max: 22,
    tier: "super_dream",
    mode: "On-campus",
    location: "Hyderabad",
    application_deadline: "2027-01-10",
    campus_visit_date: "2027-01-18",
    status: "Upcoming",
    openings: 10,
    eligible_courses: ["B.Tech", "BBA", "MBA"],
    eligible_branches: ["CSE", "IT", "ECE"],
    minimum_cgpa: 7.5,
    maximum_backlogs: 0,
    required_skills: ["SQL", "Communication"],
    preferred_skills: ["Power BI"],
    selection_rounds: ["Aptitude Test", "Case Interview", "HR Interview"],
    placement_mode: "full_time",
    offer_status: "pending",
    profile_match: 52,
    match_basis: "eligibility",
    matched_skills: [],
    drive_mode: "campus",
    graduation_year: 2027,
    total_vacancies: 10,
  },
  {
    drive_id: 4,
    company_id: "CMP-004",
    company_name: "Infosys",
    company_logo: "",
    website: "https://www.infosys.com",
    title: "Infosys Systems Engineer",
    industry: "IT Services",
    role: "Systems Engineer",
    ctc_min: 4,
    ctc_max: 9,
    tier: "core",
    mode: "On-campus",
    location: "Pune",
    application_deadline: "2026-11-20",
    campus_visit_date: "2026-11-25",
    status: "Completed",
    openings: 80,
    eligible_courses: ["B.Tech", "BCA", "BSc"],
    eligible_branches: ["CSE", "IT", "ECE"],
    minimum_cgpa: 6.5,
    maximum_backlogs: 1,
    required_skills: [],
    preferred_skills: [],
    selection_rounds: ["Online Assessment", "Technical Interview", "HR Interview"],
    placement_mode: "full_time",
    offer_status: "offered",
    profile_match: null,
    match_basis: "none",
    matched_skills: [],
    drive_mode: "campus",
    graduation_year: 2027,
    total_vacancies: 80,
  },
];

export const demoCompanyDrives: DemoCompanyDrives = {
  companies: demoCompanies,
  drives: demoDrives,
  count: demoCompanies.length,
  drive_count: demoDrives.length,
};

export function getDemoCompany(id: number): DemoCompanyDetail | null {
  const company = demoCompanies.find((c) => c.id === id);
  if (!company) return null;
  return {
    company,
    drives: demoDrives.filter((d) => d.company_id === company.company_id),
  };
}
