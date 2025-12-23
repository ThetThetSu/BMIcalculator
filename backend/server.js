import "dotenv/config";
// s
import express from "express";
import cors from "cors";
import { query, initDb } from "./db.js";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();

// Configure CORS to allow credentials
app.use(cors({
  origin: "http://localhost:5173", // Vite default port
  credentials: true
}));

app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "bmi-calculator-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

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

    // 3. Create session for new user
    req.session.userId = result.rows[0].id;
    req.session.username = result.rows[0].username;

    // 4. Return user info
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
      "SELECT id, password_hash, username FROM users WHERE username = $1",
      [username]
    );

    if (!result.rows[0]) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ⚠️ Later use bcrypt, now simplified
    if (password !== result.rows[0].password_hash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create session
    req.session.userId = result.rows[0].id;
    req.session.username = result.rows[0].username;

    res.json({
      userId: result.rows[0].id,
      username: result.rows[0].username,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Check authentication status
app.get("/api/auth/me", async (req, res) => {
  try {
    if (req.session.userId) {
      res.json({
        authenticated: true,
        userId: req.session.userId,
        username: req.session.username,
      });
    } else {
      res.json({
        authenticated: false,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

//Todo Step2.5: Logout API
app.post("/api/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

//Todo Step3: Save BMI record (connected to User)
app.post("/api/records", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { height, weight, bmi, category } = req.body;
    const userId = req.session.userId;

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
app.get("/api/records", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = req.session.userId;

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
