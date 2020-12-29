const express = require("express");
const router = express.Router();

const {
    hospitalById,
    create,
    list,
    remove,
    updateHospital,
    getById
} = require("../controllers/hospital");
const { requireSignin, isAuth } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.post("/hospital/create/:userId", requireSignin, isAuth, create);
router.get("/hospital/list/:userId", requireSignin, isAuth, list);
router.delete("/hospital/delete/:hospitalId/:userId", requireSignin, isAuth, remove);
router.put("/hospital/update/:hospitalId/:userId", requireSignin, isAuth, updateHospital);
router.get("/hospital/getById/:hospitalId/:userId", requireSignin, isAuth, getById);

// Params
router.param("userId", userById);
router.param("hospitalId", hospitalById);

module.exports = router;