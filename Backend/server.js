const express = require('express');
const cors = require('cors');

const journalRouter = require('./Routes/journalRouter');

const app = express();
const PORT = process.env.PORT || 5000;

/* === MIDDLEWARE ====*/
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Journal Backend API is running successfully 🚀");
});

/* ==== ROUTES ==== */
app.use("https://journalocksecuredweb.onrender.com/api",journalRouter);

/* ==== SERVER START ==== */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});