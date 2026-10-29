// Pre-typed AI prompts bank + matcher for sandbox/demo
export const AI_PROMPT_BANK = [
  // DSA
  { id: "dsa-1", category: "dsa", tags: ["arrays","majority"], title: "Majority element", prompt: "Find majority element (appears > n/2) using Boyer-Moore", answer: "Boyer-Moore voting: track candidate+count, cancel pairs; verify. O(n) time, O(1) space.", profileAware: false },
  { id: "dsa-2", category: "dsa", tags: ["strings","anagram"], title: "Anagram check", prompt: "Check if two strings are anagrams", answer: "Build frequency map for first, decrement for second; all zero or equal lengths.", profileAware: false },
  { id: "dsa-3", category: "dsa", tags: ["trees","height"], title: "Binary tree height", prompt: "Find height of binary tree", answer: "height = 1+max(height(left), height(right)); base null => 0.", profileAware: false },
  { id: "dsa-4", category: "dsa", tags: ["dp","knapsack"], title: "0/1 knapsack recurrence", prompt: "0/1 knapsack recurrence", answer: "dp[i][w]=max(dp[i-1][w], val[i]+dp[i-1][w-wt[i]])", profileAware: false },
  // Aptitude
  { id: "aplr-1", category: "aplr", tags: ["quant","speed"], title: "Train speed", prompt: "Train 240m crosses pole in 16s; speed in km/h?", answer: "240/16=15 m/s = 15*18/5=54 km/h.", profileAware: false },
  { id: "aplr-2", category: "aplr", tags: ["quant","discount"], title: "Consumption after 25% rise", prompt: "If price rises 25%, by what % should consumption reduce to keep spending same?", answer: "25/125*100=20% reduction.", profileAware: false },
  { id: "aplr-3", category: "aplr", tags: ["reasoning","syllogism"], title: "Syllogism conclusion", prompt: "All roses flowers. Some flowers fade. Conclusion?", answer: "Some roses may fade quickly (not certain).", profileAware: false },
  // Technical
  { id: "tech-1", category: "technical", tags: ["java","oop"], title: "Interface vs abstract class", prompt: "Interface vs abstract class in Java", answer: "Interface: contract, all abstract methods (Java 8+ defaults); Abstract class: can have state/methods, single inheritance.", profileAware: false },
  { id: "tech-2", category: "technical", tags: ["sql","joins"], title: "INNER vs LEFT JOIN", prompt: "INNER JOIN vs LEFT JOIN", answer: "INNER returns matching rows; LEFT returns all left rows + matching right rows (null if none).", profileAware: false },
  // HR
  { id: "hr-1", category: "hr", tags: ["intro","about"], title: "Tell me about yourself", prompt: "Tell me about yourself", answer: "Focus: current role/study, key skills, relevant project, what you offer, goal aligned to role. Keep 60-90s.", profileAware: false },
  { id: "hr-2", category: "hr", tags: ["strengths"], title: "Strengths & weakness", prompt: "Your strengths and weakness?", answer: "Strength: concrete example. Weakness: genuine, with action taken to improve.", profileAware: false },
  // Communication
  { id: "comm-1", category: "communication", tags: ["clarity"], title: "Improve answer clarity", prompt: "How to make answers clearer in interviews?", answer: "Use STAR (Situation/Task/Action/Result), speak slower, avoid filler words, end with outcome.", profileAware: false },
  // English
  { id: "eng-1", category: "english", tags: ["grammar"], title: "Campus description practice", prompt: "Describe your college campus in 4-5 sentences", answer: "Describe location, infrastructure, key spots, culture, what you value. Keep coherent, varied sentences.", profileAware: false },
  // Resume
  { id: "resume-1", category: "resume", tags: ["bullets"], title: "Resume bullets", prompt: "Write strong resume bullets", answer: "Action + task + result: 'Built X reducing Y by Z%'. Quantify impact, use keywords.", profileAware: false },
  // GD
  { id: "gd-1", category: "gd", tags: ["strategy"], title: "GD strategy", prompt: "Group Discussion strategy", answer: "Open with crisp view, take turns, build on others, stay factual, summarize at end.", profileAware: false },
];

export function matchPrompts(query, max=8) {
  const q = (query||"").toLowerCase();
  return AI_PROMPT_BANK.filter(p => 
    p.prompt.toLowerCase().includes(q) ||
    p.title.toLowerCase().includes(q) ||
    p.tags.some(t=>q.includes(t))
  ).slice(0,max);
}

export function getPromptById(id) {
  return AI_PROMPT_BANK.find(p=>p.id===id);
}
