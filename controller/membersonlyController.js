const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const pool = require("../db/pools");
const pools = require("../db/pools");

exports.index = asyncHandler(async (req, res, next) => {
    const query = `
        SELECT messages.title, messages.text, messages.created_at, users.username 
        FROM messages 
        JOIN users ON messages.user_id = users.id
        ORDER BY messages.created_at DESC;
    `;
    const result = await pools.query(query);
    const allMessages = result.rows;
    res.render('index', {
        title: "Members Only Home",
        allMessages: allMessages,
    })
})

exports.become_member_get = asyncHandler(async (req, res, next) => {
    res.render("member_form", {title: "become a member"})
});

exports.become_member_post = [
    body("passcode")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("member passcode must not be empty")
    .custom((val) => {
        return val === "membercode";
    })
    .withMessage("invaild passcode"),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const query = `SELECT * FROM users WHERE id = ${req.user.id}`

        const sqlres = await pool.query(query);
        if(sqlres.rows.length === 0){
            const err = new Error("user doesn't exist");
            err.status = 404;
            return next(err);
        }

        if(!errors.isEmpty()){
            res.render("member_form", {
                title: "become a member",
                errors: errors.array(),
            });
        } else {
            const query = `
            UPDATE users 
            SET status = 'member'
            WHERE id = ${req.user.id} AND status = 'guest'
            RETURNING *;
        `;
         await pool.query(query);
         res.redirect('/')
        }
    }),
];

exports.create_post_get = asyncHandler(async (req, res, next) =>{
    res.render('form_post', {title: "Create your post"})
});

exports.create_post_post = [
    // Validate and sanitize fields.
    body("title", "you message title must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("text", "your message content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    asyncHandler(async (req, res, next) => {
        // takes the validation errors from the request.
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            //there are errors rerender the form.
            res.render('form_post', {
                title: "Create your post",
                errors: errors.array(),
            });
        } else {
            //the form is vaild post and save the data to the database.
            await pool.query("INSERT INTO messages (title, text, user_id, created_at) VALUES ($1, $2, $3, $4)",[
                req.body.title,
                req.body.text,
                req.user.id,
                new Date(),
            ]);
            res.redirect("/")
        }
    }),
];