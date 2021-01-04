const express = require("express");
const router = express.Router();

const { userSignupValidator } = require("../validator");
const { signup, signin, signout } = require("../controllers/auth");

// Routes
router.post("/signup", userSignupValidator, signup);

/**
 * @swagger
 * paths:
 *   /api/signin: 
 *    post:
 *      tags:
 *      - name: "Autenticación"
 *      summary: Loggear usuario
 *      description: El usuario requiere loggearse 
 *      requestBody: 
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                email:
 *                    type: string
 *                    description: Email de usuario válido
 *                password:
 *                    type: string
 *                    description: Password de usuario válido
 *      responses:
 *        "200":
 *           description: Respuesta exitósa
 *        "400":
 *           description: Respuesta para petición inválida
 */
router.post("/signin", signin);

/**
 * @swagger
 * /api/signout:
 *  get:
 *    tags:
 *    - name: "Autenticación"
 *    summary: Usuario loggout
 *    description: El usuario requiere desloggearse
 *    responses:
 *      "200":
 *        description: Respuesta exitósa
 */
router.get("/signout", signout);

module.exports = router;