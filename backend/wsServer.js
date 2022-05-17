var fs = require("fs");
var ws = require("ws");
const https = require("https");
const axios = require("axios");
const config = require("./config.js").load();

const { response } = require("express");
var WebSocket = ws.WebSocket;
var WebSocketServer = ws.WebSocketServer;

class wsServer {
  constructor(app) {
    this.wss = null;
    this.clients = null;
    this.app = app;
    this.init();
  }
  /**
   * Initialize Websocket server
   */
  init() {
    //clients Mapping
    this.clients = new Map();

    const server = https.createServer({
      cert: fs.readFileSync(process.cwd() + config.server.certificateSSL),
      key: fs.readFileSync(process.cwd() + config.server.privateKeySSL),
    });

    server.on("error", (e) => {
      console.log("Start https server error.", e);
    });

    server.listen(config.server.webSocketPort, function listening() {
      server.maxConnections = config.server.maxConnections;
      console.log("Secure websocket is listening on port: " + config.server.webSocketPort);
    });
    console.log("WebSocket server is starting");

    this.wss = new WebSocketServer({
      server,
      maxPayload: config.server.maxPayloadWebSocket,
      perMessageDeflate: {
        zlibDeflateOptions: {
          // See zlib defaults.
          chunkSize: 4096,
          memLevel: 7,
          level: 3,
        },
        zlibInflateOptions: {
          chunkSize: 50 * 4096,
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 512000, // Size (in bytes) below which messages
        // should not be compressed.
      },
    });
    let wss = this.wss;
    this.wss.on("connection", (client) => {
      client.clientId = Date.now();
      //Adding to clients map
      this.clients.set(client.clientId, client);

      console.log("Connection with id: " + client.clientId + " has been open");
      let msg = JSON.stringify({ action: "connect", state: "ok", clientId: client.clientId, msg: "Welcolme client!!!" });
      client.send(msg);

      client.on("message", (message) => {
        console.log("New message received: %s", message);
      });

      client.on("close", () => {
        console.log("Connection with id: " + client.clientId + " has been closed");
        //Remove from client MAp
        this.clients.delete(client.clientId);
      });
    });
  }
}

module.exports = {
  startServer(app) {
    this.wsServer = new wsServer(app);
    return this.wsServer;
  },
};
