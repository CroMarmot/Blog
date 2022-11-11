---
title: mpaas password
date: 2019-12-16 11:20:14
tags: [encrypt]
category: [software, encrypt]
---

```js
const JSEncrypt = require('node-jsencrypt');
let encrypt;
function rsa(pwd, publicKey) {
    if (!encrypt) {
        encrypt = new JSEncrypt();
    }
    if (!pwd || typeof pwd !== 'string') {
        return '';
    }
    let newPwd = pwd;
    if (newPwd.length > 230) {
        newPwd = newPwd.substr(0, 230);
    }
    encrypt.setPublicKey(publicKey);
    let result = encrypt.encrypt(newPwd);
    let tryTimes = 0;
    while (result.length !== 344) {
        // 如果加密后的字符串长度不是344，后端必然解密失败
        result = encrypt.encrypt(newPwd);
        if (tryTimes > 10) {
            // 最多重试十次
            return '';
        }
        tryTimes += 1;
    }
    return result;
}
const pk = 'publicKey';
const pwd = '密码';
console.log(rsa(pwd,pk));
```

`tcpdump -S -e -vv -i wlo1 host xx.xx.xx.xx`
