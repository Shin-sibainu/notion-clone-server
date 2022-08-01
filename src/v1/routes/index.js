const router = require("express").Router();

/* GET home page. */
router.use("/auth", require("./auth"));
router.use("/memo", require("./memo"));

module.exports = router;
