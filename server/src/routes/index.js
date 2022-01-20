const express = require("express");

const router = express.Router();

// import controller
const {
  register,
  login,
  updatePassword,
  deleteUser,
  checkAuth,
} = require("../controllers/user");

const { updateProfile, getProfile } = require("../controllers/profile");

const {
  addRoute,
  updateRoute,
  getRoutes,
  deleteRoute,
} = require("../controllers/route");

// import middleware auth
const { auth } = require("../middlewares/auth");
// import middleware uploadFile
const { uploadFile } = require("../middlewares/uploadFile");

// add route
router.post("/register", register);
router.post("/login", login);
router.patch("/password", auth, updatePassword);
router.patch("/profile", auth, uploadFile("image"), updateProfile);
router.get("/profile", auth, getProfile);
router.get("/check-auth", auth, checkAuth);
router.delete("/user", auth, deleteUser);

router.post("/route", addRoute);
router.patch("/route/:id", updateRoute);
router.get("/routes", getRoutes);
router.delete("/route/:id", deleteRoute);

module.exports = router;
