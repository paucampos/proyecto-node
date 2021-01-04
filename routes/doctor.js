const express = require("express");
const router = express.Router();

const {
    doctorById,
    create,
    list,
    remove,
    update,
    getById
} = require("../controllers/doctor");
const { requireSignin, isAuth } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.post("/doctor/create/:userId", requireSignin, isAuth, create);
router.get("/doctor/list/:userId", requireSignin, isAuth, list);
router.delete("/doctor/delete/:doctorId/:userId", requireSignin, isAuth, remove);
router.put("/doctor/update/:doctorId/:userId", requireSignin, isAuth, update);
router.get("/doctor/getById/:doctorId/:userId", requireSignin, isAuth, getById);

// Params
router.param("userId", userById);
router.param("doctorId", doctorById);

module.exports = router;