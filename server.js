const bodyparser = require("body-parser");
const express = require("express");

const studentroute = require("./router/student.router")();

let app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use("/v1/student", studentroute);

module.exports = app;

/* 
    git init
    npm init --yes 
    npm i mongoose --save
    npm i body-parser --save
    npm i express --save
    npm i http-status --save
    node ./bin/index.js
*/
