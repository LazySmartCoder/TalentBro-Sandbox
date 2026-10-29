import {
  broadcasts as broadcastSeed,
  companies as seedCompanies,
  ctcBands as seedCtcBands,
  drives as seedDrives,
  funnel as seedFunnel,
  monthlyPlacements as seedMonthly,
  notifications as seedNotifications,
  students as seedStudents,
  type Company as SeedCompany,
  DEPARTMENTS,
  type Department,
  type Student as SeedStudent,
} from "./data";
import {
  delay,
  getSandboxRole,
  nowIso,
  readJson,
  uid,
  writeJson,
} from "./sandbox-store";
import type {
  AuthUser,
  CandidateProfilePayload,
  ChatMessage,
  ChatResponse,
  ChatSession,
  CommunicationTrainingSession,
  DriveCompanyTier,
  EnglishTrainingSession,
  GdChatMessage,
  GdTrainingRecord,
  InstitutionOverview,
  LeaderboardResponse,
  MockInterviewAnalysis,
  MockInterviewDetail,
  NotificationItem,
  PlacementCompany,
  PlacementDrive,
  PlacementStatus,
  ReportsData,
  StudentRecord,
  StudentsResponse,
} from "./api";

import { panelistPhoto } from "./panelists";

export const INSTITUTION_NAME = "Sardar Vallabhbhai Institute of Technology, Pune";
const BATCH_YEAR = 2026;

const STUDENT_USER: AuthUser = {
  id: 1,
  email: "aarav.sharma@svit.ac.in",
  name: "Aarav Sharma",
  institution: INSTITUTION_NAME,
  role: "student",
  profile_complete: true,
  avatar: undefined,
};

const STAFF_USER: AuthUser = {
  id: 1001,
  email: "placement@svit.ac.in",
  name: "Dr. Anjali Joshi",
  institution: INSTITUTION_NAME,
  role: "institution_staff",
  profile_complete: true,
  avatar: undefined,
  profile: {
    id: 1001,
    institution_name: INSTITUTION_NAME,
    full_name: "Dr. Anjali Joshi",
    official_email: "placement@svit.ac.in",
    avatar: undefined,
    mobile_number: "+91 98220 12345",
    designation: "Training & Placement Officer",
    employee_staff_id: "SVIT-TPO-001",
    access: "master",
    has_master_access: true,
    institution: {
      name: INSTITUTION_NAME,
      institution_type: "Autonomous College",
      website: "https://svit.example.edu",
      email_domain: "svit.ac.in",
      address: "SVIT Road, Vadulgaon, Pune",
      city: "Pune",
      state: "Maharashtra",
      pin_code: "413312",
      logo: undefined,
      placement_department_name: "Training & Placement Cell",
      placement_office_email: "placement@svit.ac.in",
      approximate_student_strength: 168,
    },
  },
};

function meUser(): AuthUser {
  return getSandboxRole() === "institution_staff" ? STAFF_USER : STUDENT_USER;
}

const TIERS: { tier: DriveCompanyTier; label: string }[] = [
  { tier: "super_dream", label: "Super Dream" },
  { tier: "dream", label: "Dream" },
  { tier: "core", label: "Core" },
  { tier: "mass", label: "Mass" },
];

const TIER_FOR_TIER: Record<string, DriveCompanyTier> = {
  "Super Dream": "super_dream",
  Dream: "dream",
  Core: "core",
  Mass: "mass",
};

function tierForCtc(ctc: number): DriveCompanyTier {
  if (ctc >= 12) return "super_dream";
  if (ctc >= 8) return "dream";
  if (ctc >= 4.5) return "core";
  return "mass";
}

const STATUS_TO_PLACEMENT: Record<string, PlacementStatus> = {
  Placed: "placed",
  "In Process": "applying",
  Unplaced: "not_started",
  "Higher Studies": "not_started",
};

function seedToStudentRecord(s: SeedStudent): StudentRecord {
  const full = s.name;
  const [first, ...rest] = full.split(" ");
  const last = rest.pop() ?? "";
  const eligible = s.cgpa >= 6 && s.backlogs === 0;
  return {
    id: s.id,
    first_name: first,
    middle_name: rest.join(" "),
    last_name: last,
    full_name: full,
    department: s.department,
    program: "B.Tech",
    start_year: BATCH_YEAR - 3,
    end_year: BATCH_YEAR,
    mobile_number: s.phone,
    gender: "male",
    cgpa: s.cgpa,
    placement_status: STATUS_TO_PLACEMENT[s.status] ?? "not_started",
    placement_eligible: eligible,
    skills: s.skills,
    preferred_roles: ["SDE", "Analyst", "Consultant"],
    preferred_locations: ["Pune", "Bengaluru", "Hyderabad"],
    preferred_language: "English",
    expected_ctc: s.package,
    account_status: "active",
    created_at: `${BATCH_YEAR - 3}-08-01T09:00:00Z`,
    performance_score: s.aiScore,
    performance: null,
    overall_rank: null,
    department_rank: null,
    overall_total: seedStudents.length,
    department_total: seedStudents.filter((x) => x.department === s.department).length,
  };
}

function seedToPlacementCompany(c: SeedCompany): PlacementCompany {
  return {
    id: Number(c.id.replace(/\D/g, "")) || Math.floor(Math.random() * 1e5),
    company_id: c.id,
    company_name: c.name,
    industry: c.sector,
    company_description: `${c.name} is an active recruiting partner in the ${c.sector} space.`,
    job_roles: c.openRoles,
    eligible_courses: ["B.Tech", "B.E.", "BCA", "MCA"],
    eligible_branches: DEPARTMENTS,
    minimum_cgpa: c.ctcMin >= 10 ? 7.5 : c.ctcMin >= 8 ? 7 : 6,
    maximum_backlogs: 1,
    graduation_year: BATCH_YEAR,
    required_skills: ["Problem Solving", "Communication"],
    preferred_skills: c.openRoles,
    salary_min: c.ctcMin,
    salary_max: c.ctcMax,
    work_location: c.hq,
    work_mode: "Hybrid",
    number_of_openings: c.offers2026,
    selection_rounds: ["Online Assessment", "Technical Interview", "HR Interview"],
    application_deadline: null,
    campus_visit_date: null,
    recruitment_status: c.status === "Active" ? "ongoing" : "upcoming",
    placement_mode: "full_time",
    offer_status: "open",
    tier: TIER_FOR_TIER[c.tier] ?? "core",
    institution: INSTITUTION_NAME,
    created_at: `${c.since}-06-01T09:00:00Z`,
    updated_at: `${BATCH_YEAR}-08-01T09:00:00Z`,
  };
}

function seedToPlacementDrive(d: (typeof seedDrives)[number]): PlacementDrive {
  const company = seedCompanies.find((c) => c.name === d.company);
  const tier = company
    ? (TIER_FOR_TIER[company.tier] ?? tierForCtc(d.ctc))
    : tierForCtc(d.ctc);
  return {
    company_id: d.id,
    company_name: d.company,
    industry: company?.sector ?? "IT Services",
    roles: [d.role],
    ctc_min: d.ctc - (company ? company.ctcMin : 0),
    ctc_max: d.ctc,
    tier,
    mode: d.mode,
    location: "Pune",
    application_deadline: d.status === "Live" || d.status === "Upcoming" ? d.date : null,
    campus_visit_date: d.date,
    status: d.status,
    openings: d.offers > 0 ? d.offers : Math.max(1, Math.round(d.registered / 40)),
    eligible_courses: ["B.Tech", "B.E."],
    eligible_branches: d.departments as Department[],
    minimum_cgpa: d.minCgpa,
    maximum_backlogs: 0,
    required_skills: [],
    selection_rounds: ["Online Assessment", "Technical Interview", "HR Interview"],
    placement_mode: "full_time",
    offer_status: d.status === "Completed" ? "closed" : "open",
    eligible_count: d.registered,
  };
}

const seedStudentsRecords: StudentRecord[] = seedStudents.map(seedToStudentRecord);
const seedCompaniesRecords: PlacementCompany[] = seedCompanies.map(seedToPlacementCompany);
const seedDrivesRecords: PlacementDrive[] = seedDrives.map(seedToPlacementDrive);

