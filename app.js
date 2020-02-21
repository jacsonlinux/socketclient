const si = require('systeminformation');
const WebSocketClient = require('websocket').client;
const client = new WebSocketClient();
const IP_SERVER = '192.168.1.217';
const PORT = '1983';
let UUID;

client.on('connectFailed', error => {
    console.log('Connect Error: ' + error.toString());
});
client.on('connect', connection => {
    console.log('WebSocket Client Connected');
    connection.on('error', error => {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', () => {
        console.log('echo-protocol Connection Closed');
    });
    function getDataSystem() {
        if (connection.connected) {
            console.log('Get static data system...');
            return si.getStaticData()
                .then(data => {
                    UUID = data.system.uuid;
                    data.type = 'static';
                    connection.sendUTF(JSON.stringify(data));
                    setTimeout(getDataSystemDynamic, 1000);
                } )
                .catch(error => console.error(error));
        }
    }
    function getDataSystemDynamic() {
        if (connection.connected) {
            console.log('Get dynamic data system...');
            return si.getDynamicData()
                .then(data => {
                    data.uuid = UUID;
                    data.type = 'dynamic';
                    connection.sendUTF(JSON.stringify(data));
                    setTimeout(getDataSystemDynamic, 1000);
                } )
                .catch(error => console.error(error));
        }
    }
    getDataSystem();
});
client.connect(`ws://${IP_SERVER}:${PORT}/`, 'echo-protocol');