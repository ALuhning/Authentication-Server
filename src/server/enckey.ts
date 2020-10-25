import route from "koa-route";

interface EncKey {
    pubkey: string
    enckey: string
}

const enckey = route.all('/ws/enckey', (ctx) => {
  /** Emittery allows us to wait for the challenge response event */
  
  ctx.websocket.on('message', async (msg) => {
    try {
      /** All messages from client contain {type: string} */
      const data = JSON.parse(msg.toString());
      switch (data.type) {
        case 'enckey': {
          /** A new token request will contain the user's public key */
          if (!data.pubkey) { throw new Error('missing pubkey') }
    
          /** Include the token in the auth payload */
          const payload: EncKey = {
            pubkey: data.pub,
            enckey: process.env.ENC_KEY
          };

          const returnData = {
              type: 'enckey',
              value: payload
          }
          
          /** Return the result to the client */
          ctx.websocket.send(JSON.stringify(returnData))
        
          break;
        }
        ctx.websocket.close()
      }
    } catch (error) {
      /** Notify our client of any errors */
      ctx.websocket.send(JSON.stringify({
        type: 'error',
        value: error.message,
      }))
      ctx.websocket.close()
    }
  });
});

export default enckey;