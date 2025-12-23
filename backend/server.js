import "dotenv/config";
// s
import express from "express";
import cors from "cors";
import { query, initDb } from "./db.js";
import bodyParser from "body-parser";
const app = express();
app.use(cors());
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

initDb().catch((err) => {
  console.error("Failed to initialize DB", err);
  process.exit(1);
});
app.get("/", (req, res) => {
  res.send("Hello World from Express!"); // Send a response to the client
});

//Todo Step1: Sign up API
app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Check if user already exists
    const exists = await query("SELECT id FROM users WHERE username = $1", [
      username,
    ]);

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // 2. Create new user
    const result = await query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, password] // ⚠️ later replace with bcrypt
    );

    // 3. Return user info
    res.status(201).json({
      userId: result.rows[0].id,
      username: result.rows[0].username,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

//Todo Step2: Login API (get user id)
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await query(
      "SELECT id, password_hash FROM users WHERE username = $1",
      [username]
    );

    if (!result.rows[0]) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ⚠️ Later use bcrypt, now simplified
    if (password !== result.rows[0].password_hash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      userId: result.rows[0].id,
      username,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

//Todo Step3: Save BMI record (connected to User)
app.post("/api/records", async (req, res) => {
  try {
    const { userId, height, weight, bmi, category } = req.body;

    const sql = `
      INSERT INTO bmi_records (user_id,height,weight, bmi, category, savedat)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;

    const values = [userId, height, weight, bmi, category];

    const result = await query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

//Todo Step 4: Get only logged-in user records

app.get("/api/records/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await query(
      "SELECT * FROM bmi_records WHERE user_id = $1 ORDER BY id DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// app.get("/api/health", (req, res) => res.json({ ok: true }));

// app.post("/api/records", async (req, res) => {
//   try {
//     const { username, email, bmi, category, height, weight } = req.body;
//     const savedAt = new Date().toISOString();
//     const sql = `INSERT INTO records (username,email,bmi,category,height,weight,savedAt)
//                  VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
//     const values = [
//       username || null,
//       email || null,
//       bmi || null,
//       category || null,
//       height || null,
//       weight || null,
//       savedAt,
//     ];
//     const result = await query(sql, values);
//     res.status(201).json(result.rows[0]);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: e.message });
//   }
// });

// app.get("/api/records", async (req, res) => {
//   try {
//     const result = await query("SELECT * FROM records ORDER BY id DESC");
//     res.json(result.rows);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: e.message });
//   }
// });

// app.get("/api/records/:id", async (req, res) => {
//   try {
//     const result = await query("SELECT * FROM records WHERE id = $1", [
//       req.params.id,
//     ]);
//     if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
//     res.json(result.rows[0]);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: e.message });
//   }
// });

app.listen(PORT, () => console.log(`BMI backend listening on ${PORT}`));