function overview(): InstitutionOverview {
  const total = seedStudents.length;
  const placed = seedStudents.filter((s) => s.status === "Placed");
  const eligible = seedStudents.filter((s) => s.cgpa >= 6 && s.backlogs === 0);
  const inSelection = seedStudents.filter((s) => s.status === "In Process");
  const avgCgpa = seedStudents.reduce((a, b) => a + b.cgpa, 0) / Math.max(1, total);
  const highestCgpa = Math.max(...seedStudents.map((s) => s.cgpa));
  const avgCtc =
    placed.reduce((a, b) => a + (b.package ?? 0), 0) / Math.max(1, placed.length);
  const activeCompanies = seedCompanies.filter((c) => c.status === "Active");
  const activeDrives = seedDrives.filter((d) => d.status !== "Completed");
  const openings = seedCompanies.reduce((a, c) => a + c.offers2026, 0);

  const byDept = ([...DEPARTMENTS] as Department[]).map((dept) => {
    const list = seedStudents.filter((s) => s.department === dept);
    const p = list.filter((s) => s.status === "Placed");
    const el = list.filter((s) => s.cgpa >= 6 && s.backlogs === 0);
    const avg = p.length ? p.reduce((a, b) => a + (b.package ?? 0), 0) / p.length : 0;
    return {
      department: dept,
      short: dept.split(" ")[0],
      total: list.length,
      eligible: el.length,
      placed: p.length,
      rate: Math.round((p.length / Math.max(1, list.length)) * 100),
      avg_cgpa: Number((list.reduce((a, b) => a + b.cgpa, 0) / Math.max(1, list.length)).toFixed(2)),
      avg_expected_ctc: Number(avg.toFixed(1)),
    };
  });

  const counts: Record<DriveCompanyTier, number> = { super_dream: 0, dream: 0, core: 0, mass: 0 };
  for (const c of seedCompanies) {
    const tier = TIER_FOR_TIER[c.tier] ?? "core";
    counts[tier] += 1;
  }

  return {
    institution: {
      name: INSTITUTION_NAME,
      institution_type: "Autonomous College",
      website: "https://svit.example.edu",
      email_domain: "svit.ac.in",
      address: "SVIT Road, Vadulgaon",
      city: "Pune",
      state: "Maharashtra",
      pin_code: "413312",
      logo: undefined,
      placement_department_name: "Training & Placement Cell",
      placement_office_email: "placement@svit.ac.in",
      approximate_student_strength: total,
      courses_offered: ["B.Tech", "B.E.", "BCA", "MCA"],
      departments: DEPARTMENTS,
    },
    client: {
      full_name: STAFF_USER.name,
      official_email: STAFF_USER.email,
      mobile_number: "+91 98220 12345",
      designation: "Training & Placement Officer",
      employee_staff_id: "SVIT-TPO-001",
      access: "master",
      is_master: true,
    },
    kpis: {
      total_students: total,
      eligible_students: eligible.length,
      placed: placed.length,
      in_selection: inSelection.length,
      applied: inSelection.length + placed.length,
      avg_cgpa: Number(avgCgpa.toFixed(2)),
      highest_cgpa: Number(highestCgpa.toFixed(2)),
      avg_expected_ctc: Number(avgCtc.toFixed(1)),
      recruiters: activeCompanies.length,
      active_drives: activeDrives.length,
      total_openings: openings,
      super_dream: counts.super_dream,
    },
    funnel: seedFunnel.map((f) => ({ stage: f.stage, value: f.value })),
    monthly: seedMonthly.map((m) => ({ month: m.month, students: m.offers })),
    departments: byDept,
    tiers: TIERS.map((t) => ({ tier: t.tier, label: t.label, count: counts[t.tier] })),
    batch: { year: BATCH_YEAR, students: total },
  };
}

function reportsData(): ReportsData {
  const ov = overview();
  const industryCount: Record<string, number> = {};
  for (const c of seedCompanies) industryCount[c.sector] = (industryCount[c.sector] ?? 0) + 1;
  const tierCount: Record<DriveCompanyTier, number> = { super_dream: 0, dream: 0, core: 0, mass: 0 };
  for (const c of seedCompanies) {
    const tier = TIER_FOR_TIER[c.tier] ?? "core";
    tierCount[tier] += 1;
  }
  return {
    kpis: {
      students: ov.kpis.total_students,
      eligible: ov.kpis.eligible_students,
      placed: ov.kpis.placed,
      rate: Math.round((ov.kpis.placed / Math.max(1, ov.kpis.total_students)) * 100),
      avg_expected_ctc: ov.kpis.avg_expected_ctc,
      recruiters: ov.kpis.recruiters,
      openings: ov.kpis.total_openings,
    },
    monthly: ov.monthly,
    depts: ov.departments,
    industries: Object.entries(industryCount).map(([industry, count]) => ({ industry, count })),
    ctc_bands: seedCtcBands.map((b) => ({ band: b.band, companies: Math.max(1, Math.round(b.students / 20)) })),
    tiers: TIERS.map((t) => ({ tier: t.tier, label: t.label, count: tierCount[t.tier] })),
    batch: ov.batch,
  };
}

function leaderboard(): LeaderboardResponse {
  const ranked = [...seedStudentsRecords].sort((a, b) => (b.performance_score ?? 0) - (a.performance_score ?? 0));
  ranked.forEach((r, i) => {
    r.overall_rank = i + 1;
    const deptCount = ranked.filter((x) => x.department === r.department).length;
    r.department_rank =
      ranked.filter((x) => x.department === r.department && (x.performance_score ?? 0) > (r.performance_score ?? 0)).length + 1;
    r.department_total = deptCount;
  });
  return {
    institution: INSTITUTION_NAME,
    total: ranked.length,
    ranked: ranked.length,
    students: ranked.map((r, i) => ({ ...r, is_self: r.id === STUDENT_USER.id ? false : i === 0 ? true : i % 24 === 0 })),
  };
}

function studentProfile(): CandidateProfilePayload {
  const me = meUser();
  return {
    user: {
      id: me.id,
      email: me.email,
      name: me.name,
      avatar: undefined,
      first_name: "Aarav",
      date_joined: `${BATCH_YEAR - 3}-08-05T09:00:00Z`,
      last_login: nowIso(),
    },
    profile: {
      phone: "+91 98330 55112",
      date_of_birth: "2004-04-12",
      gender: "male",
      college: INSTITUTION_NAME,
      department: "B.Tech",
      program: "B.Tech",
      start_year: BATCH_YEAR - 3,
      end_year: BATCH_YEAR,
      cgpa: 7.8,
      linkedin_url: "https://www.linkedin.com/in/aarav-sharma-demo",
      github_url: "https://github.com/aarav-svit-demo",
      portfolio_url: "",
      skills: ["Java", "Spring Boot", "MySQL", "React", "Problem Solving", "DSA"],
      certifications: ["Google Cloud Digital Leader", "NASSCOM Employability"],
      projects: [
        { name: "Placement Readiness Dashboard", description: "React + Recharts analytics", link: "" },
        { name: "Library Management API", description: "Spring Boot + MySQL", link: "" },
      ],
      internships: [
        { role: "Software Intern", company: "Persistent Systems (Demo)", duration: "Jun–Jul 2025" },
      ],
      preferred_roles: ["SDE-1", "Software Engineer", "Analyst"],
      preferred_locations: ["Pune", "Bengaluru", "Hyderabad"],
      preferred_language: "English",
      expected_ctc: 8,
      time_spent: 54,
      personal_email: "aarav.demo@gmail.com",
      placement_status: "applying",
      placement_eligible: true,
      first_name: "Aarav",
      middle_name: "",
      last_name: "Sharma",
      full_name: "Aarav Sharma",
    },
    ranks: { score: 82, department: 3, overall: 11, total: 168, department_total: 41 },
    performance: {
      score: 82,
      coverage: 74,
      mock_interview: 81,
      mock_interviews: 2,
      self_training: 76,
      chat: 85,
      chat_messages: 46,
      chat_sessions: 3,
      modules: [
        { key: "aplr", label: "Aptitude & Logical Reasoning", score: 78 },
        { key: "communication", label: "Communication Skills", score: 83 },
        { key: "dsa", label: "DSA", score: 71 },
        { key: "mock_interview", label: "Mock Interview", score: 81 },
        { key: "gd", label: "Group Discussion", score: 86 },
      ],
    },
    stats: { chat_sessions: 3, chat_messages: 46 },
    profile_complete: true,
    missing_fields: [],
  };
}

// ── Chat ────────────────────────────────────────────────────────────────

type StoredChatSession = ChatSession & {
  messages: (ChatMessage & { id: number; created_at: string })[];
};

const CHAT_KEY = "sandbox.chats";

function seededChats(): StoredChatSession[] {
  const t = new Date();
  t.setDate(t.getDate() - 1);
  const yday = t.toISOString();
  t.setHours(t.getHours() - 3);
  return [
    {
      id: "chat-demo-1",
      title: "Preparing for the Infosys drive",
      created_at: yday,
      updated_at: nowIso(),
      message_count: 4,
      older_available: false,
      messages: [
        { id: 1, role: "user", content: "I have an Infosys Systems Engineer drive next week. How do I prepare?", created_at: yday },
        { id: 2, role: "assistant", content: "Great to see you prepping early! Start with the aptitude basics — percentages, ratios and data interpretation are the most frequent. Then run a couple of mock interviews with us so you get feedback on how you explain your projects.", created_at: yday },
        { id: 3, role: "user", content: "Which topics should I focus on for the online assessment?", created_at: yday },
        { id: 4, role: "assistant", content: "Focus order: (1) ApTitude — time & work, percentages, syllogisms. (2) English — grammar and reading comprehension. (3) Technical — OOP, SQL basics and one solid Data Structures topic. Practise with the APLR module here and check the Infosys-specific pointers under Tutorials.", created_at: yday },
      ],
    },
  ];
}

