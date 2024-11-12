const net = require("net");
console.log("Logs from your program will appear here!");

const STORAGE = {};

// Create server
const server = net.createServer((connection) => {
  console.log('Client connected');

  connection.on('data', (data) => {
    console.log('   Data received: ' + data.toString());
    const msg = data.toString().split('\r\n')
    const command = msg[2]
    const arg = msg[4]
    switch (command) {
        case 'ECHO':
            connection.write(`$${arg.length}\r\n${arg}\r\n`)
            break
        case 'PING':
            connection.write('+PONG\r\n')
            break
        case 'SET':
            STORAGE[msg[4]] = msg[6]
            connection.write('+OK\r\n')
            break
        case 'GET':
            connection.write(`$${STORAGE[msg[4]].length}\r\n${STORAGE[msg[4]]}\r\n` || '$-1\r\n')
            break
        default:
            1
            break
    }
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
