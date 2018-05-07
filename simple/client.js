const {THNClient} = require('thinknet')
const ProtocolJsonSimple = require('thinknet-protocol-json-simple')
const RouterSimple = require('thinknet-router-simple')

let client = new THNClient()
let protocol = new ProtocolJsonSimple()
let routerIns = new RouterSimple()
routerIns.use({
  'hello': (ctx) => {
    console.log(`recv`, ctx.data)
  }
})
client.setProtocol(protocol)
client.setRouterIns(routerIns)
client.useSend((ctx) => {
  let counter = 0
  /** 
   * 这些定时任务一定要在结束后清理
   * 否则当链接断开时，这里还有定时器在跑，进程不会退出，但是socket已经无效了，就会报错
  */
  let timer = setInterval(() => {
    let dataStr = ctx.client.protocol.build({
      type: 'hello', counter: ++counter, from: 'client'
    })
    ctx.socket.write(dataStr)
  }, 1000)
  client.socket.on('close', () => {
    clearInterval(timer)
  })
})
client.connect({host: '127.0.0.1', port: 9090}, (err) => {
  if(err) {
    console.error(`connect error`, err)
  }
})