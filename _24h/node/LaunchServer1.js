var fs   = require('fs');
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
var io   = require('socket.io')(http);
//////////////////////////////////////////////////////////////:
let mytab = [
    ["florian", "ip", "port"],
    ["nom1", "ip1", "port1"]
];
var json = convertToJSON(mytab);
///////////////////////////////////////////////////////////////////////

http.listen(80);

io.on('connection', function (socket) {
    socket.emit('json', json);
    socket.emit('welcome', { message: 'Vous êtes connecté au chat !' });
    socket.on('message', function (data) {
        console.log('Message: ' + data);
        socket.broadcast.emit('message', {message: data});
    });
    socket.on('change', function (data) {
        console.log('Change: ');
        console.log("test");
        const json = '{"result":true, "count":42}';
        const obj = JSON.parse(json);
        io.emit('salut', obj);

    });
});
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





