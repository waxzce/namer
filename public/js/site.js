(function(){

var socket = io.connect(window.location.protocol+'//'+window.location.host);

// Utils 

var get_chanel_id = function(){
   var p = window.location.pathname;
   return p.substring(p.lastIndexOf('/')+1);
};

var get_val = function(i, e){
   return $(e).val();
};


// Word object

var Word = (function(){

   var W = function (o) {
       this.initialize(o);
   };
   
   var p = W.prototype = new EventProducer();
   
   p.initialize_event = p.initialize;

   // init & bindings
   
   p.initialize = function (o) {
       this.initialize_event();
       this.addEventListener('changer', this.mix);
   };
   
   p.socket_bind = function (s) {
      s.on('word_change_event', _.bind(this.change_event,this));
      s.on('word_del_event', _.bind(this.delete_event,this));
       
   };
   
   // socket send
   
   p.newOrChange = function(e){   
      e['chanel_id'] = get_chanel_id();
      socket.emit('word_change_event', e);   
   };
   
   p.delete = function(e){   
      e['chanel_id'] = get_chanel_id();
      socket.emit('word_del_event', e);
        
   };
   
   // socket listeners
   
   p.change_event = function(e){
      var w = $('.words input[type="text"]').filter(function(){return e.word == $(this).val()});
      if(w.length == 0){
         this.add_word_dom(e.word);
      }else{
         btn_fix_data_drive(w, 'prefix', e);
         btn_fix_data_drive(w, 'suffix', e);
      }   
      this.fireEvent('changer');
   };
   
   p.delete_event = function(e){
      var w = $('.words input[type="text"]').filter(function(){return e.word == $(this).val()});
      w.parent('div.word-block').remove();
      this.fireEvent('changer');
   };
   
   // mix
   
   p.mix = function(){
      word_mix();
   };
   
   // DOM
     
   p.buildFromDom = function(d){
      return {
           word:d.val(), 
           prefix:d.data('prefix'), 
           suffix:d.data('suffix')
        }
   };
   
   p.add_word_dom = function(w){
      var c = $('#templater div.word-block').clone();
      var i = c.find('input[type=text]');
      i.val(w);
      c.find('.btn-fix').click(btn_fix_click);
      c.find('.btn-delete').click(btn_delete_click);
      $('div.words').prepend(c);
      return i;
   };
   
   // return just one instance
   return new W();

})();



/*
var word_change_event = function(e){   
   socket.emit('word_change_event', {
      word:e.val(), 
      prefix:e.data('prefix'), 
      suffix:e.data('suffix'),
      chanel_id:get_chanel_id()
   });
   word_mix();
   
};

var word_del_event = function(e){
   console.log(e);
   socket.emit('word_del_event', {
      word:e.val(), 
      chanel_id:get_chanel_id()
   });
   word_mix();
};

var word_change_listener = function(e){
   var w = $('.words input[type="text"]').filter(function(){return e.word == $(this).val()});
   if(w.length == 0){
      add_word_dom(e.word);
   }else{
      btn_fix_data_drive(w, 'prefix', e);
      btn_fix_data_drive(w, 'suffix', e);
   }   
};

var word_del_listener = function(e){
   var w = $('.words input[type="text"]').filter(function(){return e.word == $(this).val()});
   w.parent('div.word-block').remove();
   word_mix();
};
*/


var btn_fix_click = function(e){
      e.stopPropagation();
      var t = $(e.target), t = (t.prop("tagName") == 'I' ? t.parent(): t);
      t.toggleClass('btn-success').toggleClass('btn-danger');
      var i = t.siblings('input[type=text]');
      i.data((t.hasClass('btn-suffix') ? 'suffix': 'prefix'), (t.hasClass('btn-success') ? true: false));
      Word.newOrChange(Word.buildFromDom(i));
};

var btn_fix_data_drive = function(w, ps, e){
   w.siblings('.btn-'+ps).addClass((e[ps] ? 'btn-success' : 'btn-danger')).removeClass((e[ps] ? 'btn-danger' : 'btn-success'));
   w.data(ps, e[ps]);
};

var btn_delete_click = function(e){
      e.stopPropagation();
      var t = $(e.target), t = (t.prop("tagName") == 'I' ? t.parent(): t);
      var i = t.parent('div.word-block');
      Word.delete(Word.buildFromDom(i.find('input[type="text"]')));
};


/*
var add_word_dom = function(w){
   var c = $('#templater div.word-block').clone();
   var i = c.find('input[type=text]');
   i.val(w);
   c.find('.btn-fix').click(btn_fix_click);
   c.find('.btn-delete').click(btn_delete_click);
   $('div.words').prepend(c);
   return i;
};
*/
var add_word = function(w){
   if(!(_.contains($('.words input[type="text"]').map(get_val),w) || w == '')){
      Word.newOrChange(Word.buildFromDom(input));
      
      //word_change_event(add_word_dom(w));
   }
};

var get_tlds = function(){
return    $('.dn input[type="checkbox"]:checked').map(get_val);
}

var word_mix = function(){
   var a = $('.words input[type="text"]'), p = [], s = [], w = [];
   _.each(a, function(element, index, list){
      var e = $(element);
      var ww = e.val();
      var ip = e.data('prefix');
      var is = e.data('suffix');
      if(ip){
         p.push(ww);
      }
      if(is){
         s.push(ww);
      }
      if(!is && !ip){
         w.push(ww);
      }
   },this);
   var www = w.concat(_.flatten(_.map(p, function(pp, iii, lll){
      return _.compact(_.map(s, function(ss){
         return (pp != ss ? pp + ss : null);
      }, this));
   }, this)));
   
   $('div.proposals div.prop-block').css('display', 'none');
   var tlds = get_tlds();
   _.each(www, function(newword){
      var item = $('#prop__'+newword);
      if(item.length < 1){
         var c = $('#templater div.prop-block').clone();
         c.attr('id','prop__'+newword);
         c.find('h6').text(newword);
         var u = c.find('ul');
         _.each(tlds, function(t){
            u.append('<li class="label to_check">'+newword + '.' + t+'</li>');
         }, this);
      
         $('div.proposals').prepend(c);
      }else{
         item.css('display', 'block');
      }
   }, this);
   launch_whois();
};

var launch_whois = function(){
   _.each($('div.proposals li.to_check').toArray(), function(li){
      li = $(li);
      li.attr('id',li.text().replace('.','___'));
      li.addClass('label-info');
      socket.emit('whois_ask', {domain_name:li.text(), chanel_id:get_chanel_id()});
   });
};

var whois_know_event = function(whois_result){
   $('#'+whois_result.domain_name.replace('.','___')).removeClass('label-info').addClass(function(wr){
      switch(wr.status){
         case 'available' : 
            return 'label-success';
         case 'unavailable' : 
            return 'label-important';
         default : 
            return 'label-warning';
      }}(whois_result));
};



$(function(){
   $('.btn-fix').click(btn_fix_click);
   $('.btn-delete').click(btn_delete_click);
   $('#bmix').click(word_mix);
   $('#form_add_word').submit(function(e){
      e.preventDefault();
      var input = $(e.target).find('input.search-query');
      Word.newOrChange(Word.buildFromDom(input));
//      add_word(input.val());
      input.val('');
   });
   
   socket.on('connect', function () { 
      socket.emit('chanel_choice', {chanel_id:get_chanel_id()});
   });
   Word.socket_bind(socket);

   socket.on('whois_know', whois_know_event);
   
});

})();