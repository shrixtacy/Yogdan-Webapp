require('dotenv').config();

const app = require('./app');
const { connectDB, databaseStatus } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const database = await connectDB();
    console.log(`[INFO] Database state: ${database.state}`);
    app.listen(PORT, () => console.log(`[INFO] Yogdan backend running on port ${PORT}`));
  } catch (error) {
    console.error(`[ERROR] Backend startup failed: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) start();

module.exports = { start, databaseStatus };
