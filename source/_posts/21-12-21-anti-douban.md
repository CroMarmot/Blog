---
title: 豆瓣页面数据解密 
date: 2021-12-21
tags: [豆瓣,js]
category: [frontend]
mathjax: true
---

# 问题

个人的网页需要一些书目数据，印象中，老的豆瓣直接是页面还是接口，能获直接取到，可以作为爬虫入门练手

然而前天一看，新版的豆瓣已经不明文返回数据了

`https://search.douban.com/book/subject_search?search_text=%E5%AE%9E%E5%8F%98%E5%87%BD%E6%95%B0&cat=1001`

# 预备知识

`C++函数调用`：这个知识点让你知道函数调用堆栈的常见设计

js调试：chrome断点，格式化代码，console，js基本语法，

# 思路

## 定位数据来源

一般来说 只要页面不用花里胡哨的技巧，比如把数据放在png里的话，一般来说，数据只会在`Fetch/XHR`,`JS`,`html`，`ws` 中

通过页面展示的`实变函数论` 去上述类型中搜索，结果没有任何内容中直接包含数据

<!--more-->

---

接下来考虑，通过限制网速，切换到低速3G, 并增加截图，定位大概和哪个资源有关

并伴随block地址，来看是哪个资源相关

---

定位到有个`img3.doubanio.com/.../bundle.js`是与渲染相关

但注意到它的`大小`是来自于`内存缓存`的，里面应该不会有数据，而在变的依然是最开始的请求

翻看最开始的请求，里面有个`window.__DATA__` 十分像加密数据

