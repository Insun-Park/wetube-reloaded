import bcrypt from "bcrypt";
import User from "../models/User";
import Video from "../models/Video";

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
      avatarUrl: "",
    });
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.status(400).render("Join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
    file,
  } = req;
  console.log(file);
  const exists = await User.exists({ $or: [{ email }, { username }] });
  if (exists) {
    return res.status(400).render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "email or username is already exist.",
    });
  } else {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        name,
        email,
        username,
        location,
        avatarUrl: file ? file.path : avatarUrl,
      },
      { new: true }
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
  }
};

export const userDelete = (req, res) => res.send("Delete User");

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const { username, password } = req.body;
  const user = await User.findOne({ username, githubId: false });
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
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  }
};

export const startGithubLogin = (req, res) => {
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const baseUrl = "https://github.com/login/oauth/authorize";
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };
  const baseUrl = "https://github.com/login/oauth/access_token";
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const userEmail = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = userEmail.find((email) => email.primary && email.verified);
    if (!emailObj) {
      // <- set notification
      return res.redirect("login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userData.name,
        email: emailObj.email,
        avatarUrl: userData.avatar_url,
        githubId: true,
        username: userData.login,
        password: "",
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const getEditPassword = (req, res) => {
  return res.render("change-password", { pageTitle: "Change Password" });
};

export const postEditPassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, confirmedPassword },
  } = req;
  const user = await User.findById(_id);
  const passwordMatch = await bcrypt.compare(oldPassword, user.password);
  if (newPassword !== confirmedPassword) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "Password does not match",
    });
  }
  if (!passwordMatch) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "Current Password is incorrect",
    });
  }
  user.password = newPassword;
  await user.save();
  req.session.user.password = user.password;
  // <- add notification
  return res.redirect("/");
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }
  return res.render("profile", { pageTitle: user.username, user });
};
