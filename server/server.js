require("dotenv").config();

// necessary imports
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");

// database and route handler imports
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dbTestRoutes = require("./routes/dbTestRoutes");
const usersRoutes = require("./routes/usersRoutes");
const petRoutes = require("./routes/petRoutes");




// express app initializer
const app = express();
const port = process.env.PORT || 5000;

// middleware setup
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, 
        httpOnly: true, 
        maxAge: 1000 * 60 * 15, 
    }
}));

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"], 
    credentials: true
}));
app.use(express.urlencoded({ extended: true })); 
app.use(bodyParser.json());

app.get("/auth/status", (req, res) => {
    if (req.session.user) {
        res.json({ authenticated: true, user: req.session.user });
    } else {
        res.json({ authenticated: false });
    }
});

app.get("/debug-session", (req, res) => {
    res.json({ captcha: req.session.captcha || "No CAPTCHA stored" });
});
app.get("/test-session", (req, res) => {
    req.session.test = "Session is working!";
    res.json({ message: "Session set" });
});

app.get("/check-session", (req, res) => {
    res.json({ sessionData: req.session });
});

app.get('/session-data', (req, res) => {
    res.json({ formData: req.session.formData || {} });
});

// route handlers
app.use("/auth", authRoutes);
app.use("/db-test", dbTestRoutes);
app.use("/user", usersRoutes);
app.use("/api/pets", petRoutes);

// starts the server
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});