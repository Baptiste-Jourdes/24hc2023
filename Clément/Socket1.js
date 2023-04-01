const  dgram=require('dgram');
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
    //const server = dgram.createSocket('udp4');
    const port = 4211;
    //const socket = require('net').connect({host: address, port: port}, () => {

    const dgram = require('dgram');

// Créer une socket UDP
    const socket = dgram.createSocket('udp4');

    socket.bind(port)


    socket.on("listening", function() {
      this.setBroadcast(true);
   //   this.setMulticastTTL(128);
      this.addMembership('239.255.0.1');
      console.log('Multicast listening . . . ')
    })


    socket.on('message', (msg, remote) => {
      console.log(msg)
      if(msg.length == 17) {
        console.log(msg.slice(14, 17))
      }

    })

    const client = dgram.createSocket('udp4');
 //Envoyer un message UDP
     for(let  i=0;i<9;i++)
     {
       let frame = new Uint8Array([0x43, 0x49, 0x53, 0x03, 0x10, 0x01, 0x33, 0x00]);
       const message = Buffer.from('Hello, world!');
       client.send(message, 0, message.length, port, data.addresses[0], (err) => {
         if (err) {
           console.error(`Erreur lors de l'envoi du message : ${err}`);
         } else {
           console.log('Message envoyé avec succès.');
         }
       });
     }

    //server.on('message');
    //console.log('Connected to service');


      // Utilisez le socket pour communiquer avec le service
    //});
  }
});