const mdns = require('mdns-js');
const serviceType = '_carnode._udp.local';
const name = 'CarNode-Simu6._arduino._tcp.local';

// Recherchez les services mDNS
const browser = mdns.createBrowser(serviceType);
browser.on('ready', function() {
  console.log('mdns browser ready');
  browser.discover();
});
browser.on('update', function(data) {
  //console.log('data:', data);
  //console.log('type:', data.type);
  console.log('name:', data.type[0].name);
  if (data.fullname == name){//data.type[0].name == "arduino") {
    console.log('data:', data);
    console.log('Service up: ', data.fullname, data.addresses);

    // Connectez-vous au service
    const address = data.addresses[0];
    const port = data.port;
    const socket = require('net').connect({host: address, port: port}, () => {
      console.log('Connected to service');
      // Utilisez le socket pour communiquer avec le service
    });
  }
});