import mysql from "mysql2/promise";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

async function migrate() {
  console.log("Connecting to", process.env.DB_HOST);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "3306", 10),
    multipleStatements: true
  });

  console.log("Connected! Running schema.sql...");
  
  try {
    const schema = fs.readFileSync(path.join(process.cwd(), "schema.sql"), "utf-8");
    await connection.query(schema);
    console.log("Schema applied successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await connection.end();
  }
}

migrate();
