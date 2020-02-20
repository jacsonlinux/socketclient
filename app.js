const si = require('systeminformation');
const WebSocketClient = require('websocket').client;
const client = new WebSocketClient();

const IP_SERVER = '...';
const PORT = '...';

function getDataSystem() {
    console.log('Get data system...');
    return si.getStaticData()
        .then(data => data )
        .catch(error => console.error(error));
}

client.connect(`ws://${IP_SERVER}:${PORT}/`, 'echo-protocol');

client.on('connectFailed', error => {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', connection => {
    console.log('WebSocket Client Connected.');
    getDataSystem()
        .then(res => {
            connection.sendUTF(JSON.stringify(res));
            console.log('Data sent to server...');
        })
        .catch(err => err.message);
    connection.on('error', error => {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', () => {
        console.log('echo-protocol Connection Closed');
    });
});