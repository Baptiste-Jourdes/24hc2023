const mdns = require('mdns-js');

const hostname = 'example.local'; // remplacez par le hostname de votre service

const browser = mdns.createBrowser(mdns.tcp('http'));

browser.on('serviceUp', service => {
    if (service.host === hostname) {
        console.log(`Le service ${service.name} est disponible à l'adresse ${service.addresses[0]}:${service.port}`);
        // vous pouvez interagir avec le service ici
    }
});

browser.start();
