const net = require('net');
function formatMessage(text = null) {
	if (text) return `+${text}\r\n`;
	return `$-1\r\n`;
}
function formatConfigMessage(key = '', value = '') {
	return `*2\r\n$${key.length}\r\n${key}\r\n$${value.length}\r\n${value}\r\n`;
}
const dataStore = new Map();
const config = new Map();
const arguments = process.argv.slice(2);
const [fileDir, fileName] = [arguments[1] ?? null, arguments[3] ?? null];
if (fileDir && fileName) {
	config.set('dir', fileDir);
	config.set('dbfilename', fileName);
}
const server = net.createServer((connection) => {
	connection.on('data', (data) => {
		const inputString = data.toString();
		const inputArray = inputString.split('\r\n');
		const [, , command, , key = '', , value = '', , px = null, , expiryTime = null] = inputArray;
		const cmd = command.toLowerCase();
		console.log({ cmd, px, expiryTime, dataStore });
		console.log({ inputArray });
		switch (cmd) {
			case 'ping':
				connection.write(formatMessage('PONG'));
				break;
			case 'echo':
				connection.write(formatMessage(key));
				break;
			case 'set':
				dataStore.set(key, value);
				if (px && expiryTime) {
					setTimeout(() => {
						dataStore.delete(key);
					}, expiryTime);
				}
				connection.write(formatMessage('OK'));
				break;
			case 'get':
				const val = dataStore.get(key);
				connection.write(formatMessage(val));
				break;
			case 'config':
				connection.write(formatConfigMessage(value, config.get(value)));
				break;
			default:
				connection.write(formatMessage('Unknown Command'));
				break;
		}
	});
});
server.listen(6379, '127.0.0.1');