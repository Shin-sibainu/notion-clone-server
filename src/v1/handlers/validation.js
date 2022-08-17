const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

//バリデーション
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

//ObjectIdが有効かどうか
exports.isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
