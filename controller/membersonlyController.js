const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


exports.index = asyncHandler(async (req, res, next) => {

    res.render('index', {
        title: "Members Only Home",
    })
})