function allChats(): StoredChatSession[] {
  const stored = readJson<StoredChatSession[]>(CHAT_KEY, []);
  return stored.length ? stored : seededChats();
}

function saveChats(chats: StoredChatSession[]): void {
  writeJson(CHAT_KEY, chats);
}

function demoChatReply(message: string, title: string): string {
  const m = message.toLowerCase();
  if (/(resume|cv)/.test(m))
    return "For your resume: keep it to one page, lead with impact (“built X that cut Y by Z%”), and always tailor it to the role. I can review specific bullets if you paste them here.";
  if (/(interview|hr round)/.test(m))
    return "Mock interviews are your lever here. Start one from the Mock Interview tab — pick Persistent or TCS, practise the STAR method, and review the transcript feedback afterwards.";
  if (/(salary|package|ctc)/.test(m))
    return "Most entry roles in this drive season fall between 6.5–11 LPA. Negotiation happens after an offer — focus signals: aptitude accuracy, code-share cleanliness and confident communication.";
  if (/(aptitude|math|quant)/.test(m))
    return "Try the APLR module for a question, use the hint feature when stuck, and re-solve any question you got wrong within 48 hours. Speed grows with volume over ~10 sessions.";
  if (/(gd|group discussion)/.test(m))
    return "Group Discussions reward structure over loudness. Open with a crisp stand, take turns, and summarise at the end. Start a practice round from GD Training — our AI panel simulates the debate.";
  if (/(weak|strengt)/.test(m))
    return "Honest self-awareness scores big. Name one technical strength, one to improve, and one behavioural trait — then give evidence for each with a short example.";
  return `Noted — I've added "${title}" to your practice plan. Keep messages short and specific (ask about a topic, a company, or a mock result) and I'll give you the next focused step.`;
}

function handleChatPost(body: Record<string, unknown>): {
  reply: string;
  session_id: string;
  title: string;
  translation?: string;
  preferred_language?: string;
} {
  const chats = allChats();
  const message = typeof body.message === "string" ? body.message : "";
  const incoming = typeof body.session_id === "string" ? body.session_id : null;
  let session = incoming ? chats.find((c) => c.id === incoming) : null;
  const isNew = !session;
  const title = (typeof body.title === "string" && body.title.trim()) ? body.title : isNew ? message.slice(0, 60) || uid("chat") : session!.title;
  if (!session) {
    session = {
      id: uid("chat"),
      title,
      created_at: nowIso(),
      updated_at: nowIso(),
      message_count: 0,
      older_available: false,
      messages: [],
    };
    chats.unshift(session);
  }
  const reply = demoChatReply(message, title);
  session.messages.push({ id: session.messages.length + 1, role: "user", content: message, created_at: nowIso() });
  session.messages.push({ id: session.messages.length + 1, role: "assistant", content: reply, translation: undefined, created_at: nowIso() });
  session.message_count = session.messages.length;
  session.updated_at = nowIso();
  saveChats(chats);
  return { reply, session_id: session.id, title: session.title, preferred_language: "English" };
}

// ── Mock interviews ─────────────────────────────────────────────────────

const MOCK_KEY = "sandbox.interviews";

const PANELISTS: { id: string; name: string; gender: "female" | "male"; avatar: string }[] = [
  { id: "maya", name: "Maya", gender: "female", avatar: panelistPhoto("maya") },
  { id: "albert", name: "Albert", gender: "male", avatar: panelistPhoto("albert") },
  { id: "ada", name: "Ada", gender: "female", avatar: panelistPhoto("ada") },
  { id: "peter", name: "Peter", gender: "male", avatar: panelistPhoto("peter") },
  { id: "daniel", name: "Daniel", gender: "male", avatar: panelistPhoto("daniel") },
  { id: "carl", name: "Carl", gender: "male", avatar: panelistPhoto("carl") },
  { id: "atlas", name: "Atlas", gender: "male", avatar: panelistPhoto("atlas") },
];

const INTERVIEW_QUESTIONS = [
  "Walk me through your final-year project. What problem does it solve and what was your specific contribution?",
  "Explain a data structure you used recently and why you chose it over the alternatives.",
  "Tell me about a time you worked in a team under a tight deadline.",
  "What do you know about this company's products, and why do you want to join us?",
  "Describe a bug you debugged that took longer than expected. How did you resolve it?",
];

const INTERVIEW_RESULTS: Record<string, string> = {
  "How would you rate your preparation for this role?": "Solid fundamentals with good project depth; could improve on behavioural stories.",
};

function seededInterviews(): MockInterviewDetail[] {
  return [
    {
      id: "mi-demo-1",
      company_name: "Persistent Systems",
      role: "SDE-1",
      questions: INTERVIEW_QUESTIONS.slice(0, 3),
      duration: "standard",
      panelists: ["maya", "albert"],
      panelist_response: {
        maya: "Clear project narrative. Keep your STAR examples closer to the questions asked.",
        albert: "Good technical reasoning. Practise explaining trade-offs faster.",
      },
      suspection: 0,
      status: "completed",
      created_at: `${BATCH_YEAR}-08-20T10:30:00Z`,
      updated_at: `${BATCH_YEAR}-08-20T10:45:00Z`,
      message_count: 6,
      messages: [
        { id: 1, role: "assistant", panelist: "maya", content: "Good morning Aarav! I'm Maya. Let's start — walk me through your final-year project.", created_at: `${BATCH_YEAR}-08-20T10:30:10Z` },
        { id: 2, role: "user", panelist: undefined, content: "Morning! My project is a campus placement readiness dashboard..." },
        { id: 3, role: "assistant", panelist: "albert", content: "Nice. Which data structure did you rely on for rankings and why?", created_at: `${BATCH_YEAR}-08-20T10:34:00Z` },
        { id: 4, role: "user", panelist: undefined, content: "A priority queue backed by a heap, because ranking updates are frequent." },
        { id: 5, role: "assistant", panelist: "maya", content: "Good choice. One more — tell me about a team deadline you handled.", created_at: `${BATCH_YEAR}-08-20T10:37:00Z` },
        { id: 6, role: "user", panelist: undefined, content: "During our hackathon..." },
      ],
      analysis: {
        id: "mi-an-1",
        company_name: "Persistent Systems",
        role: "SDE-1",
        created_at: `${BATCH_YEAR}-08-20T10:45:00Z`,
        metrics: [
          { dimension: "Communication", description: "How clearly you explain ideas", percentage: 82 },
          { dimension: "Technical Depth", description: "Accuracy of technical reasoning", percentage: 76 },
          { dimension: "Problem Solving", description: "Structure of your approach", percentage: 79 },
          { dimension: "Behavioural", description: "Confidence in situational answers", percentage: 71 },
          { dimension: "Company Fit", description: "Alignment with role and values", percentage: 68 },
        ],
        swot: {
          strengths: "Clear, structured answers with concrete project evidence.",
          weaknesses: "Behavioural answers lack a formal STAR structure.",
          opportunities: "Strong project portfolio to map onto the company's product lines.",
          threats: "Slow response time on design trade-off questions.",
        },
      },
    },
  ];
}

function mockInterviews(): MockInterviewDetail[] {
  const stored = readJson<MockInterviewDetail[]>(MOCK_KEY, []);
  return stored.length ? stored : seededInterviews();
}

function saveInterviews(list: MockInterviewDetail[]): void {
  writeJson(MOCK_KEY, list);
}

function computeInterviewAnalysis(i: MockInterviewDetail): MockInterviewAnalysis {
  const metrics = [
    { dimension: "Communication", description: "How clearly you explain ideas", percentage: 74 + (i.message_count % 15) },
    { dimension: "Technical Depth", description: "Accuracy of technical reasoning", percentage: 66 + ((i.message_count * 3) % 22) },
    { dimension: "Problem Solving", description: "Structure of your approach", percentage: 70 + ((i.message_count * 5) % 20) },
    { dimension: "Behavioural", description: "Confidence in situational answers", percentage: 63 + ((i.message_count * 7) % 24) },
    { dimension: "Company Fit", description: "Alignment with role and values", percentage: 60 + ((i.message_count * 11) % 28) },
  ];
  return {
    id: uid("an"),
    company_name: i.company_name,
    role: i.role,
    created_at: nowIso(),
    metrics,
    swot: {
      strengths: "Confident delivery with real project examples.",
      weaknesses: "A few answers drifted off-question; practise tighter closes.",
      opportunities: "Strong coding base gives you an edge in technical rounds.",
      threats: "Star setups could be sharper for behavioural questions.",
    },
  };
}

