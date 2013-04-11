
module.exports = function(app, server) {

   var uuid = require('node-uuid')
   , io = require('socket.io').listen(server);

    // Home/main
    app.get('/', function(req, res) {
        res.render('index', { title: 'namer' })
    });
    
    app.get('/brainstorms/new', function(req, res) {
       res.redirect('/brainstorms/'+uuid.v4());
    });
    
    app.get('/brainstorms/:id', function(req, res) {
       res.sendfile(__dirname + '/public/brainstorm.html');
    });
    
   
    



    io.sockets.on('connection', function (socket) {
      socket.emit('news', { hello: 'world' });
      socket.on('plop', function (data) {
        console.log(data);
      });
    });


}