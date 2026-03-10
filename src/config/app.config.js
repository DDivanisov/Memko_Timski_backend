const appConfig = {
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: process.env.PORT || 3000,
      BASE_PATH: process.env.BASE_PATH || '/api/v1',
      MONGODB_URI: process.env.MONGODB_URI,
      MODEL_ENDPOINT: process.env.MODEL_ENDPOINT,

      SESSION_SECRET: process.env.SESSION_SECRET,
      SESSION_EXPIRES_IN_HOURES: process.env.SESSION_EXPIRES_IN_HOURES,

      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,

      FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'localhost',
      FRONTEND_GOOGLE_CALLBACK_URL: process.env.FRONTEND_GOOGLE_CALLBACK_URL,

}

module.exports = { config: appConfig };