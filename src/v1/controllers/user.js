const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jsonwebtoken = require(jsonwebtoken);

const register = async (req, res) => {
  //パスワードの受け取り
  const password = req.body.password;

  try {
    //パスワードの暗号化
    req.body.password = CryptoJS.AES.encrypt(password, process.env.PASS_SK);
    //ユーザー新規作成
    const user = await User.create(req.body);
    //トークンの発行(有効期限は24時間まで)
    const token = jsonwebtoken.sign({ id: user._id }, process.env.TOKEN_SK, {
      expiresIn: "24h",
    });
    //json形式でuserとtokenを返す
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json(err);
  }
};

const login = async (req, res) => {
  //ユーザーがログインするときに打ち込むそのままの文字列を取得。
  const { username, password } = req.body;

  try {
    //DBからユーザーが存在するか探してくる。
    const user = await User.findOne({ username }).select("password username");
    if (!user) {
      //認証する資格がない。
      res.status(401).json({
        errors: {
          param: "username",
          message: "ユーザー名かパスワードが無効です。",
        },
      });
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SK
    ).toString(CryptoJS.enc.Utf8);

    //パスワード適合チェック
    if (decryptedPassword !== password) {
      res.status(401).json({
        errors: {
          param: "username",
          message: "ユーザー名かパスワードが無効です。",
        },
      });
    }

    user.password = undefined;

    const token = jsonwebtoken.sign({ id: user._id }, process.env.TOKEN_SK, {
      expiresIn: "24h",
    });

    //リクエスト成功、新たなリソースの作成に成功したことを表す。
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.modules = { register, login };
