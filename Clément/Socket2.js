
const win = require('window')
const mdns = require('bonjour-service')
let mytab =[["nom","ip","port"]]
var nom=""
const instance = new mdns.Bonjour()
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

// advertise an arduino server on port 8266
instance.publish({name: 'My Web Server',type: 'arduino',  port: 8266 })

// browse for all carnode services with udp protocol
let timer =setTimeout(affichage,5000)
instance.find({type: 'carnode',protocol:'udp' }, function (service) {
    mytab.push([service.name,service.addresses,service.port])
    
})

function affichage()
{
    
    instance.destroy()
    clearTimeout(timer);
    for(var i =1 ;i<mytab.length;i++)
    {
        console.log(mytab[i][0]+" taper : "+i )
    }
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('Quelle voiture choisir : ', st => {
        console.log(`Vous avez choisi la voiture :${mytab[st][0]}`);
        nom=st;
        Server()
        readline.close();
        

      });
      
}

function Server()
{
 //console.log(mytab[name])

 socket.bind(4211)
 socket.on("listening", function() {
   this.setBroadcast(true);
   this.addMembership('239.255.0.1');
   console.log('Multicast listening . . . ')
 })

    var trame = {RSSI: [3,5], IR: [9,2], SIMU: [11, 7] ,HEADLIGHTS: [17, 3], COLOR: [3,7], BATTERY: [11,5], IMU: [15, 13] ,PILOTS: [28, 6]};
    var hasFirst = false;

    socket.on('message', (msg, remote) => {
        if(remote.address == mytab[nom][1][0]) {
            console.log(remote.address)
            console.log(msg)
            console.log(msg.length)

            if (msg.length == 34) { //20
                //console.log(msg.slice(trame.RSSI[0], trame.RSSI[0]+trame.RSSI[1]).toString('hex'));
                //if (msg.slice(trame.RSSI[0], trame.RSSI[0] + trame.RSSI[1]).toString('hex') == '01c2ffffff') {
                    console.log(msg.slice(trame.COLOR[0], trame.COLOR[0] + trame.COLOR[1]))
                //}
            }
        }

    })


 const client = dgram.createSocket('udp4');
//Envoyer un message UDP
  for(let  i=0;i<9;i++)
  {
    let frame = new Uint8Array([0x43, 0x49, 0x53, 0x02 , 0x00 , 0x00 ,0x00 ,0x00,0x00,0x00, 0x33, 0x00, 0xff, 0x00 ]);
    const message = Buffer.from('Hello, world!');
    console.log(mytab[nom][1][0])
    client.send(frame, 0, frame.length, mytab[nom][2], mytab[nom][1][0], (err) => {
      if (err) {
        console.error(`Erreur lors de l'envoi du message : ${err}`);
      } else {
        console.log('Message envoyé avec succès.');
      }
    });
  }

}


