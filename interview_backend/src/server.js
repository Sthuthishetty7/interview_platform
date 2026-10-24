const http = require("http");
const env = require("./config/env");
const app = require("./app");
const prisma = require("./lib/prisma");

const server = http.createServer(app);

server.listen(env.port, () => {
  console.log(`Backend running at http://localhost:${env.port}`);
});

// Closes things cleanly when you press Ctrl + C.
async function shutdown() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);