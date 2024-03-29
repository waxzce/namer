
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
          io.sockets.in('B--'+data.chanel_id).emit('word_change_event', data);
       });

       socket.on('word_del_event', function(data) {
          io.sockets.in('B--'+data.chanel_id).emit('word_del_event', data);
       });

       
       socket.on('whois_ask', function(data) {
          try{
          var who = new whois();
          who.query(data.domain_name, function(res) {
             data['status'] = function(response){
                 if (response.available()){
                    return 'available';
                 }else if(res.unavailable){
                    return 'unavailable';
                 }else if(res.timeout){
                    return 'timeout';
                 }else if(res.error){
                    return 'error';
                 }else {
                    return 'unknown';
                 }
              }(res);
            io.sockets.in('B--'+data.chanel_id).emit('whois_know', data); //in(data.chanel_id).
          }.bind(this));
          }catch(err){
             data['status'] = 'error';
             io.sockets.in('B--'+data.chanel_id).emit('whois_know', data); //in(data.chanel_id).
          }
       });
       
      
    });


}