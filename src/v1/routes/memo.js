const router = require("express").Router();
const memoController = require("../controllers/memo");
const tokenHandler = require("../handlers/tokenHandler");
const { param } = require("express-validator");
const validation = require("../handlers/validation");

//📝を作成
router.post("/", tokenHandler.verifyToken, memoController.create);

//📝を取得
router.get("/", tokenHandler.verifyToken, memoController.getAll);

router.put("/", tokenHandler.verifyToken, memoController.updatePosition);

router.get(
  "/:memoId",
  param("memoId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("無効なIDです。");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  memoController.getOne
);

module.exports = router;
