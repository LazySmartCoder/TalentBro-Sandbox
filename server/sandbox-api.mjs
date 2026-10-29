import { createServer } from "node:http";
import { createEngine } from "../src/lib/sandbox/engine.js";
import * as data from "../src/lib/data.ts";

const engine = createEngine({ dataset: data, storage: null });

const server = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace(/^\/api/, "");

  res.setHeader("Content-Type", "application/json");

  try {
    if (path === "/auth/me/" && req.method === "GET") {
      res.writeHead(200); res.end(JSON.stringify(engine.me("student"))); return;
    }
    if (path === "/institution/overview/" && req.method === "GET") {
      res.writeHead(200); res.end(JSON.stringify(engine.overview())); return;
    }
    if (path === "/students/" && req.method === "GET") {
      res.writeHead(200); res.end(JSON.stringify(engine.students(Object.fromEntries(url.searchParams)))); return;
    }
    if (path === "/drives/" && req.method === "GET") {
      res.writeHead(200); res.end(JSON.stringify(engine.drives())); return;
    }
    if (path === "/companies/" && req.method === "GET") {
      res.writeHead(200); res.end(JSON.stringify(engine.companies())); return;
    }
    if (path === "/readiness/leaderboard/" && req.method === "GET") {
      res.writeHead(200); res.end(JSON.stringify(engine.leaderboard())); return;
    }
    if (path === "/reports/" && req.method === "GET") {
      res.writeHead(200); res.end(JSON.stringify(engine.reports())); return;
    }
    if (path === "/chat/sessions/" && req.method === "GET") {
      res.writeHead(200); res.end(JSON.stringify(engine.chatList())); return;
    }
    if (path === "/notifications/" && req.method === "GET") {
      res.writeHead(200); res.end(JSON.stringify(engine.notifications())); return;
    }

    res.writeHead(404); res.end(JSON.stringify({ detail: "Not found" })); return;
  } catch (e) {
    res.writeHead(500); res.end(JSON.stringify({ detail: e.message })); return;
  }
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`sandbox-api listening on :${port}`);
});
