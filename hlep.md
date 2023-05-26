加密
  https://juejin.cn/post/7078968482125053966

公钥私钥
  https://blog.csdn.net/asdasgnbgf/article/details/113178603
  https://travistidwell.com/jsencrypt/demo/

步骤：

  1. 前端将数据提交到后台。在提交前，前端会用公钥加密数据，并生成两个各自16位的密钥，即keyA和valueB，将它们以键值对的方式存储在浏览器的cookie中，并设置失效时间（即请求超时时间）。加密后的数据会被发送到后台。

  2. 后台会使用RSA私钥对加密后的数据进行解密，获得valueB。然后，后台使用该valueB对返回的数据进行AES加密。需要注意的是，返回的keyA并不需要加密。

  3. 前端接收到返回的数据时，首先获取返回结果的keyA。然后，前端会从浏览器中获取该keyA对应的valueB并用valueB对其返回结果进行解密。

  4. 需要注意的是：
      - 前端的公钥是公开的，只有私钥是保密的。
      - 在请求之前，前端会生成一个随机的AES密钥键值对，并将其保存在本地。
      - 即使keyA被窃取，也不会泄露重要信息，因为valueB是存储在本地的。