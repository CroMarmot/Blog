---
title: vue-node-protobuf
date: 2019-11-25 11:20:14
tags: [json, protobuf]
category: [code, frontend]
---

# 步骤

`yarn add protobuf cors protobufjs`


生成js

`pbjs -t static-module -w es6 -o ./proto/msgProto.js ./proto/message.proto`

运行server:`node index.js`

# 代码清单

## proto/message.proto

```proto
message Message {
    required string text = 1;
    required string lang = 2;
}
```


## server代码index.js

注意修改`let protoFolderName = '../'`

```
// https://protobufjs.github.io/protobuf.js/

const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
const messages = [
  {text: 'hey', lang: 'english'},
  {text: 'isänme', lang: 'tatar'},
  {text: 'hej', lang: 'swedish'}
];
let protoFolderName = '../'
app.use (function(req, res, next) {
  if (!req.is('application/octet-stream')){
    return next()
  }
  var data = [] // List of Buffer objects
  req.on('data', function(chunk) {
    data.push(chunk) // Append Buffer object
  })
  req.on('end', function() {
    if (data.length <= 0 ) return next()
    data = Buffer.concat(data) // Make one large Buffer of it
    console.log('Received buffer', data)
    req.raw = data
    next()
  })
})


let ProtoBuf = require('protobufjs')
let root = ProtoBuf.loadSync(
  path.join(__dirname,
    protoFolderName,
    'message.proto')
)

let Message = root.lookupType("Message");

app.get('/api/messages', (req, res, next)=>{
  let msg = Message.create(messages[Math.round(Math.random()*2)])
  console.log('Encode and decode: ', Message.decode(Message.encode(msg).finish()))
  console.log('Buffer we are sending: ', Message.encode(msg).finish())
  // res.send(msg.encode().toBuffer(), 'binary') // alternative
  res.send(Message.encode(msg).finish())
  // res.send(Buffer.from(msg.toArrayBuffer()), 'binary') // alternative
})

app.post('/api/messages', (req, res, next)=>{
  if (req.raw) {
    try {
      // Decode the Message
      let msg = Message.decode(req.raw)
      console.log('Received "%s" in %s', msg.text, msg.lang)
      console.log('Received :',msg);

      msg = Message.create(messages[Math.round(Math.random()*2)])
      console.log('Encode and decode: ', Message.decode(Message.encode(msg).finish()))
      console.log('Buffer we are sending: ', Message.encode(msg).finish())
      // res.send(msg.encode().toBuffer(), 'binary') // alternative
      res.send(Message.encode(msg).finish())
    } catch (err) {
      console.log('Processing failed:', err)
      next(err)
    }
  } else {
    console.log("Not binary data")
  }
})

app.all('*', (req, res)=>{
  res.status(400).send('Not supported')
})

const PORT=3001;
app.listen(PORT,()=>{
  console.log(`app listening on port ${PORT}!`);
});
```


## vue 代码


    <template>
      <div class="container">
        {{ msg }}
        <button @click="postProtobuf()">
          post
        </button>
        <button @click="getProtobuf()">
          get
        </button>
        <code>
          proto生成js "proto2js": "pbjs -t static-module -w es6 -o ./proto/msgProto.js ./proto/message.proto",
        </code>
        <code>
          proto生成ts "js2ts": "pbts -o ./proto/msgProto.d.ts ./proto/msgProto.js",
        </code>
      </div>
    </template>
    
    <script>
    /* eslint-disable new-cap */
    import * as msgProto from '~/proto/msgProto.js'
    
    export default {
      components: {},
      data() {
        return {
          val: process.env.baseUrl,
          msg: {}
        }
      },
      mounted() {
      },
      methods: {
        getProtobuf() {
          this.$axios.get(
            'http://127.0.0.1:3001/api/messages',
            { responseType: 'arraybuffer' }
          ).then((response) => {
            console.log('Response from the server: ', response)
            const data = new Uint8Array(response.data) // important !
            const ret = msgProto.Message.decode(data)
            console.log('Decoded message', ret)
            this.msg = ret.toJSON()
          })
        },
        postProtobuf() {
          const msg = new msgProto.Message({ text: 'yx xr', lang: 'slang' })
          const buffer = msgProto.Message.encode(msg).finish()
          console.log('de(en(msg))', msgProto.Message.decode(buffer))
          console.log('send:', msg)
          console.log('send buffer:', buffer)
          this.$axios.$post(
            'http://127.0.0.1:3001/api/messages',
            buffer,
            {
              headers: { 'Content-Type': 'application/octet-stream' },
              responseType: 'arraybuffer'
            }
          ).then((response) => {
            console.log('Response from the server: ', response)
            const data = new Uint8Array(response) // important !
            const ret = msgProto.Message.decode(data)
            console.log('Decoded message', ret)
            this.msg = ret.toJSON()
          }).catch(function(response) {
            console.log(response)
          })
        }
      }
    }
    </script>
    
    <style>
    .container {
      margin: 0 auto;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    
    .title {
      font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      display: block;
      font-weight: 300;
      font-size: 100px;
      color: #35495e;
      letter-spacing: 1px;
    }
    
    .subtitle {
      font-weight: 300;
      font-size: 42px;
      color: #526488;
      word-spacing: 5px;
      padding-bottom: 15px;
    }
    
    .links {
      padding-top: 15px;
    }
    </style>
