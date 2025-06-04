export function generateCookieOptions() {
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.LOGIN_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      // sameSite: "none",
      // secure: true,
    };
  
    return cookieOptions;
  }