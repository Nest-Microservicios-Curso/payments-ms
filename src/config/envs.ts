import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  STRIPE_SECRET_KEY: string;
}

const envSchemaValidator = joi
  .object({
    PORT: joi.number().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchemaValidator.validate(process.env);

if (error) {
  throw new Error(`Payments Config(.env) has error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  STRIPE_SECRET_KEY: envVars.STRIPE_SECRET_KEY,
};
