
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
       socket.on('chanel_choice', function(data) {
   		    socket.join('B--'+data.chanel_id);
       });
       
       socket.on('word_change_event', function(data) {
          for(var i in io.sockets.manager.roomClients[socket.id]){
             console.log(i);
             
             i = i.substring(1);
             console.log(i);
             if(i.match(/B\-\-.+/)){
                io.sockets.in(i).emit('word_change_event', data);
             }
          }
       });
       
      
    });


}