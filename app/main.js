const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Create server
const server = net.createServer((connection) => {
  console.log('Client connected');

  // Handle incoming data
  connection.on('data', (data) => {
      // connection.write('+PONG\r\n'); 
      const commnad = Buffer.from(data).toString().split("\r\n");

      if(commnad[2] == 'ECHO'){
        const str = commnad[4];
        const l = str.length;
        return connection.write("$" + l + "\r\n" + str + "\r\n");
      }
      connection.write('+PONG\r\n')
  });

  connection.on('end', () => {
    console.log('Client disconnected');
  });

  // Optional: Handle errors
  connection.on('error', (err) => {
    console.error('Error: ', err);
  });
});

server.listen(6379, "127.0.0.1");
