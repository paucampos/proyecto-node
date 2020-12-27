const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById, listUsers, deleteUser, updateUser } = require("../controllers/user");

// Routes
router.get("/user/list/:userId", requireSignin, isAuth, isAdmin, listUsers);
router.put("/user/:userId", requireSignin, isAuth, updateUser);
router.delete(
    "/user/:deleteUserId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    deleteUser
);

// params
router.param("userId", userById);
router.param("deleteUserId", userById);
router.param("updateUser", userById);

module.exports = router;