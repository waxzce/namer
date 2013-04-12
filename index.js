
module.exports = function(app, server) {

   var uuid = require('node-uuid')
   ,   whois = require('whoisjs').whois
   ,   sys = require('sys')
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
          
                io.sockets.in(data.chanel_id).emit('word_change_event', data);
             
          
       });
       
       socket.on('whois_ask', function(data) {
          try{
          var who = new whois();
          who.query(data.domain_name, function(res) {
             data['available'] = res.available();
             //console.log(sys.inspect(data));
             
             io.sockets.emit('whois_know', data); //in(data.chanel_id).
          }.bind(this));
          }catch(err){
             console.log(err);
          }
       });
       
      
    });


}