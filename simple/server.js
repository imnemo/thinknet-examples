const {THNServer, Protocol, Router} = require('thinknet')
const ProtocolJsonSimple = require('thinknet-protocol-json-simple')
const RouterSimple = require('thinknet-router-simple')

let server = new THNServer()
let protocol = new ProtocolJsonSimple()
let routerIns = new RouterSimple()

routerIns.use({
  'hello': async (ctx) => {
    try {
      let numConnections = await (() => {
        return new Promise((resolve, reject) => {
          ctx.netServer.getConnections((err, count) => {
            if(err)
              reject(err)
            resolve(count)
          })
        })
      })()
      console.log(`recv from ${ctx.client.getId()}`, ctx.data)
      let numClinets = ctx.server.getClientNum()
      console.log(`current online clients: ${numClinets}`)
      console.log(`current online connections: ${numConnections}`)
      let dataStr = ctx.server.protocol.build({
        type: 'hello', counter: ctx.data.counter, from: 'server'
      })
      ctx.socket.write(dataStr)
    }catch(e){
      console.log(e)
    }
  }
})
server.setProtocol(protocol)
server.setRouterIns(routerIns)
server.listen({host: '127.0.0.1', port: 9090}, (err) => {
  if(err) {
    console.error(`listen error`, err)
  }
})