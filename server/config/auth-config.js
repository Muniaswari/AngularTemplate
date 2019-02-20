module.exports = {
  // App Settings
  //MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost/OAuth',
  default: 'MONGO_URI',
  SERVER: process.env.SERVER || 'mongodb://localhost:27017/',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/OAuthTest',
  DefaultDatabse: process.env.DefaultDatabse ||   'OAuthTest',
  //DefaultClientDatabse: process.env.DefaultClientDatabse || 'OAuthClient',
  ADMINMONGO_URI: process.env.ADMINMONGO_URI || 'mongodb://localhost:27017/OAuthMasterTest',
  ADMINTOKEN_SECRET: process.env.TOKEN_SECRET || 'MyNameIsAdMiN',
   TOKEN_SECRET: process.env.TOKEN_SECRET || 'MyNameIs',

  // OAuth 2.0
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '07ee877812ce241e59b8c9905578c9e4',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'VL_iL4OOoHEDxAtWwKbHuM2y',
  LINKEDIN_SECRET: process.env.LINKEDIN_SECRET || 'xxxxxx',
};
