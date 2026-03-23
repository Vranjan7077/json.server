const { createApp } = require("./src/app");

const { server, port } = createApp();

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`API base: http://localhost:${port}/api`);
  console.log(`Stats: http://localhost:${port}/api/stats`);
  console.log(`Search: http://localhost:${port}/api/search?q=keyword`);
  console.log(`Login: POST http://localhost:${port}/api/login`);
  console.log(`Me: GET http://localhost:${port}/api/me`);
  console.log(`Logout: POST http://localhost:${port}/api/logout`);
});
