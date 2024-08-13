const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const pool = require("../db/pools");
const bcrypt = require("bcryptjs");


//sign up get request 
exports.signup_get = asyncHandler(async (req, res, next) => {
    res.render('signupform', {title: "sign up now"});
});

exports.signup_post = [
    //validate the fields
    body("username", "your username must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape()
    .custom(async (val) =>{
        const query = 'SELECT 1 FROM users WHERE id = $1 LIMIT 1';
        const values = [val];
        try{
            const user = await pool.query(query, values);
            if(user.rowCount === 0) {
                throw new Error("that user already exist!");
            }
        } catch (err){
            console.error('Error checking if user exists', err);
            throw new Error('Database error while checking user existence');
        }
    }),
    body("password", "your password must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),
    body("cpassword")
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage("confirm password must not be empty.")
    .custom((val, {req}) =>{
        return val === req.body.password;
    })
    .withMessage("confirm password must match password."),

    asyncHandler(async (req, res, next) =>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render('signupform', {
                title: "sign up now",
                errors: errors.array(),
            });
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)",[
                req.body.username,
                hashedPassword,
            ]);
            res.redirect("/auth/login")
        }
    }),
];