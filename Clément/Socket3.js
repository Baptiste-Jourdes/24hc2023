
const win = require('window')
const mdns = require('bonjour-service')
const hex = require('string-hex')
var keypress = require('keypress');
let mytab =[["nom","ip","port"]]
var nom=""
var Text ="43495302000000000000"
const instance = new mdns.Bonjour()

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const client = dgram.createSocket('udp4');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// advertise an arduino server on port 8266
instance.publish({name: 'My Web Server',type: 'arduino',  port: 8266 })

// browse for all carnode services with udp protocol
let timer =setTimeout(affichage,3000)
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
      readline.question('Quelle voiture choisir : ', st => {
        console.log(`Vous avez choisi la voiture :${mytab[st][1][0]}`);
        nom=st;
        //Server()
        CreateTrame()
      });
      
}

function CreateTrame()
{

  console.log("1 - Méthode Engine\n")
  console.log("2 - Méthode Pilot\n")
  console.log("3 - Méthode headlight\n")
  console.log("4 - Méthode Color\n")
  console.log("stop - stop\n")

  readline.question('Quelle mode choisir : ', st => {
    console.log(`Vous avez choisi la voiture :${st}`);
    if(st=="stop")
    {
      Server()
      return
    }
    else{
      switch (st) {
        case "1":
          Text=Text+"10"
          break;
        case "2":
          Text=Text+"11"
          break;
        case "3":
          Text=Text+"12"
            break;
        case "4":
          Text=Text+"33"
          break;
      
        default:
          break;
      }
    }
    readline.question('ajouter le code héxa ', s => {
      Text=Text+s
      CreateTrame()
    });
    
    
    
  });



}







function Server()
{
 //console.log(mytab[name])

 socket.bind(4211)
 socket.on("listening", function() {
   this.setBroadcast(true);
   this.addMembership('239.255.0.1');
   //console.log('Multicast listening . . . ')
 })




    var trame = {RSSI: [3,5], IR: [9,2], SIMU: [11, 7] ,HEADLIGHTS: [17, 3], COLOR: [3,7], BATTERY: [11,5], IMU: [15, 13] ,PILOTS: [28, 6]};
    var hasFirst = false;

    socket.on('message', (msg, remote) => {
        if(remote.address == /*"192.168.0.107"*/mytab[nom][1][0]) {
            //console.log(remote.address)
            //console.log('Voiture 6')
            //console.log(msg)
            //console.log(msg.length)

            if (msg.length == 31) {
                //console.log(msg.slice(trame.RSSI[0], trame.RSSI[0]+trame.RSSI[1]).toString('hex'));
                //if (msg.slice(trame.RSSI[0], trame.RSSI[0] + trame.RSSI[1]).toString('hex') == '01c2ffffff') {

                    //console.log(msg.slice(trame.COLOR[0], trame.COLOR[0] + trame.COLOR[1]))
                //}
            }
        }

    })


 
//Envoyer un message UDP
  for(let  i=0;i<1;i++)
  {
    let frame = new Uint8Array([0x43, 0x49, 0x53, 0x02 , 0x00 , 0x00 ,0x00 ,0x00 ,0x00 ,0x00, 0x33, 0xff, 0xff, 0x00 ]);
    
    
let hexArray = [];

for (let i = 0; i < Text.length; i += 2) {
  let byte = Text.substr(i, 2);
  hexArray.push("0x" + byte);
}
console.log(hexArray)
let message = Buffer.from(hexArray)


    console.log(message)
    client.send(message, 0, message.length, 4210/*mytab[nom][2]*/, /*"192.168.0.107"*/mytab[nom][1][0], (err) => {
      if (err) {
        console.error(`Erreur lors de l'envoi du message : ${err}`);
      } else {
        console.log('Message envoyé avec succès.');   
        //timer =setTimeout(arrete,50)
        vitesse()
      }
    });
  }


  

}

function vitesse()
{



  keypress(process.stdin)
  

let zPressed = false;
let qPressed = false;

  process.stdin.on('keypress',function (ch,key)
  {


    switch (key.name) {
      case 'd':
        timer=setTimeout(tourne_droite,25)
        break;
      case 'q':
        timer=setTimeout(tourne_gauche,25)
        break;
      case 'z':
        timer =setTimeout(mouvment,25)
        break;
      default:
        timer =setTimeout(arrete,25)
        break;
    }



  })

}



function mouvment()
{
  console.log("mouvment")
  frame = new Uint8Array([0x43, 0x49, 0x53, 0x02 , 0x00 , 0x00 ,0x00 ,0x00 ,0x00 ,0x00, 0x10,0x01,0x11, 0x0f, 0xa0, 0x00,0x00 ])
  client.send(frame, 0, frame.length, 4210/*mytab[nom][2]*/, /*"192.168.0.107"*/mytab[nom][1][0], (err) => {
    if (err) {
      console.error(`Erreur lors de l'envoi du message : ${err}`);
    } else {
      console.log('Message envoyé avec succès.');

    }
  });

}

function tourne_gauche()
{
  console.log("tourne_gauche")
  frame = new Uint8Array([0x43, 0x49, 0x53, 0x02 , 0x00 , 0x00 ,0x00 ,0x00 ,0x00 ,0x00, 0x10,0x01, 0x11, 0x0f, 0xa0, 0x1f,0xfe ])
  client.send(frame, 0, frame.length, 4210/*mytab[nom][2]*/, /*"192.168.0.107"*/mytab[nom][1][0], (err) => {
    if (err) {
      console.error(`Erreur lors de l'envoi du message : ${err}`);
    } else {
      console.log('Message envoyé avec succès.');

    }
  });

}

function tourne_droite()
{
  console.log("tourne_droite")
  frame = new Uint8Array([0x43, 0x49, 0x53, 0x02 , 0x00 , 0x00 ,0x00 ,0x00 ,0x00 ,0x00, 0x10,0x01, 0x11, 0x0f, 0xa0, 0xe0,0x02 ])
  client.send(frame, 0, frame.length, 4210/*mytab[nom][2]*/, /*"192.168.0.107"*/mytab[nom][1][0], (err) => {
    if (err) {
      console.error(`Erreur lors de l'envoi du message : ${err}`);
    } else {
      console.log('Message envoyé avec succès.');

    }
  });

}



function arrete()
{
  console.log("arrete")
  frame = new Uint8Array([0x43, 0x49, 0x53, 0x02 , 0x00 , 0x00 ,0x00 ,0x00 ,0x00 ,0x00, 0x10,0x01, 0x11, 0x00, 0x00, 0x00,0x00 ])
  client.send(frame, 0, frame.length, 4210/*mytab[nom][2]*/, /*"192.168.0.107"*/mytab[nom][1][0], (err) => {
    if (err) {
      console.error(`Erreur lors de l'envoi du message : ${err}`);
    } else {
      console.log('Message envoyé avec succès.');

    }
  });
}


