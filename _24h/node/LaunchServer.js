const win = require('window')
const mdns = require('bonjour-service')
let mytab = [];//[["nom","ip","port"]]
var nom=""
const instance = new mdns.Bonjour()
const dgram = require('dgram');
//const socketReceive = dgram.createSocket('udp4');

// advertise an arduino server on port 8266
instance.publish({name: 'My Web Server',type: 'arduino',  port: 8266 })

// browse for all carnode services with udp protocol
let timer =setTimeout(Init,3000)
instance.find({type: 'carnode',protocol:'udp' }, function (service) {
    console.log(service.name);
    mytab.push([service.name,service.addresses[0],service.port])

})
function Init() {
    instance.destroy()
    clearTimeout(timer);
    console.log(mytab);
    var fs = require('fs');
    var http = require('http').createServer(function (req, res) {
        fs.readFile('main.html',
            function (err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error loading index.html');
                }

                res.writeHead(200);
                res.end(data);
            }
        );
    });


    var io = require('socket.io')(http);
//////////////////////////////////////////////////////////////:
    /*let mytab = [
        ["florian", "ip", "port"],
        ["nom1", "ip1", "port1"]
    ];*/
    var json = convertToJSON(mytab);
///////////////////////////////////////////////////////////////////////

    http.listen(80);

    io.on('connection', function (socket) {
        socket.emit('json', json);

        socket.emit('welcome', {message: 'Vous êtes connecté au chat !'});
        socket.on('message', function (data) {
            console.log('Message: ' + data);
            socket.broadcast.emit('message', {message: data});
        });
        let selectedCar;
        socket.on('getIdvoitureSelected', function (json) {
            selectedCar = JSON.parse(json);
            nom = selectedCar[1];
            console.log("Voiture Selectionné");
            console.log(nom);
            //Server();
            const socketReceive = dgram.createSocket('udp4');

            socketReceive.bind(4211)
            socketReceive.on("listening", function() {
                this.setBroadcast(true);
                this.addMembership('239.255.0.1');
                console.log('Multicast listening . . . ')
            })

            var trame = {RSSI: [3,5], IR: [9,2], SIMU: [11, 7] ,HEADLIGHTS: [17, 3], COLOR: [3,7], BATTERY: [11,5], IMU: [15, 13] ,PILOTS: [28, 6]};
            var data = {Battery: 100, Vitesse: 0}
            socketReceive.on('message', (msg, remote) => {
                if(remote.address == selectedCar[0]) {
                    console.log(remote.address)
                    console.log(msg)
                    console.log(msg.length)

                    if (msg.length == 34) { //20
                        var Battery = msg.slice(trame.BATTERY[0], trame.BATTERY[0] + trame.BATTERY[1])
                        console.log(Battery)
                        Battery = Battery.slice(3,5)
                        var temp = Battery[1]
                        Battery[1] = Battery[0]
                        Battery[0] = temp
                        console.log(parseInt(Battery.toString('hex'),16))
                        console.log(100 - parseInt(Battery.toString('hex'),16) /100)
                        Battery = 100 - parseInt(Battery.toString('hex'),16) /100;
                        data.Battery = Battery
                        let tabbattery=[Battery];
                        console.log("zezaaezezeazazeeazezeaazeeazza")
                        console.log(tabbattery);
                        let jsonbatt=JSON.stringify(tabbattery);
                        console.log(jsonbatt);

                        socket.broadcast.emit('baterie',jsonbatt);

                    }
                    if (msg.length == 20) { //20
                        console.log(msg.slice(trame.IMU[0], trame.IMU[0] + trame.IMU[1]))
                    }
                }

            })




        });
        socket.on('getColorSelectect', function (json) {
            let color = JSON.parse(json).slice(1);
            console.log(color);
        })

    });


}

function Server()
{
    //console.log(mytab[name])

    //socket.bind(4211)
    socket.on("listening", function() {
        this.setBroadcast(true);
        this.addMembership('239.255.0.1');
        console.log('Multicast listening . . . ')
    })

    var trame = {RSSI: [3,5], IR: [9,2], SIMU: [11, 7] ,HEADLIGHTS: [17, 3], COLOR: [3,7], BATTERY: [11,5], IMU: [15, 13] ,PILOTS: [28, 6]};

    socket.on('message', (msg, remote) => {
        if(remote.address == mytab[nom][1][0]) {
            console.log(remote.address)
            console.log(msg)
            console.log(msg.length)

            if (msg.length == 34) { //20
                console.log(msg.slice(trame.COLOR[0], trame.COLOR[0] + trame.COLOR[1]))
            }
        }

    })


    /*const client = dgram.createSocket('udp4');
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
    }*/

}



function convertToJSON(tab) {
    var headers = tab[0];
    var data = tab.slice(1);
    var result = [];

    data.forEach(function(row) {
        var obj = {};
        headers.forEach(function(header, index) {
            obj[header] = row[index];
        });
        result.push(obj);
    });

    return JSON.stringify(result);
}





