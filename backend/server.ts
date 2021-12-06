import http, { RequestListener } from "http";
import https from "https";
import * as logger from "./lib/logger.js";
import fs from "fs/promises";

const handleClientError = (err, socket) => {
  // @ts-ignore
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
};

const startServer = async ({
  app,
  certKeyPath,
  certPath,
  useHttps,
  port,
  httpsPort,
  timeout,
}) => {
  if (useHttps) {
    const httpsServer = https.createServer(
      {
        key: await fs.readFile(certKeyPath),
        cert: await fs.readFile(certPath)
      },
      app as RequestListener,
    );
    httpsServer.timeout = timeout;
    httpsServer.listen(httpsPort);
    httpsServer.on('clientError', handleClientError);
    logger.info("HTTPS access ready on port " + httpsPort);
    
    if (port === 80 && httpsPort === 443) {
      // redirect http requests to https
      const httpServer = http.createServer(function (req, res) {
        res.writeHead(301, {
          "Location": "https://" + req.headers['host'] + req.url,
        });
        res.end();
      }).listen(port);
      httpServer.on('clientError', handleClientError);
      logger.info(
        "HTTP requests to port "
        + port + " will be redirected to HTTPS.",
      );
    }
  } else {
    const httpServer = http.createServer(app);
    httpServer.timeout = timeout;
    httpServer.listen(parseInt(port));
    httpServer.on('clientError', handleClientError);
    logger.info("HTTP access ready on port " + port);
  }
};

export default startServer;