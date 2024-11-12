const net = require("net");
console.log("Logs from your program will appear here!");

const STORAGE = {};

// Create server
const server = net.createServer((connection) => {
  console.log('Client connected');

  connection.on("data", (data) => {
    const commands = Buffer.from(data).toString().split("\r\n");
    if (commands[2] === "ECHO") {
      connection.write(`+${commands[4]}\r\n`);
    } else if (commands[2] === "SET") {
      connection.write("+OK\r\n");
      STORAGE[commands[4]] = commands[6];
      if (commands[10]) {
        setTimeout(() => {
          delete STORAGE[commands[4]];
        }, commands[10]);
      }
    } else if (commands[2] === "GET") {
      if (STORAGE[commands[4]])
        connection.write(
          `$${STORAGE[commands[4]].length}\r\n${STORAGE[commands[4]]}\r\n`,
        );
      else connection.write("$-1\r\n");
    } else connection.write("+PONG\r\n");
  });
// Handle end
connection.on('end', () => {
    console.log('   Client disconnected');
});

  // Optional: Handle errors
  connection.on('error', (err) => {
    console.error('Error: ', err);
  });
});

server.listen(6379, "127.0.0.1");
