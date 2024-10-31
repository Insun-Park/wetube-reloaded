import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";

const s3Client = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const s3AvatarStorage = multerS3({
  s3: s3Client,
  bucket: "kittenbus-aws-001",
  acl: "public-read",
  key(req, file, cb) {
    cb(null, `avatar/${req.session.user.username}`);
  },
});

const s3VideoStorage = multerS3({
  s3: s3Client,
  bucket: "kittenbus-aws-001",
  acl: "public-read",
  key(req, file, cb) {
    cb(null, `videos/${req.session.user.email}`);
  },
});

export const localMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const uploadAvatar = multer({
  limits: { filesize: 300000 },
  storage: s3AvatarStorage,
});

export const uploadVideo = multer({
  limits: { filesize: 1000000 },
  storage: s3VideoStorage,
});
