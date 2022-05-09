
 
exports.signupValidation = [
    check('firstName', 'Nome richiesto').not().isEmpty(),
    check('lastName', 'Cognome richiesto').not().isEmpty(),
    check('email', 'Inserisici una email valida').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('lastName', 'Telefono richiesto').not().isEmpty(),
    check('password', 'La passowrd deve essere di almeno 6 caratteri').isLength({ min: 6 })
]
 
exports.loginValidation = [
     check('email', 'Inserisici una email valida').isEmail().normalizeEmail({ gmail_remove_dots: true }),
     check('password', 'La passowrd deve essere di almeno 6 caratteri').isLength({ min: 6 })
 
]