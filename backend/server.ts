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


const handleServerError = (error) => {
  logger.error('An error occured when starting the server:');

  if (error.code === 'EADDRINUSE') {
    logger.error('EADDRINUSE: Address in use.');
  }

  if (error.code === 'EACCES') {
    logger.error('EACCES: permission denied.');
    logger.error('Maybe it helps if you run NENO with admin/sudo permission.');
  }

  logger.error("This is the original error:");
  // eslint-disable-next-line
  console.log(error);
  logger.error("Exiting now.");
  process.exit(1);
}


const startServer = async ({
  app,
  certKeyPath,
  certPath,
  useHttps,
  httpPort,
  httpsPort,
  timeout,
  ipv6Only,
}) => {
  if (ipv6Only) {
    logger.info("ipv6-only mode enabled");
  }

  // if ipv6 only is enabled we want to listen only to the unspecified
  // ipv6 address (::). if both ipv4 and ipv6 are enabled, we should let 
  // node.js decide which host is used.
  const host = ipv6Only ? "::" : null;

  if (useHttps) {
    const httpsServer = https.createServer(
      {
        key: await fs.readFile(certKeyPath),
        cert: await fs.readFile(certPath)
      },
      app as RequestListener,
    );
    httpsServer.timeout = timeout;
    httpsServer.listen({
      port: httpsPort,
      ipv6Only,
      host,
    });
    httpsServer.on('clientError', handleClientError);
    httpsServer.on('error', handleServerError);
    logger.info("HTTPS access ready on port " + httpsPort);
    
    if (httpPort === 80 && httpsPort === 443) {
      // redirect http requests to https
      const httpServer = http.createServer(function (req, res) {
        res.writeHead(301, {
          "Location": "https://" + req.headers['host'] + req.url,
        });
        res.end();
      }).listen({
        port: httpPort,
        ipv6Only,
        host,
      });
      httpServer.on('clientError', handleClientError);
      httpServer.on('error', handleServerError);
      logger.info(
        "HTTP requests to port "
        + httpPort + " will be redirected to HTTPS.",
      );
    }
  } else {
    const httpServer = http.createServer(app);
    httpServer.timeout = timeout;
    httpServer.listen({
      port: httpPort,
      ipv6Only,
      host,
    });
    httpServer.on('clientError', handleClientError);
    httpServer.on('error', handleServerError);
    logger.info("HTTP access ready on port " + httpPort);
  }
};

export default startServer;