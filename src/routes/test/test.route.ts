import express from "express";

import apiResponse from "../../utilities/apiResponse";
import httpStatusCodes from "http-status-codes";
import { getRepository } from "typeorm";
import { User } from "../../entities/user/user.entity";

const router = express.Router();

const { celebrate, Joi, Segments } = require("celebrate");
const JSEncrypt = require("nodejs-jsencrypt").default;

const CryptoJS = require("crypto-js"); //引用AES源码js
function Encrypt(keyEncrypt = "", word = "") {
  const key = CryptoJS.enc.Utf8.parse(keyEncrypt); //十六位十六进制数作为密钥
  const iv = CryptoJS.enc.Utf8.parse(keyEncrypt); //十六位十六进制数作为密钥偏移量
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString().toUpperCase();
}

/**
 * .required()
 * http://localhost:6501/api/test/getList
 */
router.get(
  "/getList",
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string(),
    },
  }),
  async (req, res) => {
    let data = await getRepository(User).find(req.query);

    console.log(req.query, data, "测试");

    return apiResponse.result(res, { list: data }, httpStatusCodes.OK);
  }
);

/**
 * http://localhost:6501/api/test/rsa
 */
router.post("/rsa", async (req: any, res: any) => {
  console.log(req.body, "测试1");

  // **解密**
  var decrypt = new JSEncrypt();

  let privkey = `-----BEGIN RSA PRIVATE KEY-----
  MIICXAIBAAKBgQCfv5QESxQmTsu9kXESRuWBAY11AViOHy4bUwenXu4BZaSv1HQS
  D3h+ELjI+F2f076wz4zG22KQn1ikYSmkN5qZ9WKQaQzTwJavadSaDq/VSAahS2jl
  ssNtAWQHYV43nGU2OAjXwGQznDFhtQmuWQeXtuMzw+EGGSNtm7Q3zGSIYwIDAQAB
  AoGAeHIU4wvMnHmKqlqvu00TG6qVAmRKZZXiyJ1YxvwPTaRagGwaO8fIXJy1Bmol
  BS28uEk05nZhIZPTXNUZdYSrHjexWHak2VTf3a+5LEW3FiNpeArqMbtO9jeEkWvr
  GvkgbgszkMPNbX4ktCC9xgxaMkb1gEVHvQiSTQI+DDT0tjkCQQDp8pRRlh2/nsTc
  pe18gzukwZQaxZEVe/cCy3fBnq1nR49IZegfEELadbGJCcWswV9iDs4A33ZRGH/X
  sr6gZ40nAkEArs58wJRnAg4s4OZkK2kmMN+/oDtRJVLvCBacWyAfD8qFDNu7zKDS
  hL5Vi+72p8QFz/akPQj/6zFeEp00335oZQJBAK9ltrugb7dNoszG/lGe1mXE2HRl
  8UuJQH1w7N1WSS2oog0mkixP9b9yA+P5VqIZ7JhI/zv6TeupEZg3I+KBIHsCQA7P
  vjBPIr9A1jqkKt6mxS6k9sar3/9KnKhRyiPKf/dFkKp7P9lh0xSeT/9QWyPx7xAk
  9NubFJwoDbGEEoPRYSUCQHI+5erX9F8aym9mC+WW404JqVOhbEaOXBz1e9LPgJMH
  TJfEBtyVtbpyEh6UMdX6nXk54ZlYehiTQQX58xe77H8=
  -----END RSA PRIVATE KEY-----`;

  //设置私钥
  decrypt.setPrivateKey(privkey);
  //使用私钥解密刚才用公钥加密的密文
  var uncrypted = decrypt.decrypt(req.body.jsonData); // false null or 成功
  if (uncrypted) {
    let unRes = JSON.parse(uncrypted);
    console.log(unRes, "成功");

    let data = {
      a: "结果",
      b: 123,
    };

    let resEncrypt = Encrypt(unRes.uuidAES, JSON.stringify(data));

    return apiResponse.result(
      res,
      {
        uuid: unRes.uuid,
        data: resEncrypt,
      },
      httpStatusCodes.OK
    );
  } else {
    console.log(uncrypted, "失败");
  }

  console.log(req.body, uncrypted, "测试2");

  return apiResponse.result(res, { data: 123 }, httpStatusCodes.OK);
});

export default router;
