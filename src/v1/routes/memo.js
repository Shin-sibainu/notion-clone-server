const router = require("express").Router();
const memoController = require("../controllers/memo");
const tokenHandler = require("../handlers/tokenHandler");

//📝を作成
router.post("/", tokenHandler.verifyToken, memoController.create);

//📝を取得
router.get("/", tokenHandler.verifyToken, memoController.getAll);

module.exports = router;
