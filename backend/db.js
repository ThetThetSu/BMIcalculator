// const { Pool } = require("pg");
// const fs = require("fs");
// const path = require("path");
import { Pool } from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false
  } : false,
});

async function initDb() {
  const p = path.join(__dirname, "migrations", "init.sql");
  if (!fs.existsSync(p)) return;
  const sql = fs.readFileSync(p, "utf8");
  await pool.query(sql);
}

function query(text, params) {
  return pool.query(text, params);
}

// module.exports = { pool, query, initDb };
export { pool, query, initDb };
