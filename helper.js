const jwt = require("jsonwebtoken");
const config = require("config");

const newkey = () => {
    let token = jwt.sign({ issue: 'cti', iat: Math.floor(Date.now() / 1000) - 30}, config.SECRET);
    console.log(token);
};

newkey();