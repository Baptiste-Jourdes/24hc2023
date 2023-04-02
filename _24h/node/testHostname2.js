var bonjour = require('bonjour')()

// advertise an HTTP server on port 3000
bonjour.publish({ name: 'CarNode-Simu6.local', type: 'arduino', port: 23 })

// browse for all http services
bonjour.find({ name: 'CarNode-Simu6.local', type: 'arduino' }, function (service) {
    console.log('Found an HTTP server:', service)
})