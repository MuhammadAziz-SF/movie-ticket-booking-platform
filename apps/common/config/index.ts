import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();

export type ConfigType = {
  PORT: number;
  DB_URL: string;
  ACCESS_TOKEN_KEY: string;
  ACCESS_TOKEN_TIME: string;
  REFRESH_TOKEN_KEY: string;
  REFRESH_TOKEN_TIME: string;
  PG_HOST: string;
  PG_PORT: string;
  PG_USER: string;
  PG_PASS: string;
  PG_DB: string;
  SMPT_HOST: string;
  SMPT_PORT: string;
  SMPT_USER: string;
  SMPT_PASS: string;
  ADMIN_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
};

const requiredVariables = [
  'PORT',
  'DB_URL',
  'ACCESS_TOKEN_KEY',
  'ACCESS_TOKEN_TIME',
  'REFRESH_TOKEN_KEY',
  'REFRESH_TOKEN_TIME',
  'PG_HOST',
  'PG_PORT',
  'PG_USER',
  'PG_PASS',
  'PG_DB',
  'SMPT_HOST',
  'SMPT_PORT',
  'SMPT_USER',
  'SMPT_PASS',
  'ADMIN_NAME',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
];

const missingVariables = requiredVariables.filter((variable) => {
  const value = process.env[variable];
  return !value || value.trim() === '';
});

if (missingVariables.length > 0) {
  Logger.error(
    `Missing or empty required environment variables: ${missingVariables.join(', ')}`,
  );
  process.exit(1);
}

export const config: ConfigType = {
  PORT: parseInt(process.env.PORT as string, 10),
  DB_URL: process.env.DB_URL as string,
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY as string,
  ACCESS_TOKEN_TIME: process.env.ACCESS_TOKEN_TIME as string,
  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY as string,
  REFRESH_TOKEN_TIME: process.env.REFRESH_TOKEN_TIME as string,
  PG_HOST: process.env.PG_HOST as string,
  PG_PORT: process.env.PG_PORT as string,
  PG_USER: process.env.PG_USER as string,
  PG_PASS: process.env.PG_PASS as string,
  PG_DB: process.env.PG_DB as string,
  SMPT_HOST: process.env.SMPT_HOST as string,
  SMPT_PORT: process.env.SMPT_PORT as string,
  SMPT_USER: process.env.SMPT_USER as string,
  SMPT_PASS: process.env.SMPT_PASS as string,
  ADMIN_NAME: process.env.ADMIN_NAME as string,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
};
