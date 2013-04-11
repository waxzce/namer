var btn_fix_click = function(e){
      e.stopPropagation();
      var t = $(e.target), t = (t.prop("tagName") == 'I' ? t.parent(): t);
      t.toggleClass('btn-success').toggleClass('btn-danger');
      t.siblings('input[type=text]').data((t.hasClass('btn-suffix') ? 'suffix': 'prefix'), (t.hasClass('btn-success') ? true: false));
};

var btn_delete_click = function(e){
      e.stopPropagation();
      var t = $(e.target), t = (t.prop("tagName") == 'I' ? t.parent(): t);
      t.parent('div.word-block').remove();
};

var get_val = function(i, e){
   return $(e).val();
};

var add_word = function(w){
   if(!_.contains($('.words input[type="text"]').map(get_val),w)){
      var c = $('#templater div.word-block').clone();
      c.find('input[type=text]').val(w);
      c.find('.btn-fix').click(btn_fix_click);
      c.find('.btn-delete').click(btn_delete_click);
      $('div.words').prepend(c);
   }
};

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
      console.log(iii);
      console.log(lll);
      return _.compact(_.map(s, function(ss){
         return (pp != ss ? pp + ss : null);
      }, this));
   }, this)));
   
   console.log(p,s, w, www);
};

$(function(){
   $('.btn-fix').click(btn_fix_click);
   $('.btn-delete').click(btn_delete_click);
   $('#bmix').click(word_mix);
   $('#form_add_word').submit(function(e){
      e.preventDefault();
      var input = $(e.target).find('input.search-query');
      add_word(input.val());
      input.val('');
   });
});

