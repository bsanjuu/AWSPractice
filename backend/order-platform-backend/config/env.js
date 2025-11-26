require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',

  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY,
  },

  database: {
    type: process.env.DB_TYPE,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },

  dynamodb: {
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  },

  payment: {
    stripeSecret: process.env.STRIPE_SECRET_KEY,
    timeout: parseInt(process.env.PAYMENT_TIMEOUT),
  },

  s3: {
    endpoint: process.env.S3_ENDPOINT,
    bucket: process.env.S3_BUCKET,
    region: process.env.AWS_REGION,
  },

  redshift: {
    host: process.env.REDSHIFT_HOST,
    port: process.env.REDSHIFT_PORT,
    database: process.env.REDSHIFT_DATABASE,
  },
};