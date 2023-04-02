const win = require('window')
const mdns = require('bonjour-service')
let mytab =[["nom","ip","port"]]
const instance = new mdns.Bonjour()

// advertise an arduino server on port 8266
instance.publish({name: 'My Web Server',type: 'arduino',  port: 8266 })

// browse for all carnode services with udp protocol
let timer =setTimeout(affichage,5000)
instance.find({type: 'carnode',protocol:'udp' }, function (service) {
    mytab.push(service.name,service.addresses,service.port)
    console.log(service.name)
    
})

function affichage()
{
    console.log(mytab)
    instance.destroy()
    clearTimeout(timer);
}