// ── GD ──────────────────────────────────────────────────────────────────

const GD_KEY = "sandbox.gd";

const GD_PANELISTS = [
  { name: "Ada", gender: "female" },
  { name: "Maya", gender: "female" },
  { name: "Carl", gender: "male" },
  { name: "Peter", gender: "male" },
  { name: "Daniel", gender: "male" },
  { name: "Albert", gender: "male" },
] as const;

const GD_TOPICS = [
  "Is AI a net positive for entry-level employment?",
  "Should college attendance be compulsory for placement drives?",
  "Remote work vs. working from office for freshers.",
  "Are certifications more valuable than a high CGPA?",
  "Will automation eliminate more jobs than it creates?",
  "Is coding the new English in the Indian job market?",
];

const GD_LINES = [
  "I'd add that the real issue isn't the tool itself but how institutions adapt their training around it.",
  "That's a fair point, but let's look at the data — most hiring managers we spoke with weight consistency over flashy numbers.",
  "Building on that, the peer-learning angle matters more than most people admit.",
  "I both agree and disagree — the nuance is in the pace of change versus the pace of training.",
  "Could we keep it practical? For a fresher, the decision tree is: job readiness, then company fit, then package.",
  "Statistically, candidates who practise structured speaking also perform better in technical rounds.",
  "Respectfully, I think we're conflating correlation with causation there.",
  "To summarise our discussion: the synthesis is moderation — prepare hard, but stay human.",
];

function gdChatReply(topic: string, speakerIndex: number): GdChatMessage & { name: string } {
  const speaker = GD_PANELISTS[speakerIndex % GD_PANELISTS.length];
  return { name: speaker.name, content: GD_LINES[speakerIndex % GD_LINES.length] };
}

// ── Question modules (APLR / Technical / DSA / Basic Math / Situational) ─

type Question = { category: string; category_label: string; question: string; answer: string; solution: string };

const QUESTION_BANKS: Record<string, Record<string, Question[]>> = {
  aplr: {
    quantitative: [
      { category: "quantitative", category_label: "Quantitative Aptitude", question: "A train 240 m long crosses a pole in 16 seconds. What is its speed in km/h?", answer: "54", solution: "Speed = distance/time = 240/16 = 15 m/s. 15 × 18/5 = 54 km/h." },
      { category: "quantitative", category_label: "Quantitative Aptitude", question: "If the price of an item rises by 25%, by what % should consumption reduce so that spending stays the same?", answer: "20", solution: "Reduce = 25/125 × 100 = 20%." },
    ],
    logical_reasoning: [
      { category: "logical_reasoning", category_label: "Logical Reasoning", question: "All roses are flowers. Some flowers fade quickly. Which conclusion must follow?", answer: "Some roses may fade quickly", solution: "Roses ⊆ Flowers, and only 'some flowers' fade — so some roses MAY fade but it is not certain." },
    ],
    verbal: [
      { category: "verbal", category_label: "Verbal Ability", question: "Fill in the blank: The committee was ___ of the chairman's proposal.", answer: "approving", solution: "'Approve of' takes the -ing form in context here: 'was approving of'." },
    ],
    puzzle: [
      { category: "puzzle", category_label: "Puzzles", question: "A clock shows 3:15. What is the angle between the hour and minute hands?", answer: "7.5", solution: "Minute hand at 90°. Hour hand = 90 + 15×0.5 = 97.5°. Difference = 7.5°." },
    ],
  },
  technical: {
    basics: [
      { category: "basics", category_label: "Basics", question: "What is the difference between an interface and an abstract class in Java?", answer: "Interface is all-abstract; abstract class can have state", solution: "Interfaces define contracts; abstract classes can carry fields and partial implementations." },
    ],
    arrays_strings: [
      { category: "arrays_strings", category_label: "Arrays & Strings", question: "Given an array, how do you find the maximum product subarray in O(n)?", answer: "Kadane-style two-pass tracking", solution: "Track current max and min (negatives flip sign) and update the global max at each step in a single pass." },
    ],
    searching_sorting: [
      { category: "searching_sorting", category_label: "Searching & Sorting", question: "When is merge sort preferred over quicksort in practice?", answer: "Stable sort or guaranteed O(n log n)", solution: "Merge sort is stable and worst-case O(n log n); quick sort is usually faster but worst-case O(n²)." },
    ],
    recursion: [
      { category: "recursion", category_label: "Recursion", question: "Write the base case thinking for computing Fibonacci numbers.", answer: "f(0)=0, f(1)=1", solution: "Base cases return immediately; otherwise return f(n-1)+f(n-2)." },
    ],
  },
  dsa: {
    arrays_strings: [
      { category: "arrays_strings", category_label: "Arrays & Strings", question: "Find the majority element (appears > n/2 times) in linear time and constant space.", answer: "Boyer-Moore", solution: "Maintain a candidate and a count; cancel pairs, then verify the candidate against the array." },
    ],
    hash_maps: [
      { category: "hash_maps", category_label: "Hash Maps", question: "Check if two strings are anagrams using a hash map.", answer: "Character counts equal", solution: "Count chars of the first, decrement with the second; all counts zero means anagram." },
    ],
    trees: [
      { category: "trees", category_label: "Trees", question: "How do you determine the height of a binary tree?", answer: "max(left,right)+1", solution: "Recursively: height = 1 + max(height(left), height(right)), base case null = 0." },
    ],
    dynamic_programming: [
      { category: "dynamic_programming", category_label: "Dynamic Programming", question: "State the recurrence for the 0/1 knapsack problem.", answer: "dp[i][w] = max(dp[i-1][w], val[i]+dp[i-1][w-wt[i]])", solution: "Either skip the item or take it if weight allows — the classic decision recurrence." },
    ],
  },
  "basic-math": {
    percentage: [
      { category: "percentage", category_label: "Percentage", question: "A student scored 420 out of 600. What is the percentage?", answer: "70", solution: "420/600 × 100 = 70%." },
      { category: "percentage", category_label: "Percentage", question: "After a 20% discount, a laptop costs ₹32,000. What was the original price?", answer: "40000", solution: "80% of price = 32000 → price = 32000 × 100/80 = ₹40,000." },
    ],
    ratio_average: [
      { category: "ratio_average", category_label: "Ratio & Average", question: "The average of 5 numbers is 22. If one number is removed, the average drops to 20. Which number was removed?", answer: "30", solution: "Sum1 = 110, sum2 = 80, removed = 30." },
    ],
    fractions_decimals: [
      { category: "fractions_decimals", category_label: "Fractions & Decimals", question: "Which is larger: 3/7 or 4/9?", answer: "3/7", solution: "Cross-multiply: 3×9 = 27 vs 4×7 = 28? Wait 27 < 28, so 4/9 is larger. 3/7 ≈ 0.428 vs 4/9 ≈ 0.444 → 4/9 larger." },
    ],
    mental_math: [
      { category: "mental_math", category_label: "Mental Math", question: "Compute 15% of 340 in your head.", answer: "51", solution: "10% = 34, 5% = 17, total 51." },
    ],
  },
  situational: {
    workplace_conflict: [
      { category: "workplace_conflict", category_label: "Workplace Conflict", question: "A teammate keeps missing deadlines, pushing work to you. How do you handle it?", answer: "Private check-in first", solution: "Raise it privately, understand the cause, reset expectations, then escalate only if unchanged — not about the person but the outcome." },
    ],
    leadership_dilemma: [
      { category: "leadership_dilemma", category_label: "Leadership Dilemma", question: "Your team is split on approach and time is short. How do you decide next steps?", answer: "Decide with rationale", solution: "Surface both views, pick the lower-risk option that can be reversed, and communicate why — decisiveness with reasoning." },
    ],
    decision_making: [
      { category: "decision_making", category_label: "Decision Making", question: "You get two offers: safer small company vs riskier startup. What is your decision framework?", answer: "Align with goals & risk appetite", solution: "Map each to your career goals, learning curve and risk tolerance, then commit without second-guessing." },
    ],
    ethical_dilemma: [
      { category: "ethical_dilemma", category_label: "Ethical Dilemma", question: "You spot a teammate inflating their work report. What do you do?", answer: "Address directly then report", solution: "First raise it with the person, keep the incident factual, and escalate through the right channel if it continues." },
    ],
  },
};

type ModuleKey = "aplr" | "technical" | "dsa" | "basic-math" | "situational";

