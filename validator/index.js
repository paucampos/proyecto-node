exports.userSignupValidator = (req, res, next) => {
    req.check("name", "El nombre es necesario").notEmpty();
    req.check("email", "El email debe contener entre 4 a 32 caracteres")
        .matches(/.+\@.+\..+/).withMessage("El email debe contener @")
        .isLength({
            min: 4,
            max: 32
        });
    req.check("password", "El password es necesario").notEmpty();
    req.check("password")
        .isLength({ min: 6 }).withMessage("El password debe contener al menost 6 caracteres")
        .matches(/\d/).withMessage("El password debe contener números");
    req.check("role")
        .matches(/\b(?:ADMIN_ROLE|USER_ROLE)\b/).withMessage("Rol no permitido")
        // .matches("USER_ROLE").withMessage("Rol no permitido")
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};