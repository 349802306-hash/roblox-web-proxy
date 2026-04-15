const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const ROBLOX_API = 'https://www.roblox.com';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Proxy all requests
app.all('*', async (req, res) => {
  try {
    const targetUrl = `${ROBLOX_API}${req.originalUrl}`;
    
    const config = {
      method: req.method,
      url: targetUrl,
      headers: {
        ...req.headers,
        host: new URL(targetUrl).hostname,
      },
      data: req.body,
      validateStatus: () => true,
      maxRedirects: 5,
    };

    console.log(`Forwarding to: ${targetUrl}`);
    const response = await axios(config);
    
    // Forward response headers
    Object.keys(response.headers).forEach(key => {
      if (!['content-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, response.headers[key]);
      }
    });
    
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(`Proxy error: ${error.message}`);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message 
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Roblox Web Proxy running on http://localhost:${PORT}`);
  console.log(`Forwarding requests to: ${ROBLOX_API}`);
});