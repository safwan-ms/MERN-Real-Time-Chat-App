import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  //Set JWT as HTTP Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // Required for cross-origin cookies on HTTPS
    sameSite: "None", // Required for cross-origin
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};