在`bundle.js`中 搜索该关键字，找到位置，打断点，console里清空这个值，页面无显示，确定了数据的确是来自首个请求，而`bundle.js` 是负责它的解密和渲染(不那么准确，vendor实际也有参与，但对于找入口来说定位到bundle中的`__DATA__`足够了

## 主要节点

**下面代码都省去了外层包裹，实际运行是有相关的闭包的，这里主要是展示代码位置，而不是完整代码**

通过断点，注意到有个被混淆变量后的函数被反复调用

```js
return function(t) {
    return function(n) {
        return function(r) {
            try {
                return e(t)(n)(r)
            } catch (e) {
                return Object(B.b)(e),
                n(r)
            }
        }
    }
}
```

而我们对 这里最后 `(r)`的调用断点进去, 会发现以下3个

```js
return function(r) {
    var a = e.from(r, "base64")
      , s = Math.max(Math.floor((a.length - 2 * i) / 3), 0)
      , u = a.slice(s, s + i);
    a = e.concat([a.slice(0, s), a.slice(s + i)]);
    var c = Object(o.hash)(e.concat([u, e.from(t)]));
    return n((l = {},
    l[c] = a,
    l));
    var l
}

```

```js
return function(t) {
    var n = Object.keys(t)[0]
      , r = At.crypto.decrypt(t[n], n);
    return e(r)
}
```

```js
return function(t) {
    return e(It()(t))
}
```

而根据chrome对变量的提示，三个断点的入参`r`分别是 原`__DATA__`,`{hash:Uint8Array}`,`Uint8Array`

## 清理无关内容

在最外层的`e(t)(n)(r)` 断点处e 

`t` 输出为`{getState: ƒ, dispatch: ƒ}`,而`e()(n)(r)` 输出依然不变

所以估计`t`是一个渲染页面的函数，这里我们不需要

`n1 = function(...args){const result = n(...args);console.warn([...args],result);return result;}`

再调用`e()(n1)(t)`

发现`n`接受的参数，就是上面的`{hash:Uini8Array}` 输出的是结果

或者`e()((x)=>{console.log(x)})(r)` 也能知道中间的入参

读静态代码发现，上面的第一个函数，就是把`__DATA__`转换成`n`的入参的

---

加上断点的输出，代码块还剩下

`__DATA__`到 `{秘钥:加密后数据}`

```js
function(r) {
    var a = e.from(r, "base64")
      , s = Math.max(Math.floor((a.length - 2 * i) / 3), 0)
      , u = a.slice(s, s + i);
    a = e.concat([a.slice(0, s), a.slice(s + i)]);
    var c = Object(o.hash)(e.concat([u, e.from(t)]));
    return (l = {},
    l[c] = a,
    l);
    var l
}
```

看上去接受一个参数，实际接受`密文e`和`秘钥r`两个参数, 输出是`Uint8Array`

```js
function r(e) {
    var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "hjasbdn2ih823rgwudsde7e2dhsdhas";
    "string" == typeof r && (r = [].map.call(r, function(t) {
        return t.charCodeAt(0)
    }));
    for (var n, o = [], i = 0, a = new t(e.length), s = 0; s < 256; s++)
        o[s] = s;
    for (s = 0; s < 256; s++)
        i = (i + o[s] + r[s % r.length]) % 256,
        n = o[s],
        o[s] = o[i],
        o[i] = n;
    s = 0,
    i = 0;
    for (var u = 0; u < e.length; u++)
        s = (s + 1) % 256,
        i = (i + o[s]) % 256,
        n = o[s],
        o[s] = o[i],
        o[i] = n,
        a[u] = e[u] ^ o[(o[s] + o[i]) % 256];
    return a
}
```

`It()(t)`，也就是把上面`Uint8array` 转换成最终输出的json的超大函数


```js
var _ = t.slice(t.length - 32, t.length)
  , E = _.readUInt8(6);
(0,
f.debug)("offsetSize: " + E);
var A = _.readUInt8(7);
(0,
f.debug)("objectRefSize: " + A);
var C = s(_, 8);
// .........
```

## 破解

### 第一部分

第一部分，根据`__DATA__`的格式，其实稍有经验的就能看出是`base64`当然这里直接代码也可以看到是`base64`

1. 断点确定`i = 16`
2. `base64` 通过`atob`实现
3. concat可以prototype实现
4. hash 相对较难

#### hash部分

定位到, 入参只是秘钥

```js
function a(e) {
    return "string" == typeof e && (e = t.from(e)),
    (0,
    h.default)(e, 41405).toString(16).replace(/^0+/, "")
}
```

和具体的调用

```js
function o() {
    return 2 == arguments.length ? new o(arguments[1]).update(arguments[0]).digest() : this instanceof o ? void i.call(this, arguments[0]) : new o(arguments[0])
}
function i(t) {
    return this.seed = t instanceof a ? t.clone() : a(t),
    this.v1 = this.seed.clone().add(s).add(u),
    this.v2 = this.seed.clone().add(u),
    this.v3 = this.seed.clone(),
    this.v4 = this.seed.clone().subtract(s),
    this.total_len = 0,
    this.memsize = 0,
    this.memory = null,
    this
}
var a = r(81).UINT64
  , s = a("11400714785074694791")
  , u = a("14029467366897019727")
  , c = a("1609587929392839161")
  , f = a("9650029242287828579")
  , l = a("2870177450012600261");
// ....
```

通过其中的数值和代码关键搜索，定位到一个xxhash的算法

并且确定了第一段中的`41405` 应该是初始种子

---

综上，通过简单实现concat，base64转换和提取秘钥，加上以`41405`为种子的`xxhash.64`算法

我们能得到和断点中输出一致的`{hash:Uint8Array}`的输出, 如果不想肉眼比较，可以用`n`函数来验证

### 第二部分

如果你直接搜第二部分中存在的hash：`hjasbdn2ih823rgwudsde7e2dhsdhas` 你可以搜到的都是douban的破解

而比较好的是，第二部分除了一个t需要修改成`Uint8Array` 以外，剩下的都没有外部依赖，直接拿来用即可

并且我们可以验证，第二部分的输出和断点第三部分的输入一致

### 第三部分

其实，这时候你把输入的内容转化成ascii输出，已经能看到部分单词了，所以这部分应该不是字典密码，而是不带加密的结构体流化

然而它又不是众所周知的 base64 或者 json字符串

我们能通过断点的方式，启用它的debug模式`f.debug.enable = true`, 看到输出`json-enctryptor`

我开始以为又找到库了，结果 连单词都拼错了，目测在现今这个开源大家积极修typo的时代，应该是它们内部改造过的库

---

一个好消息是，这里的字段和输出提示，有不少没有被打包模糊掉

通过关键字，搜索到一个叫做bplist的东西, 把bplist的代码拷贝进来调用

剩下的内容就完全抠代码。其中有不少`Uint8Array.prototype` 的函数

这里需要注意的是，豆瓣的`parseObject`中的`objType` 和 上面的`bplistParser.js`中的不一样

这里修改了

```js
case 0x6:
    return parseData();
case 0x4:
    // ASCII
    return parsePlistString();
case 0x5:
    // UTF-16
    return parsePlistString(true);
```

---

至此 我们有了一份 能跑的代码, 修改搜索内容，新的页面中的`__DATA__`放进来依然可以解密，说明成功

# 代码

## 版本1

能跑就行

`index.html`

```html
<!DOCTYPE html>
<html>
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>
<body>
	<script type="text/javascript" src="./xxhash.min.js"></script>
	<script type="text/javascript" src="./index.js"></script>
</body>
</html>
```

其中`xxhash.min.js`是公开的算法, 下载一个即可, 见Ref中链接


`index.js`

```js
// XXH 需要支持 copy
Uint8Array.prototype.copy = function copy(target, targetStart, start, end) {
    if (!start)
        start = 0
    if (!end && end !== 0)
        end = this.length
    if (targetStart >= target.length)
        targetStart = target.length
    if (!targetStart)
        targetStart = 0
    if (end > 0 && end < start)
        end = start
    // Copy 0 bytes; we're done
    if (end === start)
        return 0
    if (target.length === 0 || this.length === 0)
        return 0
    // Fatal error conditions
    if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds')
    }
    if (start < 0 || start >= this.length)
        throw new RangeError('sourceStart out of bounds')
    if (end < 0)
        throw new RangeError('sourceEnd out of bounds')
    // Are we oob?
    if (end > this.length)
        end = this.length
    if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start
    }
    var len = end - start
    var i
    if (this === target && start < targetStart && targetStart < end) {
        // descending copy from end
        for (i = len - 1; i >= 0; i--) {
            target[i + targetStart] = this[i + start]
        }
    } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
        // ascending copy from start
        for (i = 0; i < len; i++) {
            target[i + targetStart] = this[i + start]
        }
    } else {
        target._set(this.subarray(start, start + len), targetStart)
    }
    return len
}

Uint8Array.prototype.readUInt8 = function(t) {
    return this[t]
}

Uint8Array.prototype.readUInt32BE = function(t) {
    return 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3])
}
var J_read = function(t, e, r, n, o) {
    var i, a, s = 8 * o - n - 1, u = (1 << s) - 1, c = u >> 1, f = -7, l = r ? o - 1 : 0, h = r ? -1 : 1, p = t[e + l];
    for (l += h,
    i = p & (1 << -f) - 1,
    p >>= -f,
    f += s; f > 0; i = 256 * i + t[e + l],
    l += h,
    f -= 8)
        ;
    for (a = i & (1 << -f) - 1,
    i >>= -f,
    f += n; f > 0; a = 256 * a + t[e + l],
    l += h,
    f -= 8)
        ;
    if (0 === i)
        i = 1 - c;
    else {
        if (i === u)
            return a ? NaN : 1 / 0 * (p ? -1 : 1);
        a += Math.pow(2, n),
        i -= c
    }
    return (p ? -1 : 1) * a * Math.pow(2, i - n)
}

Uint8Array.prototype.readInt8 = function(t, e) {
    return 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
}
;
Uint8Array.prototype.readInt16LE = function(t, e) {

    var r = this[t] | this[t + 1] << 8;
    return 32768 & r ? 4294901760 | r : r
}
;
Uint8Array.prototype.readInt16BE = function(t, e) {

    var r = this[t + 1] | this[t] << 8;
    return 32768 & r ? 4294901760 | r : r
}
;
Uint8Array.prototype.readInt32LE = function(t, e) {
    return this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24
}
;
Uint8Array.prototype.readInt32BE = function(t, e) {
    return this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]
}
;
Uint8Array.prototype.readFloatLE = function(t, e) {
    return J_read(this, t, !0, 23, 4)
}
;
Uint8Array.prototype.readFloatBE = function(t, e) {
    return J_read(this, t, !1, 23, 4)
}
;
Uint8Array.prototype.readDoubleLE = function(t, e) {
    return J_read(this, t, !0, 52, 8)
}
;
Uint8Array.prototype.readDoubleBE = function(t, e) {
    return J_read(this, t, !1, 52, 8)
}
Uint8Array.prototype.toString = function() {
    var t = 0 | this.length;
    return 0 === t ? "" : ucs2.apply(this, arguments)
}

var Q = 4096;
var P = function(t) {
    var e = t.length;
    if (e <= Q)
        return String.fromCharCode.apply(String, t);
    for (var r = "", n = 0; n < e; )
        r += String.fromCharCode.apply(String, t.slice(n, n += Q));
    return r
}
var T = function(t, e, r) {
    r = Math.min(t.length, r);
    for (var n = [], o = e; o < r; ) {
        var i = t[o]
          , a = null
          , s = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
        if (o + s <= r) {
            var u, c, f, l;
            switch (s) {
            case 1:
                i < 128 && (a = i);
                break;
            case 2:
                u = t[o + 1],
                128 == (192 & u) && (l = (31 & i) << 6 | 63 & u) > 127 && (a = l);
                break;
            case 3:
                u = t[o + 1],
                c = t[o + 2],
                128 == (192 & u) && 128 == (192 & c) && (l = (15 & i) << 12 | (63 & u) << 6 | 63 & c) > 2047 && (l < 55296 || l > 57343) && (a = l);
                break;
            case 4:
                u = t[o + 1],
                c = t[o + 2],
                f = t[o + 3],
                128 == (192 & u) && 128 == (192 & c) && 128 == (192 & f) && (l = (15 & i) << 18 | (63 & u) << 12 | (63 & c) << 6 | 63 & f) > 65535 && l < 1114112 && (a = l)
            }
        }
        null === a ? (a = 65533,
        s = 1) : a > 65535 && (a -= 65536,
        n.push(a >>> 10 & 1023 | 55296),
        a = 56320 | 1023 & a),
        n.push(a),
        o += s
    }
    return P(n)
}
var N = function(t, e, r) {
    for (var n = t.slice(e, r), o = "", i = 0; i < n.length; i += 2)
        o += String.fromCharCode(n[i] + 256 * n[i + 1]);
    return o
}

var ucs2 = function(t, e, r) {
    var n = !1;
    if ((void 0 === e || e < 0) && (e = 0),
    e > this.length)
        return "";
    if ((void 0 === r || r > this.length) && (r = this.length),
    r <= 0)
        return "";
    if (r >>>= 0,
    e >>>= 0,
    r <= e)
        return "";
    for (t || (t = "utf8"); ; )
        switch (t) {
        case "hex":
            return j(this, e, r);
        case "utf8":
        case "utf-8":
            return T(this, e, r);
        case "ascii":
            return k(this, e, r);
        case "latin1":
        case "binary":
            return R(this, e, r);
        case "base64":
            return O(this, e, r);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
            return N(this, e, r);
        default:
            if (n)
                throw new TypeError("Unknown encoding: " + t);
            t = (t + "").toLowerCase(),
            n = !0
        }
}


var concat = function(arr0, arr1) {
    return new Uint8Array([...arr0, ...arr1]);
}

var hashuint16 = function(e) {
    return XXH.h64(e, 0xA1BD).toString(16)
}

var btool = function(r) {
    let i = 16;
    let a = Uint8Array.from(atob(r), c=>c.charCodeAt(0));
    let s = Math.max(Math.floor((a.length - 2 * i) / 3), 0)
    let u = new Uint8Array(a.slice(s, s + i));
    a = concat(a.slice(0, s), a.slice(s + i));
    var c = hashuint16(concat(u, Uint8Array.from("")));
    return [c, a]
}

var decrypto = function(e, r) {
    // "hjasbdn2ih823rgwudsde7e2dhsdhas";
    "string" == typeof r && (r = [].map.call(r, function(t) {
        return t.charCodeAt(0)
    }));
    for (var n, o = [], i = 0, a = new Uint8Array(e.length), s = 0; s < 256; s++)
        o[s] = s;
    for (s = 0; s < 256; s++)
        i = (i + o[s] + r[s % r.length]) % 256,
        n = o[s],
        o[s] = o[i],
        o[i] = n;
    s = 0,
    i = 0;
    for (var u = 0; u < e.length; u++)
        s = (s + 1) % 256,
        i = (i + o[s]) % 256,
        n = o[s],
        o[s] = o[i],
        o[i] = n,
        a[u] = e[u] ^ o[(o[s] + o[i]) % 256];
    return a
}

var debug = false;

var maxObjectSize = 100 * 1000 * 1000;
// 100Meg
var maxObjectCount = 32768;

// EPOCH = new SimpleDateFormat("yyyy MM dd zzz").parse("2001 01 01 GMT").getTime();
// ...but that's annoying in a static initializer because it can throw exceptions, ick.
// So we just hardcode the correct value.
var EPOCH = 978307200000;

// we're just going to toss the high order bits because javascript doesn't have 64-bit ints
function readUInt64BE(buffer, start) {
  var data = buffer.slice(start, start + 8);
  return data.readUInt32BE(4, 8);
}

function swapBytes(buffer) {
  var len = buffer.length;
  for (var i = 0; i < len; i += 2) {
    var a = buffer[i];
    buffer[i] = buffer[i+1];
    buffer[i+1] = a;
  }
  return buffer;
}


function readUInt(buffer, start) {
  start = start || 0;

  var l = 0;
  for (var i = start; i < buffer.length; i++) {
    l <<= 8;
    l |= buffer[i] & 0xFF;
  }
  return l;
}

var parseBuffer = function(buffer) {
    var result = {};

    // Handle trailer, last 32 bytes of the file
    var trailer = buffer.slice(buffer.length - 32, buffer.length);
    // 6 null bytes (index 0 to 5)
    var offsetSize = trailer.readUInt8(6);
    if (debug) {
        console.log("offsetSize: " + offsetSize);
    }
    var objectRefSize = trailer.readUInt8(7);
    if (debug) {
        console.log("objectRefSize: " + objectRefSize);
    }
    var numObjects = readUInt64BE(trailer, 8);
    if (debug) {
        console.log("numObjects: " + numObjects);
    }
    var topObject = readUInt64BE(trailer, 16);
    if (debug) {
        console.log("topObject: " + topObject);
    }
    var offsetTableOffset = readUInt64BE(trailer, 24);
    if (debug) {
        console.log("offsetTableOffset: " + offsetTableOffset);
    }

    if (numObjects > maxObjectCount) {
        throw new Error("maxObjectCount exceeded");
    }

    // Handle offset table
    var offsetTable = [];

    for (var i = 0; i < numObjects; i++) {
        var offsetBytes = buffer.slice(offsetTableOffset + i * offsetSize, offsetTableOffset + (i + 1) * offsetSize);
        offsetTable[i] = readUInt(offsetBytes, 0);
        if (debug) {
            console.log("Offset for Object #" + i + " is " + offsetTable[i] + " [" + offsetTable[i].toString(16) + "]");
        }
    }

    // Parses an object inside the currently parsed binary property list.
    // For the format specification check
    // <a href="http://www.opensource.apple.com/source/CF/CF-635/CFBinaryPList.c">
    // Apple's binary property list parser implementation</a>.
    function parseObject(tableOffset) {
        var offset = offsetTable[tableOffset];
        var type = buffer[offset];
        var objType = (type & 0xF0) >> 4;
        //First  4 bits
        var objInfo = (type & 0x0F);
        //Second 4 bits
        switch (objType) {
        case 0x0:
            return parseSimple();
        case 0x1:
            return parseInteger();
        case 0x8:
            return parseUID();
        case 0x2:
            return parseReal();
        case 0x3:
            return parseDate();
        case 0x6:
            return parseData();
        case 0x4:
            // ASCII
            return parsePlistString();
        case 0x5:
            // UTF-16
            return parsePlistString(true);
        case 0xA:
            return parseArray();
        case 0xD:
            return parseDictionary();
        default:
            throw new Error("Unhandled type 0x" + objType.toString(16));
        }

        function parseSimple() {
            //Simple
            switch (objInfo) {
            case 0x0:
                // null
                return null;
            case 0x8:
                // false
                return false;
            case 0x9:
                // true
                return true;
            case 0xF:
                // filler byte
                return null;
            default:
                throw new Error("Unhandled simple type 0x" + objType.toString(16));
            }
        }

        function parseInteger() {
            var length = Math.pow(2, objInfo);
            if (length < maxObjectSize) {
                return readUInt(buffer.slice(offset + 1, offset + 1 + length));
            } else {
                throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
            }
        }

        function parseUID() {
            var length = objInfo + 1;
            if (length < maxObjectSize) {
                return readUInt(buffer.slice(offset + 1, offset + 1 + length));
            } else {
                throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
            }
        }

        function parseReal() {
            var length = Math.pow(2, objInfo);
            if (length < maxObjectSize) {
                var realBuffer = buffer.slice(offset + 1, offset + 1 + length);
                if (length === 4) {
                    return realBuffer.readFloatBE(0);
                } else if (length === 8) {
                    return realBuffer.readDoubleBE(0);
                }
            } else {
                throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
            }
        }

        function parseDate() {
            if (objInfo != 0x3) {
                console.error("Unknown date type :" + objInfo + ". Parsing anyway...");
            }
            var dateBuffer = buffer.slice(offset + 1, offset + 9);
            return new Date(EPOCH + (1000 * dateBuffer.readDoubleBE(0)));
        }

        function parseData() {
            var dataoffset = 1;
            var length = objInfo;
            if (objInfo == 0xF) {
                var int_type = buffer[offset + 1];
                var intType = (int_type & 0xF0) / 0x10;
                if (intType != 0x1) {
                    console.error("0x4: UNEXPECTED LENGTH-INT TYPE! " + intType);
                }
                var intInfo = int_type & 0x0F;
                var intLength = Math.pow(2, intInfo);
                dataoffset = 2 + intLength;
                if (intLength < 3) {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                } else {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                }
            }
            if (length < maxObjectSize) {
                return buffer.slice(offset + dataoffset, offset + dataoffset + length);
            } else {
                throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
            }
        }

        function parsePlistString(isUtf16) {
            isUtf16 = isUtf16 || 0;
            var enc = "utf8";
            var length = objInfo;
            var stroffset = 1;
            if (objInfo == 0xF) {
                var int_type = buffer[offset + 1];
                var intType = (int_type & 0xF0) / 0x10;
                if (intType != 0x1) {
                    console.err("UNEXPECTED LENGTH-INT TYPE! " + intType);
                }
                var intInfo = int_type & 0x0F;
                var intLength = Math.pow(2, intInfo);
                var stroffset = 2 + intLength;
                if (intLength < 3) {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                } else {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                }
            }
            // length is String length -> to get byte length multiply by 2, as 1 character takes 2 bytes in UTF-16
            length *= (isUtf16 + 1);
            if (length < maxObjectSize) {
                var plistString = Buffer.from(buffer.slice(offset + stroffset, offset + stroffset + length));
                if (isUtf16) {
                    plistString = swapBytes(plistString);
                    enc = "ucs2";
                }
                return plistString.toString(enc);
            } else {
                throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
            }
        }

        function parseArray() {
            var length = objInfo;
            var arrayoffset = 1;
            if (objInfo == 0xF) {
                var int_type = buffer[offset + 1];
                var intType = (int_type & 0xF0) / 0x10;
                if (intType != 0x1) {
                    console.error("0xa: UNEXPECTED LENGTH-INT TYPE! " + intType);
                }
                var intInfo = int_type & 0x0F;
                var intLength = Math.pow(2, intInfo);
                arrayoffset = 2 + intLength;
                if (intLength < 3) {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                } else {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                }
            }
            if (length * objectRefSize > maxObjectSize) {
                throw new Error("To little heap space available!");
            }
            var array = [];
            for (var i = 0; i < length; i++) {
                var objRef = readUInt(buffer.slice(offset + arrayoffset + i * objectRefSize, offset + arrayoffset + (i + 1) * objectRefSize));
                array[i] = parseObject(objRef);
            }
            return array;
        }

        function parseDictionary() {
            var length = objInfo;
            var dictoffset = 1;
            if (objInfo == 0xF) {
                var int_type = buffer[offset + 1];
                var intType = (int_type & 0xF0) / 0x10;
                if (intType != 0x1) {
                    console.error("0xD: UNEXPECTED LENGTH-INT TYPE! " + intType);
                }
                var intInfo = int_type & 0x0F;
                var intLength = Math.pow(2, intInfo);
                dictoffset = 2 + intLength;
                if (intLength < 3) {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                } else {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                }
            }
            if (length * 2 * objectRefSize > maxObjectSize) {
                throw new Error("To little heap space available!");
            }
            if (debug) {
                console.log("Parsing dictionary #" + tableOffset);
            }
            var dict = {};
            for (var i = 0; i < length; i++) {
                var keyRef = readUInt(buffer.slice(offset + dictoffset + i * objectRefSize, offset + dictoffset + (i + 1) * objectRefSize));
                var valRef = readUInt(buffer.slice(offset + dictoffset + (length * objectRefSize) + i * objectRefSize, offset + dictoffset + (length * objectRefSize) + (i + 1) * objectRefSize));
                var key = parseObject(keyRef);
                var val = parseObject(valRef);
                if (debug) {
                    console.log("  DICT #" + tableOffset + ": Mapped " + key + " to " + val);
                }
                dict[key] = val;
            }
            return dict;
        }
    }

    return [parseObject(topObject)];
};
// 这里放拷贝过来的数据
var result0 = btool(window.__DATA__);
console.warn(result0);
result1 = decrypto(result0[1], result0[0])
console.warn(result1);
console.warn(parseBuffer(result1))
```

## 版本2 

多个迹象表明，他们应该用的bufferjs，但是buffer只有node的，所以需要bufferjs的前端库`https://bundle.run/buffer@6.0.3`

通过`script`标签和`var Buffer = buffer.Buffer`就可以使用了

不幸的是，经过替换发现有个值转义失败了，检查传入数组没有问题，定位到问题在他被swapBytes了两次，

也就是传值传址，Buffer和Uint8Array行为上有区别，解决方案是，swapBytes不操作传入数据, 或者在开始套上 `Buffer.from()`, github上有的代码这部分是错的

```diff
- var plistString = buffer.slice(offset + stroffset, offset + stroffset + length);
+ var plistString = Buffer.from(buffer.slice(offset + stroffset, offset + stroffset + length));
```

或

```diff
- function swapBytes(buffer) {
+ function swapBytes(buf) {
+  buffer = new Buffer(buf); // 这里需要修改 因为某个位置被访问了多次，修改了原始数据
  var len = buffer.length;
  for (var i = 0; i < len; i += 2) {
    var a = buffer[i];
    buffer[i] = buffer[i+1];
    buffer[i+1] = a;
  }
  return buffer;
}
```

因为 豆瓣对parse解析还有魔改（上面的映射），这里找到的库即是nodejs的，又和它不一致，这一部分就不找外部函数了，最终

`index.html`

```html
<!DOCTYPE html>
<html>
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>
<body>
	<script type="text/javascript" src="./feross.buffer.6.0.3.js"></script>
	<script type="text/javascript" src="./xxhash.min.js"></script>
	<script type="text/javascript" src="./index.js"></script>
</body>
</html>
```

`index.js`

```js
var Buffer = buffer.Buffer

var btool = function(r) {
    let i = 16;
    let a = Buffer.from(r, "base64");
    let s = Math.max(Math.floor((a.length - 2 * i) / 3), 0)
    let u = new Buffer(a.slice(s, s + i));
    a = Buffer.concat([a.slice(0, s), a.slice(s + i)]);
    var c = XXH.h64(Buffer.concat([u, Buffer.from("")]), 0xA1BD).toString(16);
    return [c, a]
}

var decrypto = function(e, r) {
    // "hjasbdn2ih823rgwudsde7e2dhsdhas";
    "string" == typeof r && (r = [].map.call(r, function(t) {
        return t.charCodeAt(0)
    }));
    for (var n, o = [], i = 0, a = new Buffer(e.length), s = 0; s < 256; s++)
        o[s] = s;
    for (s = 0; s < 256; s++)
        i = (i + o[s] + r[s % r.length]) % 256,
        n = o[s],
        o[s] = o[i],
        o[i] = n;
    s = 0,
    i = 0;
    for (var u = 0; u < e.length; u++)
        s = (s + 1) % 256,
        i = (i + o[s]) % 256,
        n = o[s],
        o[s] = o[i],
        o[i] = n,
        a[u] = e[u] ^ o[(o[s] + o[i]) % 256];
    return a
}

var debug = false;

var maxObjectSize = 100 * 1000 * 1000;
// 100Meg
var maxObjectCount = 32768;

// EPOCH = new SimpleDateFormat("yyyy MM dd zzz").parse("2001 01 01 GMT").getTime();
// ...but that's annoying in a static initializer because it can throw exceptions, ick.
// So we just hardcode the correct value.
var EPOCH = 978307200000;

// we're just going to toss the high order bits because javascript doesn't have 64-bit ints
function readUInt64BE(buffer, start) {
  var data = buffer.slice(start, start + 8);
  return data.readUInt32BE(4, 8);
}

function swapBytes(buffer) {
  var len = buffer.length;
  for (var i = 0; i < len; i += 2) {
    var a = buffer[i];
    buffer[i] = buffer[i+1];
    buffer[i+1] = a;
  }
  return buffer;
}


function readUInt(buffer, start) {
  start = start || 0;

  var l = 0;
  for (var i = start; i < buffer.length; i++) {
    l <<= 8;
    l |= buffer[i] & 0xFF;
  }
  return l;
}

var parseBuffer = function(buffer) {
    var result = {};
    // Handle trailer, last 32 bytes of the file
    var trailer = buffer.slice(buffer.length - 32, buffer.length);
    // 6 null bytes (index 0 to 5)
    var offsetSize = trailer.readUInt8(6);
    if (debug) {
        console.log("offsetSize: " + offsetSize);
    }
    var objectRefSize = trailer.readUInt8(7);
    if (debug) {
        console.log("objectRefSize: " + objectRefSize);
    }
    var numObjects = readUInt64BE(trailer, 8);
    if (debug) {
        console.log("numObjects: " + numObjects);
    }
    var topObject = readUInt64BE(trailer, 16);
    if (debug) {
        console.log("topObject: " + topObject);
    }
    var offsetTableOffset = readUInt64BE(trailer, 24);
    if (debug) {
        console.log("offsetTableOffset: " + offsetTableOffset);
    }

    if (numObjects > maxObjectCount) {
        throw new Error("maxObjectCount exceeded");
    }
	console.log(JSON.stringify(buffer.slice(0,20)));

    // Handle offset table
    var offsetTable = [];

    for (var i = 0; i < numObjects; i++) {
        var offsetBytes = buffer.slice(offsetTableOffset + i * offsetSize, offsetTableOffset + (i + 1) * offsetSize);
        offsetTable[i] = readUInt(offsetBytes, 0);
        if (debug) {
            console.log("Offset for Object #" + i + " is " + offsetTable[i] + " [" + offsetTable[i].toString(16) + "]");
        }
    }

    // Parses an object inside the currently parsed binary property list.
    // For the format specification check
    // <a href="http://www.opensource.apple.com/source/CF/CF-635/CFBinaryPList.c">
    // Apple's binary property list parser implementation</a>.
    function parseObject(tableOffset) {
		var offset = offsetTable[tableOffset];
        var type = buffer[offset];
        var objType = (type & 0xF0) >> 4;
        //First  4 bits
        var objInfo = (type & 0x0F);
        //Second 4 bits
        switch (objType) {
        case 0x0:
            return parseSimple();
        case 0x1:
            return parseInteger();
        case 0x8:
            return parseUID();
        case 0x2:
            return parseReal();
        case 0x3:
            return parseDate();
        case 0x6:
            return parseData();
        case 0x4:
            // ASCII
            return parsePlistString();
        case 0x5:
            // UTF-16
            return parsePlistString(true);
        case 0xA:
            return parseArray();
        case 0xD:
            return parseDictionary();
        default:
            throw new Error("Unhandled type 0x" + objType.toString(16));
        }

        function parseSimple() {
            //Simple
            switch (objInfo) {
            case 0x0:
                // null
                return null;
            case 0x8:
                // false
                return false;
            case 0x9:
                // true
                return true;
            case 0xF:
                // filler byte
                return null;
            default:
                throw new Error("Unhandled simple type 0x" + objType.toString(16));
            }
        }

        function parseInteger() {
            var length = Math.pow(2, objInfo);
            if (length < maxObjectSize) {
                return readUInt(buffer.slice(offset + 1, offset + 1 + length));
            } else {
                throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
            }
        }

        function parseUID() {
            var length = objInfo + 1;
            if (length < maxObjectSize) {
                return readUInt(buffer.slice(offset + 1, offset + 1 + length));
            } else {
                throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
            }
        }

        function parseReal() {
            var length = Math.pow(2, objInfo);
            if (length < maxObjectSize) {
                var realBuffer = buffer.slice(offset + 1, offset + 1 + length);
                if (length === 4) {
                    return realBuffer.readFloatBE(0);
                } else if (length === 8) {
                    return realBuffer.readDoubleBE(0);
                }
            } else {
                throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
            }
        }

        function parseDate() {
            if (objInfo != 0x3) {
                console.error("Unknown date type :" + objInfo + ". Parsing anyway...");
            }
            var dateBuffer = buffer.slice(offset + 1, offset + 9);
            return new Date(EPOCH + (1000 * dateBuffer.readDoubleBE(0)));
        }

        function parseData() {
            var dataoffset = 1;
            var length = objInfo;
            if (objInfo == 0xF) {
                var int_type = buffer[offset + 1];
                var intType = (int_type & 0xF0) / 0x10;
                if (intType != 0x1) {
                    console.error("0x4: UNEXPECTED LENGTH-INT TYPE! " + intType);
                }
                var intInfo = int_type & 0x0F;
                var intLength = Math.pow(2, intInfo);
                dataoffset = 2 + intLength;
                if (intLength < 3) {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                } else {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                }
            }
            if (length < maxObjectSize) {
                return buffer.slice(offset + dataoffset, offset + dataoffset + length);
            } else {
                throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
            }
        }

        function parsePlistString(isUtf16) {
            isUtf16 = isUtf16 || 0;
            var enc = "utf8";
            var length = objInfo;
            var stroffset = 1;
            if (objInfo == 0xF) {
                var int_type = buffer[offset + 1];
                var intType = (int_type & 0xF0) / 0x10;
                if (intType != 0x1) {
                    console.err("UNEXPECTED LENGTH-INT TYPE! " + intType);
                }
                var intInfo = int_type & 0x0F;
                var intLength = Math.pow(2, intInfo);
                var stroffset = 2 + intLength;
                if (intLength < 3) {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                } else {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                }
            }
            // length is String length -> to get byte length multiply by 2, as 1 character takes 2 bytes in UTF-16
            length *= (isUtf16 + 1);
            if (length < maxObjectSize) {
                var plistString = Buffer.from(buffer.slice(offset + stroffset, offset + stroffset + length));
                if (isUtf16) {
                    plistString = swapBytes(plistString);
                    enc = "ucs2";
                }
                return plistString.toString(enc);
            } else {
                throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
            }
        }

        function parseArray() {
            var length = objInfo;
            var arrayoffset = 1;
            if (objInfo == 0xF) {
                var int_type = buffer[offset + 1];
                var intType = (int_type & 0xF0) / 0x10;
                if (intType != 0x1) {
                    console.error("0xa: UNEXPECTED LENGTH-INT TYPE! " + intType);
                }
                var intInfo = int_type & 0x0F;
                var intLength = Math.pow(2, intInfo);
                arrayoffset = 2 + intLength;
                if (intLength < 3) {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                } else {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                }
            }
            if (length * objectRefSize > maxObjectSize) {
                throw new Error("To little heap space available!");
            }
            var array = [];
            for (var i = 0; i < length; i++) {
                var objRef = readUInt(buffer.slice(offset + arrayoffset + i * objectRefSize, offset + arrayoffset + (i + 1) * objectRefSize));
                array[i] = parseObject(objRef);
            }
            return array;
        }

        function parseDictionary() {
            var length = objInfo;
            var dictoffset = 1;
            if (objInfo == 0xF) {
                var int_type = buffer[offset + 1];
                var intType = (int_type & 0xF0) / 0x10;
                if (intType != 0x1) {
                    console.error("0xD: UNEXPECTED LENGTH-INT TYPE! " + intType);
                }
                var intInfo = int_type & 0x0F;
                var intLength = Math.pow(2, intInfo);
                dictoffset = 2 + intLength;
                if (intLength < 3) {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                } else {
                    length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
                }
            }
            if (length * 2 * objectRefSize > maxObjectSize) {
                throw new Error("To little heap space available!");
            }
            if (debug) {
                console.log("Parsing dictionary #" + tableOffset);
            }
            var dict = {};
            for (var i = 0; i < length; i++) {
                var keyRef = readUInt(buffer.slice(offset + dictoffset + i * objectRefSize, offset + dictoffset + (i + 1) * objectRefSize));
                var valRef = readUInt(buffer.slice(offset + dictoffset + (length * objectRefSize) + i * objectRefSize, offset + dictoffset + (length * objectRefSize) + (i + 1) * objectRefSize));
                var key = parseObject(keyRef);
                var val = parseObject(valRef);
                if (debug) {
                    console.log("  DICT #" + tableOffset + ": Mapped " + key + " to " + val);
                }
                dict[key] = val;
            }
            return dict;
        }
    }

    return [parseObject(topObject)];
};

// 你的数据放在`window.__DATA__` 中
var result0 = btool(window.__DATA__);
console.warn(result0);
result1 = decrypto(result0[1], result0[0])
console.warn(result1);
window.result=parseBuffer(result1)
console.warn(window.result)
```

# 总结

0. 初步能跑搞了一天多，后续优化找库花了更多时间。
1. 前端搞这些加密真没卵用，对于我很少做逆向的，除了恶心我两天，最后还是能获取到数据，当然wasm我还没尝试过逆向
2. 学到了还有`xxhash`这玩意, 以前只了解`md5`, `sha`
3. 虽然前端代码通过打包，让很多变量看不到了，但是依赖的库中的字符串，hash值依然是很容易入手的点，加上体验很好的chrome断点调试
4. 毕竟js不是强类型，出现Buffer/Uint8array 这种比较模糊的，可以先实现，后整理
5. 实际上后续发现，虽然搜索做了这个加密，但实际上，还有推荐`https://book.douban.com/j/subject_suggest?q=%E5%AE%9E%E5%8F%98%E5%87%BD+%E6%95%B0` 直接返回的json，另外点开`https://book.douban.com/subject/4828876/` 以后 也是html源码中就有数据，好像完全不需要本篇的破解
6. 有些通用的能找到源码，但有些被魔改的部分还是需要手动定位。

# Ref

[xxhash google](https://code.google.com/archive/p/xxhash/)

[xxhashjs](https://www.npmjs.com/package/xxhashjs)

[xxhash.min.js](https://github.com/pierrec/js-xxhash/blob/master/build/xxhash.min.js)

[Uint8Array.prototype.copy](http://tnga.github.io/lib.ijs/docs/i_core.js.html)

[bplistparser](https://github.com/joeferner/node-bplist-parser/blob/master/bplistParser.js)

[buffer.min.js](https://bundle.run/buffer@6.0.3)

