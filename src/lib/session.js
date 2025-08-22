export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "myapp_session",
  cookieOptions: {
    //secure: process.env.NODE_ENV === "production", // pastikan cuma true di production
    secure: false,
    maxAge: 60 * 60 * 24, // 1 hari
  },
};

export function defaultSession() {
  return {
    user: null, // default isi session
  };
}
