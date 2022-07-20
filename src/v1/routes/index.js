var router = require("express").Router();

/* GET home page. */
router.use("/auth", require("./auth"));

module.exports = router;
