const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

//クライアントから渡されたトークンが正常かの検証
const tokenDecode = (req) => {
  //リクエストヘッダからauthorizationフィールドを指定してベアラトークンを取得する。
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    //ベアラだけを取得。
    const bearer = bearerHeader.split(" ")[1];
    try {
        //ベアラと鍵情報を用いてJWTの検証と読み取りを行う。
        const tokenDecoded = jsonwebtoken.verify(
            bearer,
            process.env.TOKEN_SK,
        )
    }
  }
};
