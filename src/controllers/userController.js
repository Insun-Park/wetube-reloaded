import bcrypt from "bcrypt";
import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const pageTitle = "Join";
  const { name, email, username, password, password2, location } = req.body;
  if (password !== password2) {
    res.status(400).render("Join", {
      pageTitle,
      errorMessage: "Password Confirmation does not match!",
    });
  }
  const exists = await User.exists({ $or: [{ email }, { username }] });
  if (exists) {
    return res.status(400).render("Join", {
      pageTitle,
      errorMessage: "email or username is already exist.",
    });
  }
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("Join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};
export const userEdit = (req, res) => res.send("Edit User");
export const userDelete = (req, res) => res.send("Delete User");
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });
export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(400)
      .render("login", { errorMessage: "Username does not exist." });
  } else {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .render("login", { errorMessage: "Incorrect Password!", pageTitle });
    } else {
      return res.redirect("/");
    }
  }
};
export const logout = (req, res) => res.send("User Log Out");
export const see = (req, res) => res.send("See User's Profile");
