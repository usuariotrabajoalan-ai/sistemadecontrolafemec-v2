const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function setup() {
    try {
        console.log("Creando tablas para Asistencias...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS "AsistenciaEmployee" (
                "id" VARCHAR(255) PRIMARY KEY,
                "ci" VARCHAR(255) UNIQUE NOT NULL,
                "firstName" VARCHAR(255) NOT NULL,
                "lastName" VARCHAR(255) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS "AsistenciaRecord" (
                "id" VARCHAR(255) PRIMARY KEY,
                "employeeId" VARCHAR(255) NOT NULL REFERENCES "AsistenciaEmployee"("id") ON DELETE CASCADE,
                "type" VARCHAR(50) NOT NULL,
                "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "latitude" FLOAT,
                "longitude" FLOAT,
                "photoBase64" TEXT,
                "observation" TEXT
            );
        `);

        console.log("Creando tablas para Coberturas...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS "CoberturaUser" (
                "id" VARCHAR(255) PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "document" VARCHAR(255) UNIQUE NOT NULL,
                "password" VARCHAR(255) NOT NULL,
                "role" VARCHAR(50) NOT NULL DEFAULT 'CLEANER',
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS "CoberturaLocation" (
                "id" VARCHAR(255) PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "campus" VARCHAR(255) NOT NULL DEFAULT 'Sede Social',
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS "CoberturaJob" (
                "id" VARCHAR(255) PRIMARY KEY,
                "date" TIMESTAMP NOT NULL,
                "startTime" VARCHAR(50) NOT NULL,
                "scheduledEndTime" VARCHAR(50),
                "imageUrl" TEXT,
                "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
                "notes" TEXT,
                "endTime" TIMESTAMP,
                "signatureUrl" TEXT,
                "userId" VARCHAR(255) NOT NULL REFERENCES "CoberturaUser"("id"),
                "locationId" VARCHAR(255) NOT NULL REFERENCES "CoberturaLocation"("id"),
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("¡Todas las tablas creadas con éxito!");
    } catch (err) {
        console.error("Error creando tablas:", err);
    } finally {
        pool.end();
    }
}

setup();
