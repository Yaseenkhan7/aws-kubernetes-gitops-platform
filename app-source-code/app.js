const http = require('http');
const os = require('os');

const handler = (req, res) => {
  const { method, url } = req;
  if (method === 'GET' && url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Hello from my Kubernetes App!',
      timestamp: new Date().toISOString(),
      hostname: os.hostname()
    }));
  } else {
    res.writeHead(404).end();
  }
};

const server = http.createServer(handler);
server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
