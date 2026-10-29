// Pure ESM engine - no DOM globals, storage injected
export function createEngine({ dataset, storage }) {
  const { students, companies, drives, departments, notifications, broadcasts, funnel, monthlyPlacements, ctcBands } = dataset;

  function read(key, fallback) {
    if (!storage) return fallback;
    try { const v = storage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  }
  function write(key, value) {
    if (!storage) return;
    try { storage.setItem(key, JSON.stringify(value)); } catch {}
  }
  function uid(p = "id") { return `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`; }
  function now() { return new Date().toISOString(); }

  return {
    me(role) {
      if (role === "institution_staff") {
        return { user: { id: 1001, email: "placement@svit.ac.in", name: "Dr. Anjali Joshi", role: "institution_staff", institution: "Sardar Vallabhbhai Institute of Technology, Pune", profile_complete: true } };
      }
      return { user: { id: 1, email: "aarav.sharma@svit.ac.in", name: "Aarav Sharma", role: "student", institution: "Sardar Vallabhbhai Institute of Technology, Pune", profile_complete: true } };
    },
    overview() {
      const total = students.length;
      const placed = students.filter(s=>s.status==="Placed");
      const eligible = students.filter(s=>s.cgpa>=6 && s.backlogs===0);
      const inSelection = students.filter(s=>s.status==="In Process");
      const avgCgpa = students.reduce((a,b)=>a+b.cgpa,0)/Math.max(1,total);
      const highestCgpa = Math.max(...students.map(s=>s.cgpa));
      const avgCtc = placed.reduce((a,b)=>a+(b.package||0),0)/Math.max(1,placed.length);
      const activeCompanies = companies.filter(c=>c.status==="Active");
      const activeDrives = drives.filter(d=>d.status!=="Completed");
      const openings = companies.reduce((a,c)=>a+c.offers2026,0);
      const byDept = departments.map(dept=>{
        const list = students.filter(s=>s.department===dept);
        const p = list.filter(s=>s.status==="Placed");
        const el = list.filter(s=>s.cgpa>=6 && s.backlogs===0);
        const avg = p.length? p.reduce((a,b)=>a+(b.package||0),0)/p.length : 0;
        return { department: dept, short: dept.split(" ")[0], total: list.length, eligible: el.length, placed: p.length, rate: Math.round(p.length/Math.max(1,list.length)*100), avg_cgpa: Number((list.reduce((a,b)=>a+b.cgpa,0)/Math.max(1,list.length)).toFixed(2)), avg_expected_ctc: Number(avg.toFixed(1)) };
      });
      return { kpis: { total_students: total, eligible_students: eligible.length, placed: placed.length, in_selection: inSelection.length, applied: inSelection.length+placed.length, avg_cgpa: Number(avgCgpa.toFixed(2)), highest_cgpa: Number(highestCgpa.toFixed(2)), avg_expected_ctc: Number(avgCtc.toFixed(1)), recruiters: activeCompanies.length, active_drives: activeDrives.length, total_openings: openings }, funnel, monthly: monthlyPlacements.map(m=>({month:m.month,students:m.offers})), departments: byDept };
    },
    students(query={}) {
      let rows = [...students];
      const q = (query.q||"").toString().toLowerCase();
      if(q) rows = rows.filter(s=>s.name.toLowerCase().includes(q)||String(s.id).includes(q));
      if(query.dept && query.dept!=="All") rows = rows.filter(s=>s.department===query.dept);
      if(query.status){ if(query.status==="placed") rows=rows.filter(s=>s.status==="Placed"); else if(query.status==="applying") rows=rows.filter(s=>s.status==="In Process"); else if(query.status==="not_started") rows=rows.filter(s=>s.status==="Unplaced"); }
      if(typeof query.min_cgpa==="number") rows=rows.filter(s=>s.cgpa>=query.min_cgpa);
      rows = rows.sort((a,b)=>a.name.localeCompare(b.name));
      return { students: rows, count: rows.length };
    },
    drives() { return { drives, count: drives.length }; },
    companies() { return { companies, count: companies.length }; },
    leaderboard() {
      const ranked = [...students].sort((a,b)=>(b.aiScore||0)-(a.aiScore||0));
      return { students: ranked.map((s,i)=>({ id:s.id, full_name:s.name, department:s.department, performance_score:s.aiScore, overall_rank:i+1, placement_status:s.status })) };
    },
    reports() { return { kpis: this.overview().kpis, monthly: monthlyPlacements, ctc_bands: ctcBands }; },
    notifications() {
      const read = new Set(read("sandbox.notifRead",[]));
      const items=[...notifications.map(n=>({...n,read:read.has(n.id)||n.read})),...broadcasts.map(b=>({...b,read:read.has(b.id)||b.read}))];
      return { items, unread: items.filter(i=>!i.read).length };
    },
    chatList() { return { sessions: read("sandbox.chats",[]).map(({messages,...s})=>s) }; },
    chatGet(id){ const s=read("sandbox.chats",[]).find(c=>c.id===id); return { session: s||{id,messages:[],title:"Chat"} }; },
    chatPost({message,session_id,title}) {
      const chats = read("sandbox.chats",[]);
      let session = session_id ? chats.find(c=>c.id===session_id): null;
      const isNew = !session;
      const t = title|| (isNew? (message||"").slice(0,60): session.title);
      if(!session){ session={id:uid("chat"),title:t,created_at:now(),updated_at:now(),messages:[]}; chats.unshift(session); }
      session.messages.push({id:session.messages.length+1,role:"user",content:message,created_at:now()});
      session.messages.push({id:session.messages.length+1,role:"assistant",content: "Demo reply: " + (message||""), created_at:now()});
      session.updated_at=now(); write("sandbox.chats",chats); return {reply:session.messages[session.messages.length-1].content,session_id:session.id,title:session.title};
    }
  };
}
