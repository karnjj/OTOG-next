const express = require("express");
const path = require('path')
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3002
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    server.use('/service-worker.js', express.static(path.join(__dirname, '.next', '/service-worker.js')))
    server.get("*", (req, res) => {
      return handle(req, res);
    });
    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Next.js ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });