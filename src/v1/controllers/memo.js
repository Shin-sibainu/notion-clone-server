const { default: memoApi } = require("../../../../client/src/api/memoApi");
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

exports.updatePosition = async (req, res) => {
  const { memos } = req.body;
  try {
    for (const key in memos.reverse()) {
      const memo = memos[key];
      await Memo.findByIdAndUpdate(memo.id, { $set: { position: key } });
    }
    res.status(200).json("更新しました");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getOne = async (req, res) => {
  const { memoId } = req.params;
  try {
    const memo = await Memo.findOne({ user: req.user._id, _id: memoId });
    if (!memo) return res.status(404).json("メモが存在しません");
    res.status(200).json(memo);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  const { memoId } = req.params;
  const { title, description, favorite } = req.body;

  try {
    if (title === "") req.body.title = "無題";
    if (description === "")
      req.body.description = "ここに自由に記入してください";

    const currentMemo = await Memo.findById(memoId);
    if (!currentMemo) return res.status(404).json("メモが存在しません");

    //現在見ているメモがお気に入りがまだされていない時
    if (favorite !== undefined && currentMemo.favorite !== favorite) {
      //現在のメモ以外のお気に入りされているメモを探して配列で返す
      const favorites = await Memo.find({
        user: currentMemo.user,
        favorite: true,
        _id: { $ne: memoId },
      });
      console.log(favorites);

      if (favorite) {
        //自分以外のお気に入りされているメモの数を返す=それが今のメモの位置に設定される。
        req.body.favoritePosition = favorites.length > 0 ? favorites.length : 0;
      } else {
        for (const key in favorites) {
          const element = favorites[key];
          await element.update({
            favoritePosition: key,
          });
        }
      }
    }
    const memo = await Memo.findByIdAndUpdate(memoId, { $set: req.body });
    res.status(200).json(memo);
  } catch (err) {
    res.status(500).json(err);
  }
};
