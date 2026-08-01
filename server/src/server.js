import app from './app.js';
import { env } from './config/env.js';

const PORT = env.port || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Expense Voucher API Server running in ${env.nodeEnv} mode`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});