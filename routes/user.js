const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin, isAdminOrSameUser } = require("../controllers/auth");
const { userById, listUsers, deleteUser, updateUser } = require("../controllers/user");

// Routes

/**
 * @swagger   
 * /api/user/list/{userId}: 
 *  get:
 *    tags:
 *    - name: "Usuario"
 *    summary: Listar usuarios
 *    description: Muestra una lista con los usuarios registrados
 *    parameters:
 *    - name: "Authorization"
 *      in: "header"
 *      required: true
 *      type: "string"
 *    - name: "userId"
 *      in: "path"
 *      description: "Id de usuario que realiza la petición"
 *      required: true
 *    responses:
 *      "200":
 *         description: Respuesta exitosa, retorna lista de usuarios
 *      "400":
 *         description: Usuarios no encontrados
 *      "403":
 *         description: Acceso denegado, necesita permisos de Administrador
 *      "500":
 *         description: Error al contar usuarios
 */
router.get("/user/list/:userId", requireSignin, isAuth, isAdmin, listUsers);

/**
 * @swagger   
 * paths:
 *   /api/user/{userId}: 
 *    put:
 *      tags:
 *      - name: "Usuario"
 *      summary: Editar usuario
 *      description: Editar la información del usuario
 *      parameters:
 *      - name: "Authorization"
 *        in: "header"
 *        required: true
 *        type: "string"
 *      - name: "userId"
 *        in: "path"
 *        description: "Id de usuario que realiza la petición"
 *        required: true
 *        requestBody: 
 *          content:
 *            application/json:
 *              schema:
 *                properties:
 *                  name:
 *                      type: string
 *                      description: Nuevo nombre de usuario
 *      responses:
 *        "200":
 *           description: Respuesta exitósa
 *        "400":
 *           description: Usuario no encontrado
 *        "401":
 *           description: Token incorrecto - No es admin, ni mismo user
 */
router.put("/user/:userId", requireSignin, isAuth, isAdminOrSameUser, updateUser);

/**
 * @swagger   
 * /user/{deleteUserId}/{userId}: 
 *  delete:
 *    tags:
 *    - name: "Usuario"
 *    summary: Eliminar usuario
 *    description: Elimina al usuario de la bd
 *    parameters:
 *    - name: "Authorization"
 *      in: "header"
 *      required: true
 *      type: "string"
 *    - name: "deleteUserId"
 *      in: "path"
 *      description: "Id de usuario que se va a eliminar"
 *      required: true
 *    - name: "userId"
 *      in: "path"
 *      description: "Id de usuario que realiza la petición"
 *      required: true
 *    responses:
 *      "200":
 *         description: Respuesta exitósa
 *      "400":
 *         description: Usuario no encontrado
 *      "403":
 *       description: Acceso denegado, necesita permisos de Administrador
 *      "500":
 *         description: Error al eliminar usuario
 */
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