const MODULE_FALLBACK_CATEGORY: Record<ModuleKey, string> = {
  aplr: "quantitative",
  technical: "basics",
  dsa: "arrays_strings",
  "basic-math": "percentage",
  situational: "workplace_conflict",
};

type QuestionSession = {
  id: string;
  title: string;
  category: string;
  category_label: string;
  question: string;
  answer: string;
  solution: string;
  status: "active" | "solved" | "gave_up";
  attempts: number;
  hints_used: number;
  points_awarded: number;
  star_rating: number;
  solved_at: string | null;
  created_at: string;
  updated_at: string;
  transcript: { role: "user" | "assistant"; content: string; created_at: string }[];
};

const MODULE_KEY: Record<ModuleKey, string> = {
  aplr: "sandbox.aplr",
  technical: "sandbox.technical",
  dsa: "sandbox.dsa",
  "basic-math": "sandbox.basicmath",
  situational: "sandbox.situational",
};

function questionSessions(key: ModuleKey): QuestionSession[] {
  return readJson<QuestionSession[]>(MODULE_KEY[key], []);
}

function pickQuestion(key: ModuleKey, category?: string): Question {
  const bank = QUESTION_BANKS[key];
  const cat = category && bank[category] ? category : MODULE_FALLBACK_CATEGORY[key];
  const pool = bank[cat] ?? [];
  const used = new Set(questionSessions(key).map((s) => s.question));
  return pool.find((q) => !used.has(q.question)) ?? pool[0] ?? {
    category: cat,
    category_label: cat,
    question: "Describe how you would break down an unfamiliar problem.",
    answer: "Break into sub-problems",
    solution: "Identify inputs/outputs, edge cases, then the simplest correct approach and its time complexity.",
  };
}

