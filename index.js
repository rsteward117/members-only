var express = require('express');
const path = require("node:path");
const bodyParser = require("body-parser");
const membersonlyRouter = require("./routes/membersonly");
const authRouter = require("./routes/auth");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.use("/", membersonlyRouter);
app.use("/auth", authRouter);

const PORT = 3000;
app.listen(PORT, ()=> console.log(`server listening on ${PORT}`));