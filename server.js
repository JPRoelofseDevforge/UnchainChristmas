'use strict';

const { createServer } = require('http');
const next = require('next');

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    createServer((req, res) => {
      // Ensure correct protocol behind Azure's proxy (helps with redirects/cookies)
      if (process.env.WEBSITE_SITE_NAME) {
        req.headers['x-forwarded-proto'] = req.headers['x-forwarded-proto'] || 'https';
      }
      handle(req, res);
    }).listen(port, () => {
      console.log(`Next.js server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error starting Next.js server:', err);
    process.exit(1);
  });