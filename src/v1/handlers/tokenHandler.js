const jsonwebtoken = require("jsonwebtoken");
const { modules } = require("../controllers/user");
const User = require("../models/user");

//クライアントから渡されたトークンが正常かの検証
const tokenDecode = (req) => {
  //リクエストヘッダからauthorizationフィールドを指定してベアラトークンを取得する。
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    //ベアラだけを取得。
    const bearer = bearerHeader.split(" ")[1];
    try {
      //ベアラと秘密鍵情報を用いてJWTの検証と読み取りを行う。
      const tokenDecoded = jsonwebtoken.verify(bearer, process.env.TOKEN_SK);
      return tokenDecoded;
      //ベアラと秘密鍵が正しくない場合はfalseを返す->権限がない判定。
    } catch {
      return false;
    }
  } else {
    return false;
  }
};

//トークン認証関数
const verifyToken = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);
  if (tokenDecoded) {
    const user = await User.findById(tokenDecoded, id);
    if (!user) return res.status(401).json("権限がありません");
    req.user = user;
    next();
  } else {
    res.status(401).json("権限がありません");
  }
};

exports.modules = { verifyToken };