function demoInterviewReply(): string {
  const lines = [
    "Thanks. Could you also tell me how you would test your logic under an edge case?",
    "Good. For my next question — describe a time you influenced a decision without authority.",
    "That works. Let's move to a quick technical trade-off — what happens to your approach at scale?",
    "Noted. One behavioural check — how do you react when a deadline slips three days before delivery?",
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

// ── Communication training ──────────────────────────────────────────────

const COMM_KEY = "sandbox.comm";

function seededCommSessions(): CommunicationTrainingSession[] {
  const metrics: Record<string, number> = {
    clarity: 82, fluency: 78, grammar: 84, vocabulary: 79, pronunciation: 81, confidence: 74,
    answer_structure: 76, relevance: 83, speaking_rate: 72, pause_frequency: 68, average_pause_duration: 66,
    filler_words: 71, repeated_words: 75, sentence_restarts: 77, intonation: 80, speech_rhythm: 78,
    voice_modulation: 76, listening_skills: 84, response_quality: 79, professional_tone: 85,
    conversational_skills: 80, vocabulary_diversity: 78, grammar_error_count: 6, pronunciation_accuracy: 83,
    communication_score: 79, workplace_communication_readiness: 81, interview_readiness: 80,
    improvement_rate: 12,
  };
  return [
    {
      id: "comm-demo-1",
      title: "Answering 'Tell me about yourself'",
      status: "completed",
      finalized_at: `${BATCH_YEAR}-08-18T09:00:00Z`,
      created_at: `${BATCH_YEAR}-08-18T08:30:00Z`,
      updated_at: `${BATCH_YEAR}-08-18T09:00:00Z`,
      ...metrics,
      recurring_mistakes: "A few filler words ('like', 'actually') and some long sentences.",
      strengths: "Clear structure and confident tone.",
      areas_for_improvement: "Pause less often; shorten answers to under 90 seconds.",
      ai_recommendations: "Practise the STAR format aloud three times before interviews.",
      practice_priorities: "Record yourself weekly and count filler words.",
      transcript: [
        { role: "user", content: "Tell me about yourself.", created_at: `${BATCH_YEAR}-08-18T08:31:00Z` },
        { role: "assistant", content: "I'm a final-year Computer Engineering student..." , created_at: `${BATCH_YEAR}-08-18T08:34:00Z` },
      ],
    },
  ];
}

function commSessions(): CommunicationTrainingSession[] {
  const stored = readJson<CommunicationTrainingSession[]>(COMM_KEY, []);
  return stored.length ? stored : seededCommSessions();
}

function commMetrics(): Record<string, number> {
  const base: Record<string, number> = {
    clarity: 80, fluency: 78, grammar: 82, vocabulary: 79, pronunciation: 80, confidence: 76,
    answer_structure: 75, relevance: 81, speaking_rate: 73, pause_frequency: 70, average_pause_duration: 68,
    filler_words: 72, repeated_words: 76, sentence_restarts: 78, intonation: 79, speech_rhythm: 77,
    voice_modulation: 77, listening_skills: 83, response_quality: 80, professional_tone: 84,
    conversational_skills: 79, vocabulary_diversity: 78, grammar_error_count: 7, pronunciation_accuracy: 82,
    communication_score: 79, workplace_communication_readiness: 80, interview_readiness: 79, improvement_rate: 10,
  };
  return base;
}

// ── English training (speaking skills) ──────────────────────────────────

const ENG_KEY = "sandbox.english";

function seededEnglishSessions(): EnglishTrainingSession[] {
  return [
    {
      id: "eng-demo-1",
      title: "Describe your college campus",
      status: "completed",
      finalized_at: `${BATCH_YEAR}-08-16T09:00:00Z`,
      created_at: `${BATCH_YEAR}-08-16T08:30:00Z`,
      updated_at: `${BATCH_YEAR}-08-16T09:00:00Z`,
      clarity: 84, structure: 82, grammar: 85, vocabulary: 80, spelling: 88, conciseness: 78,
      task_focus: 86, professional_tone: 83, writing_score: 83,
      strengths: "Clear organisation and accurate grammar.",
      areas_for_improvement: "Use more precise vocabulary; vary sentence length.",
      ai_recommendations: "Rewrite your last answer without starting consecutive sentences the same way.",
      recurring_mistakes: "Occasional run-on sentences.",
      mistakes: [
        { turn_index: 1, category: "Grammar", original: "Our campus have a library.", corrected: "Our campus has a library.", explanation: "Subject–verb agreement: campus (singular) takes 'has'." },
      ],
      mistake_count: 1,
      transcript: [
        { role: "user", content: "Describe your college campus in 4-5 sentences.", created_at: `${BATCH_YEAR}-08-16T08:31:00Z` },
        { role: "assistant", content: "Our campus is compact but lively. The central library and open-air amphitheatre are my favourite spots...", created_at: `${BATCH_YEAR}-08-16T08:33:00Z` },
      ],
    },
  ];
}

function englishSessions(): EnglishTrainingSession[] {
  const stored = readJson<EnglishTrainingSession[]>(ENG_KEY, []);
  return stored.length ? stored : seededEnglishSessions();
}

function englishMetrics(): EnglishTrainingSession {
  return {
    id: uid("eng"),
    title: "English Trainer session",
    status: "active",
    finalized_at: null,
    created_at: nowIso(),
    updated_at: nowIso(),
    clarity: 82, structure: 80, grammar: 84, vocabulary: 79, spelling: 87, conciseness: 78,
    task_focus: 85, professional_tone: 82, writing_score: 82,
    strengths: "Consistent grammar and clear structure.",
    areas_for_improvement: "Broaden vocabulary; avoid repetition.",
    ai_recommendations: "Practise synonyms for common verbs and read aloud daily.",
    recurring_mistakes: "",
    mistakes: [],
    mistake_count: 0,
  };
}

// ── Notifications ───────────────────────────────────────────────────────

const NOTIF_READ_KEY = "sandbox.notifRead";

function allNotifications(): { items: NotificationItem[]; unread: number } {
  const readIds = new Set(readJson<string[]>(NOTIF_READ_KEY, []));
  const items: NotificationItem[] = [
    ...seedNotifications.map((n) => ({
      id: n.id,
      sender: n.category === "System" ? ("TalentBro Platform" as const) : ("Placement Cell" as const),
      title: n.title,
      body: n.body,
      pinned: false,
      important: n.priority === "High",
      read: readIds.has(n.id) ? true : n.read,
      time: n.time,
      created_at: `${BATCH_YEAR}-08-01T09:00:00Z`,
      redirect_path: "/dashboard",
    })),
    ...broadcastSeed.map((b) => ({
      id: b.id,
      sender: b.sender,
      title: b.title,
      body: b.body,
      pinned: !!b.pinned,
      important: !!b.important,
      read: readIds.has(b.id) ? true : b.read,
      time: b.time,
      created_at: `${BATCH_YEAR}-08-01T10:00:00Z`,
      redirect_path: "/dashboard",
    })),
  ];
  return { items, unread: items.filter((i) => !i.read).length };
}

// ── Dispatcher ──────────────────────────────────────────────────────────

export async function sandboxApiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  const p = path.replace(/^\/api/, "");
  const body: Record<string, unknown> =
    typeof init.body === "string" && init.body
      ? safeParse(init.body)
      : (init.body as Record<string, unknown>) ?? {};

  // me()
  if (p === "/auth/me/" && method === "GET") return { user: meUser() } as T;
  if (p === "/auth/csrf/") return { ok: true } as T;
  if (/^\/auth\/(login|signup|logout|client-onboarding|change-password|delete-account)\/$/.test(p) && method === "POST")
    return { user: meUser(), ok: true } as T;

  // Profile
  if (p === "/auth/profile/" && method === "GET") return studentProfile() as T;
  if (p === "/auth/profile/" && method === "PATCH") return studentProfile() as T;
  if (p === "/auth/verify-id-card/" && method === "POST")
    return {
      extracted: { name: "AARAV SHARMA", registration_number: "CO22042", college: INSTITUTION_NAME },
      checks: {
        name: { matched: true, detail: "Name matches college records." },
        registration_number: { matched: true, detail: "Registration number found." },
        college: { matched: true, detail: "College matches." },
      },
      all_matched: true,
    } as T;

  // Institution metadata
  if (p.startsWith("/institutions/companies/")) return { companies: seedCompanies.map((c) => c.name) } as T;
  if (p.startsWith("/candidate/companies/")) return { companies: seedCompanies.map((c) => c.name) } as T;
  if (p.startsWith("/institutions/"))
    return { institutions: [{ name: INSTITUTION_NAME, departments: DEPARTMENTS }] } as T;

  // Dashboard / data
  if (p === "/institution/overview/" && method === "GET") return overview() as T;
  if (p === "/drives/" && method === "GET")
    return { drives: seedDrivesRecords, count: seedDrivesRecords.length } as T;
  if (p === "/companies/" && method === "GET")
    return { companies: seedCompaniesRecords, count: seedCompaniesRecords.length } as T;
  if (p === "/companies/create/" && method === "POST") {
    const made = { ...seedCompaniesRecords[0], id: Date.now(), company_name: String(body.company_name ?? "Demo Company") };
    return { company: made } as T;
  }
  if (p.startsWith("/students/") && method === "GET") {
    const params = parseQuery(p);
    const query = { ...body, ...params };
    if (typeof query.min_cgpa === "string") query.min_cgpa = Number(query.min_cgpa);
    return delay(filterStudents(query)) as T;
  }
  if (p === "/readiness/leaderboard/" && method === "GET") return leaderboard() as T;
  if (p === "/reports/" && method === "GET") return reportsData() as T;

  // Notifications
  if (p === "/notifications/" && method === "GET") return allNotifications() as T;
  if (p === "/notifications/mark-read/" && method === "POST") {
    const all = body.all === true;
    const id = typeof body.notification_id === "string" ? body.notification_id : null;
    const { items } = allNotifications();
    const current = readJson<string[]>(NOTIF_READ_KEY, []);
    const next = new Set(current);
    if (all) for (const i of items) next.add(i.id);
    else if (id) next.add(id);
    writeJson(NOTIF_READ_KEY, Array.from(next));
    return { ok: true } as T;
  }

  // Chat
  if (p === "/chat/" && method === "POST")
    return delay(handleChatPost(body)) as T;
  if (p === "/chat/sessions/" && method === "GET")
    return delay({ sessions: allChats().map(({ messages: _, ...s }) => s) }) as T;
  if (/^\/chat\/sessions\/([^/]+)\/(\?.*)?$/.test(p) && method === "GET") {
    const id = p.match(/^\/chat\/sessions\/([^/]+)\/(\?.*)?$/)?.[1] ?? "";
    const session = allChats().find((c) => c.id === id);
    if (!session)
      return delay({ session: { id, messages: [], title: "Chat", created_at: nowIso(), updated_at: nowIso(), message_count: 0 } }) as T;
    return delay({ session }) as T;
  }
  if (/^\/chat\/sessions\/([^/]+)\/$/.test(p) && method === "DELETE") {
    const id = p.match(/^\/chat\/sessions\/([^/]+)\/$/)?.[1] ?? "";
    saveChats(allChats().filter((c) => c.id !== id));
    return delay({ ok: true }) as T;
  }
  if (p === "/chat/summarize/" && method === "POST")
    return delay({
      summary: "You asked about preparing for the Infosys drive and the aptitude topics to prioritise.",
      changed: ["preferred_roles"],
    }) as T;
  if (p === "/chat/translate/" && method === "POST") {
    const texts = Array.isArray(body.texts) ? (body.texts as string[]) : [];
    return delay({ translations: texts }) as T;
  }

  // Communication training
  if (p === "/chat/communication/" && method === "POST") {
    const message = typeof body.message === "string" ? body.message : "";
    const s = commSessions();
    const existing = typeof body.session_id === "string" ? s.find((x) => x.id === body.session_id) : null;
    if (existing) {
      existing.transcript = [...(existing.transcript ?? []), { role: "user" as const, content: message, created_at: nowIso() }];
      saveComm(s);
      return delay({ reply: demoCommunicationReply(message), session_id: existing.id, title: existing.title }) as T;
    }
    const session: CommunicationTrainingSession = {
      ...commMetrics(),
      id: uid("comm"),
      title: "Communication Training",
      status: "active",
      finalized_at: null,
      created_at: nowIso(),
      updated_at: nowIso(),
      transcript: [{ role: "user", content: message, created_at: nowIso() }],
    };
    s.unshift(session);
    saveComm(s);
    return delay({ reply: demoCommunicationReply(message), session_id: session.id, title: session.title }) as T;
  }
  if (p === "/chat/communication/turns/" && method === "POST") {
    const turns = Array.isArray(body.turns) ? (body.turns as { role: string; content: string }[]) : [];
    const s = commSessions();
    const existing = typeof body.session_id === "string" ? s.find((x) => x.id === body.session_id) : null;
    if (existing) {
      const session = existing;
      session.transcript = [...(session.transcript ?? [])];
      for (const t of turns) {
        session.transcript.push({ role: t.role as "user" | "assistant", content: t.content, created_at: nowIso() });
      }
      session.updated_at = nowIso();
      saveComm(s);
      return delay({ session_id: session.id, title: session.title }) as T;
    }
    const session: CommunicationTrainingSession = { ...commMetrics(), id: uid("comm"), title: "Communication Training", status: "active", finalized_at: null, created_at: nowIso(), updated_at: nowIso(), transcript: turns.map((t) => ({ role: t.role as "user" | "assistant", content: t.content, created_at: nowIso() })) };
    s.unshift(session);
    saveComm(s);
    return delay({ session_id: session.id, title: session.title }) as T;
  }
  if (p === "/chat/communication/finalize/" && method === "POST") {
    const s = commSessions();
    const existing = typeof body.session_id === "string" ? s.find((x) => x.id === body.session_id) : null;
    if (existing) {
      existing.status = "completed";
      existing.finalized_at = nowIso();
      Object.assign(existing, commMetrics());
      existing.updated_at = nowIso();
      saveComm(s);
    }
    return delay({ ok: true, session_id: existing?.id ?? "", analyzed: true }) as T;
  }
  if (p === "/chat/communication/history/" && method === "GET")
    return delay({ sessions: commSessions() }) as T;
  if (/^\/chat\/communication\/([^/]+)\/$/.test(p) && method === "GET") {
    const id = p.match(/^\/chat\/communication\/([^/]+)\/$/)?.[1] ?? "";
    return delay({ session: commSessions().find((x) => x.id === id) }) as T;
  }

  // English / speaking skills
  if (p === "/speaking-skills/start/" && method === "POST") {
    const sessions = englishSessions();
    const session: EnglishTrainingSession = { ...englishMetrics(), id: uid("eng"), title: "English Trainer", status: "active", created_at: nowIso(), updated_at: nowIso() };
    sessions.unshift(session);
    saveEng(sessions);
    return delay({
      reply: "Let's practise: describe your college campus in 4-5 clear sentences. Speak or type your answer.",
      reused: false,
      session_id: session.id,
      record: session,
    }) as T;
  }
  if (p === "/speaking-skills/chat/" && method === "POST") {
    const msg = typeof body.message === "string" ? body.message : "";
    return delay({ reply: "Good attempt. Now try one sentence for 'my best achievement', keeping it under 20 words. I'll gently correct any grammar slip.", session_id: "", title: "English Trainer" }) as T;
  }
  if (p === "/speaking-skills/turns/" && method === "POST") return delay({ ok: true }) as T;
  if (p === "/speaking-skills/finalize/" && method === "POST") {
    let sessions = englishSessions();
    const active = sessions.find((x) => x.status === "active") ?? sessions[0];
    if (active) {
      active.status = "completed";
      active.finalized_at = nowIso();
      Object.assign(active, englishMetrics(), { id: active.id, title: active.title, transcript: active.transcript });
      active.updated_at = nowIso();
      saveEng(sessions);
    }
    return delay({ ok: true, analyzed: true }) as T;
  }
  if (p === "/speaking-skills/" && method === "GET") {
    const sessions = englishSessions();
    const latest = sessions[0] ?? englishMetrics();
    return delay({ record: { practice_count: sessions.length, last_practiced_at: latest.finalized_at, created_at: latest.created_at, updated_at: latest.updated_at, clarity: latest.clarity, structure: latest.structure, grammar: latest.grammar, vocabulary: latest.vocabulary, spelling: latest.spelling, conciseness: latest.conciseness, task_focus: latest.task_focus, professional_tone: latest.professional_tone, writing_score: latest.writing_score, strengths: latest.strengths, areas_for_improvement: latest.areas_for_improvement, ai_recommendations: latest.ai_recommendations, recurring_mistakes: latest.recurring_mistakes } }) as T;
  }
  if (p === "/speaking-skills/history/" && method === "GET")
    return delay({ sessions: englishSessions() }) as T;
  if (/^\/speaking-skills\/([^/]+)\/$/.test(p) && method === "GET") {
    const id = p.match(/^\/speaking-skills\/([^/]+)\/$/)?.[1] ?? "";
    return delay({ session: englishSessions().find((x) => x.id === id) }) as T;
  }

  // TTS / transcription helpers
  if (p === "/chat/tts/voices/" && method === "GET") return delay({ voices: [], default: "" }) as T;
  if (p === "/chat/tts/" && method === "POST") {
    throw Object.assign(new Error("TTS unavailable in the sandbox demo."), { status: 503 });
  }
  if (p === "/chat/communication/transcribe/" && method === "POST") {
    return delay({ text: "I believe I am a good fit because my project taught me how to work under deadlines." }) as T;
  }

  // Interviews
  if (p === "/interview/" && method === "GET")
    return delay({ interviews: mockInterviews() }) as T;
  if (p === "/interview/start/" && method === "POST") {
    const interviews = mockInterviews();
    const company = String(body.company_name ?? "Persistent Systems");
    const role = String(body.role ?? "SDE-1");
    const questions = Array.isArray(body.questions) ? (body.questions as string[]).filter(Boolean) : [];
    const qs = questions.length ? [...questions].slice(0, Math.max(1, questions.length)) : INTERVIEW_QUESTIONS.slice(0, 3);
    const panelists = (["maya", "albert"] as string[]).slice(0, Math.min(2, Math.max(1, qs.length)));
    const interview: MockInterviewDetail = {
      id: uid("mi"),
      company_name: company,
      role,
      questions: qs,
      duration: (body.duration as "short" | "standard" | "long") ?? "standard",
      panelists: panelists as MockInterviewDetail["panelists"],
      panelist_response: {},
      suspection: 0,
      status: "active",
      created_at: nowIso(),
      updated_at: nowIso(),
      message_count: 0,
      messages: [
        { id: 1, role: "assistant", panelist: "maya", tone: "warm", content: `Welcome to your ${company} mock interview, Aarav! I'm Maya. Let's begin — ${qs[0]}`, created_at: nowIso() },
      ],
    };
    interviews.unshift(interview);
    saveInterviews(interviews);
    return delay({ interview, reply: interview.messages[0]!.content, panelist: "maya" }) as T;
  }
  if (p === "/interview/reply/" && method === "POST") {
    const id = String(body.interview_id ?? "");
    const answer = String(body.answer ?? "");
    const interviews = mockInterviews();
    const interview = interviews.find((i) => i.id === id);
    if (interview) {
      interview.messages.push({ id: interview.messages.length + 1, role: "user", content: answer, created_at: nowIso() });
      interview.message_count = interview.messages.length;
      const answered = interview.messages.filter((m) => m.role === "user").length;
      const nextQuestion = interview.questions[answered] ?? null;
      const tone = answered % 2 === 0 ? "warm" : "neutral";
      if (nextQuestion) {
        const nextPanelist = interview.panelists[answered % interview.panelists.length] ?? "maya";
        const reply = `Thanks! ${nextQuestion}`;
        interview.messages.push({ id: interview.messages.length + 1, role: "assistant", panelist: nextPanelist, tone, content: reply, created_at: nowIso() });
        interview.message_count = interview.messages.length;
        interview.updated_at = nowIso();
        saveInterviews(interviews);
        return delay({ reply, panelist: nextPanelist, done: false, tone });
      }
      const panelistId = interview.panelists[0] ?? "maya";
      const reply = `That wraps up your ${interview.company_name} interview, Aarav. Well done — I've locked in your transcript and analysis. Review the feedback under Interview Analysis.`;
      interview.messages.push({ id: interview.messages.length + 1, role: "assistant", panelist: panelistId, tone: "warm", content: reply, created_at: nowIso() });
      interview.status = "completed";
      interview.updated_at = nowIso();
      const analysis = computeInterviewAnalysis(interview);
      interview.analysis = analysis;
      saveInterviews(interviews);
      return delay({ reply, panelist: panelistId, done: true, tone: "warm", analysis });
    }
    return delay({ reply: "Interview not found.", panelist: "maya", done: true });
  }
  if (/^\/interview\/([^/]+)\/resume\/$/.test(p) && method === "POST") {
    const id = p.match(/^\/interview\/([^/]+)\/resume\/$/)?.[1] ?? "";
    const interview = mockInterviews().find((i) => i.id === id);
    if (interview) {
      const answered = interview.messages.filter((m) => m.role === "user").length;
      const nextQuestion = interview.questions[answered] ?? "All questions were already covered — let's wrap up.";
      const panelist = interview.panelists[answered % interview.panelists.length] ?? "maya";
      return delay({ reply: nextQuestion, panelist, done: answered >= interview.questions.length, tone: "neutral" });
    }
    return delay({ reply: "Session not found.", panelist: "maya", done: true });
  }
  if (/^\/interview\/([^/]+)\/analysis\/$/.test(p) && method === "GET") {
    const id = p.match(/^\/interview\/([^/]+)\/analysis\/$/)?.[1] ?? "";
    const interview = mockInterviews().find((i) => i.id === id);
    return delay({ analysis: interview?.analysis ?? null }) as T;
  }
  if (/^\/interview\/([^/]+)\/$/.test(p) && method === "GET") {
    const id = p.match(/^\/interview\/([^/]+)\/$/)?.[1] ?? "";
    const interview = mockInterviews().find((i) => i.id === id);
    if (interview) return delay({ interview }) as T;
    return delay({ interview: null }) as T;
  }
  if (/^\/interview\/([^/]+)\/$/.test(p) && method === "PATCH") {
    const id = p.match(/^\/interview\/([^/]+)\/$/)?.[1] ?? "";
    const interviews = mockInterviews();
    const interview = interviews.find((i) => i.id === id);
    if (interview) {
      if (body.status === "completed") interview.status = "completed";
      if (body.suspection === true) interview.suspection = Math.min(100, interview.suspection + 25);
      interview.updated_at = nowIso();
      saveInterviews(interviews);
      return delay({ interview }) as T;
    }
    return delay({ interview: null }) as T;
  }
  if (/^\/interview\/([^/]+)\/$/.test(p) && method === "DELETE") {
    const id = p.match(/^\/interview\/([^/]+)\/$/)?.[1] ?? "";
    saveInterviews(mockInterviews().filter((i) => i.id !== id));
    return delay({ ok: true }) as T;
  }

  // GD training
  if (p === "/gd/panelists/" && method === "GET")
    return delay({ panelists: GD_PANELISTS }) as T;
  if (p === "/gd/topic/" && method === "GET") {
    const used = new Set(readJson<GdTrainingRecord[]>(GD_KEY, []).map((s) => s.topic));
    const fresh = GD_TOPICS.find((t) => !used.has(t)) ?? GD_TOPICS[0];
    return delay({ topic: fresh }) as T;
  }
  if (p === "/gd/chat/" && method === "POST") {
    const transcript = Array.isArray(body.transcript) ? (body.transcript as { name: string; content: string }[]) : [];
    return delay(gdChatReply(String(body.topic ?? ""), transcript.length)) as T;
  }
  if (p === "/gd/complete/" && method === "POST") {
    const gd = readJson<GdTrainingRecord[]>(GD_KEY, []);
    const topic = String(body.topic ?? "");
    const result = (body.result as { criteria: { label: string; score: number }[]; overall: number; grade: string; strengths: string[]; improvementAreas: string[] }) ?? {
      criteria: [], overall: 70, grade: "B", strengths: [], improvementAreas: [],
    };
    const record: GdTrainingRecord = {
      id: uid("gd"),
      title: topic.slice(0, 60),
      topic,
      status: "completed",
      phase: "completed",
      duration_minutes: 8,
      ended_at: nowIso(),
      grade: result.grade,
      overall_score: result.overall,
      criteria: result.criteria,
      strengths: result.strengths,
      improvement_areas: result.improvementAreas,
      created_at: nowIso(),
      updated_at: nowIso(),
      message_count: (Array.isArray(body.transcript) ? body.transcript.length : 0) + 1,
      participants: Array.isArray(body.participants) ? (body.participants as GdTrainingRecord["participants"]) : undefined,
      overall_summary: `Round on "${topic}". You opened with a clear view, used evidence and helped close the discussion with a summary.`,
      transcript: (Array.isArray(body.transcript) ? body.transcript : []).map((m, idx) => ({
        role: (m as { from: string }).from === "self" ? ("user" as const) : ("assistant" as const),
        speaker: m.name,
        content: m.content,
        created_at: null,
        ...(idx === 0 ? {} : {}),
      })),
    };
    gd.unshift(record);
    writeJson(GD_KEY, gd);
    return delay({ id: record.id }) as T;
  }
  if (p === "/gd/history/" && method === "GET")
    return delay({ sessions: readJson<GdTrainingRecord[]>(GD_KEY, []) }) as T;
  if (/^\/gd\/([^/]+)\/$/.test(p) && method === "GET") {
    const id = p.match(/^\/gd\/([^/]+)\/$/)?.[1] ?? "";
    return delay({ session: readJson<GdTrainingRecord[]>(GD_KEY, []).find((x) => x.id === id) }) as T;
  }

  // Question modules
  const moduleKeys: ModuleKey[] = ["aplr", "technical", "dsa", "basic-math", "situational"];
  for (const key of moduleKeys) {
    if (p === `/${key}/start/` && method === "POST") {
      const sessions = questionSessions(key);
      const category = typeof body.category === "string" ? body.category : MODULE_FALLBACK_CATEGORY[key];
      const q = pickQuestion(key, category || undefined);
      const session: QuestionSession = {
        id: uid(key),
        title: q.question.slice(0, 60),
        category: q.category,
        category_label: q.category_label,
        question: q.question,
        answer: q.answer,
        solution: q.solution,
        status: "active",
        attempts: 0,
        hints_used: 0,
        points_awarded: 0,
        star_rating: 0,
        solved_at: null,
        created_at: nowIso(),
        updated_at: nowIso(),
        transcript: [],
      };
      sessions.unshift(session);
      saveSessions(key, sessions);
      return delay({
        session,
        message: `Question ${sessions.length} — ${q.question}`,
      }) as T;
    }
    if (p === `/${key}/chat/` && method === "POST") {
      const sessions = questionSessions(key);
      const session = sessions.find((s) => s.id === String(body.session_id ?? ""));
      if (!session) return delay({ session_id: "", reply: "Session not found.", solved: false, gave_up: false, closed: false, points_awarded: 0, star_rating: 0 }) as T;
      const answer = String(body.message ?? "");
      session.attempts += 1;
      session.transcript.push({ role: "user", content: answer, created_at: nowIso() });
      let reply: string;
      let solved = false;
      let points = 0;
      let stars = 0;
      if (session.attempts >= 3) {
        solved = true;
        points = 100;
        stars = 3;
        session.status = "solved";
        session.points_awarded = points;
        session.star_rating = stars;
        session.solved_at = nowIso();
        reply = `Great attempt! The expected answer: ${session.answer}. ${session.solution}`;
        session.transcript.push({ role: "assistant", content: reply, created_at: nowIso() });
      } else {
        const hints = [
          "Hint: break the problem into smaller steps and re-read what's being asked.",
          `You're on attempt ${session.attempts}/3. Try rephrasing your answer using the units/options in the question.`,
        ];
        reply = hints[Math.min(session.attempts - 1, hints.length - 1)]!;
        session.transcript.push({ role: "assistant", content: reply, created_at: nowIso() });
      }
      session.updated_at = nowIso();
      saveSessions(key, sessions);
      return delay({
        session_id: session.id,
        reply,
        solved,
        gave_up: false,
        closed: solved,
        points_awarded: points,
        star_rating: stars,
      }) as T;
    }
    if (p === `/${key}/skip/` && method === "POST") {
      const sessions = questionSessions(key);
      const id = typeof body.session_id === "string" ? body.session_id : null;
      const target = id ? sessions.find((s) => s.id === id) : sessions.find((s) => s.status === "active");
      if (target) {
        target.status = "gave_up";
        target.updated_at = nowIso();
        saveSessions(key, sessions);
        return delay({ ok: true, skipped: target.id, was_active: true }) as T;
      }
      return delay({ ok: true, skipped: "0", was_active: false }) as T;
    }
    if (p === `/${key}/history/` && method === "GET")
      return delay({ sessions: questionSessions(key) }) as T;
    if (new RegExp(`^/${key}/([^/]+)/$`).test(p) && method === "GET") {
      const id = p.match(new RegExp(`^/${key}/([^/]+)/$`))?.[1] ?? "";
      return delay({ session: questionSessions(key).find((s) => s.id === id) }) as T;
    }
  }

  throw new Error(`[sandbox] Unhandled ${method} ${path}`);
}

function filterStudents(query: Record<string, unknown>): StudentsResponse {
  const q = typeof query.q === "string" ? query.q.toLowerCase() : "";
  const dept = typeof query.dept === "string" ? query.dept : "";
  const status = typeof query.status === "string" ? query.status : "";
  const minCgpa = typeof query.min_cgpa === "number" ? query.min_cgpa : 0;
  const eligible = query.eligible === true || query.eligible === "1";
  const sort = typeof query.sort === "string" ? query.sort : "name";

  let rows = [...seedStudentsRecords];
  if (q) rows = rows.filter((s) => s.full_name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
  if (dept && dept !== "All") rows = rows.filter((s) => s.department === dept);
  if (status) {
    if (status === "placed") rows = rows.filter((s) => s.placement_status === "placed");
    else if (status === "applying") rows = rows.filter((s) => s.placement_status === "applying" || s.placement_status === "shortlisted");
    else if (status === "not_started") rows = rows.filter((s) => s.placement_status === "not_started");
  }
  if (minCgpa > 0) rows = rows.filter((s) => (s.cgpa ?? 0) >= minCgpa);
  if (eligible) rows = rows.filter((s) => s.placement_eligible);

  rows = rows
    .map((s, i) => {
      const ranked = [...seedStudentsRecords].sort((a, b) => (b.performance_score ?? 0) - (a.performance_score ?? 0));
      const overall = ranked.findIndex((r) => r.id === s.id) + 1;
      const deptRanked = ranked.filter((r) => r.department === s.department);
      const dRank = deptRanked.findIndex((r) => r.id === s.id) + 1;
      return { ...s, overall_rank: overall, department_rank: dRank, overall_total: ranked.length, department_total: deptRanked.length };
    })
    .sort((a, b) => {
      if (sort === "cgpa") return (b.cgpa ?? 0) - (a.cgpa ?? 0);
      if (sort === "expected_ctc") return (b.expected_ctc ?? 0) - (a.expected_ctc ?? 0);
      if (sort === "performance") return (b.performance_score ?? 0) - (a.performance_score ?? 0);
      return a.full_name.localeCompare(b.full_name);
    });

  return { students: rows, count: rows.length };
}

function saveSessions(key: ModuleKey, sessions: QuestionSession[]): void {
  writeJson(MODULE_KEY[key], sessions);
}

function saveComm(sessions: CommunicationTrainingSession[]): void {
  writeJson(COMM_KEY, sessions);
}

function saveEng(sessions: EnglishTrainingSession[]): void {
  writeJson(ENG_KEY, sessions);
}

function demoCommunicationReply(message: string): string {
  const m = message.toLowerCase();
  if (/(yourself|introduce)/.test(m))
    return "Nice structured intro! Now let's sharpen it — try compressing that into two sentences that end with a hook about the role you want.";
  if (/(project|achievement)/.test(m))
    return "Good — that STAR setup is close. Add a measurable result ('reduced load time by 30%') and keep it under 60 seconds.";
  if (/(future|career|goal)/.test(m))
    return "Strong answer. For interviews, tie your goal to the company's direction in the final sentence so it feels mutually aligned.";
  return "Thanks, that was articulate. Watch your filler words and try a slightly slower pace on the last sentence — otherwise excellent.";
}

function parseQuery(path: string): Record<string, string> {
  const idx = path.indexOf("?");
  if (idx < 0) return {};
  const params: Record<string, string> = {};
  for (const [key, value] of new URLSearchParams(path.slice(idx)).entries()) {
    params[key] = value;
  }
  return params;
}

function safeParse(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}