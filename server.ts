import http from 'http';
import debug from 'debug';
import { HttpError } from 'http-errors';

import app from './Server/Config/app';

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val:string)
{
  const port = parseInt(val, 10);

  if (isNaN(port)) return val;
  if (port >= 0) return port;

  return false;
}

function onError(error: HttpError)
{
  if (error.syscall !== 'listen') throw error;

  let bind = (typeof port === 'string' ? 'Pipe ' : 'Port ') + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening()
{
  let addr = server.address() as string;
  let bind = 'pipe ' + addr;

  debug('Listening on ' + bind);
}
