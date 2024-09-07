import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '.env.local') });

console.log("Database URL:", process.env.NEXT_PUBLIC_DATABASE_URL); // For debugging

export default {
  dialect: "postgresql",
  schema: "./utils/schema.jsx",
  out: "./drizzle",
  dbCredentials: {
    url:process.env.NEXT_PUBLIC_DATABASE_URL,
    connectionString:process.env.NEXT_PUBLIC_DATABASE_URL,
  },
};



