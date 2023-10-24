export const CONSTANT = "constant";
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/bet";

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID";

  export const JWT_SECRET =
  process.env.JWT_SECRET ||
  "refdweohiqdfsewrijgohdtreg4trgehgnethr";

export const SESSION_OPTIONS = {
  password: JWT_SECRET,
  cookieName: process.env.COOKIE_NAME || "starter-v2",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

