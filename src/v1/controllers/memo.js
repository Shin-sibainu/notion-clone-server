const Memo = require("../models/memo");
const Section = require("../models/section");
const Task = require("../models/task");

exports.create = async (req, res) => {
  try {
    const memoCount = await Memo.find().count();
    const memo = await Memo.create({
      user: req.user._id,
      position: memoCount > 0 ? memoCount : 0,
    });
    res.status(201).json(memo);
  } catch {
    res.status(500).json(err);
  }
};

exports.getAll = async (req, res) => {
  try {
    //今ログインしているユーザーIDから、それに紐づいた📝を全て取り出している。
    const memo = await Memo.find({ user: req.user._id }).sort("-position");
    console.log(memo);
    res.status(200).json(memo);
  } catch {
    res.status(500).json(err);
  }
};
