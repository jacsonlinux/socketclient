const net = require('net');

const si = require('systeminformation');

const client = new net.Socket();

client.connect(1983, '0.0.0.0', () => {
    console.log('TCP connection established with the server.');
    getDataSystem()
        .then(res => {
            client.write(`${JSON.stringify(res)}`);
            client.pipe(client);
            console.log('The data was sent successfully');
        })
        .catch(error => console.error(error));
});

client.on('end', () => {
    console.log('The connection was terminated');
});

client.on('error', err => {
    console.log(`${err}`);
});

async function getDataSystem() {
    console.log('Get data system...');
    return si.getStaticData()
        .then(data => data )
        .catch(error => console.error(error));
}
