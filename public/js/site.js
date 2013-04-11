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

var add_word = function(w){
   if(!_.contains($('.words input[type="text"]').map(function(i,e){return $(e).val();}),w)){
      var c = $('#templater div.word-block').clone();
      c.find('input[type=text]').val(w);
      c.find('.btn-fix').click(btn_fix_click);
      c.find('.btn-delete').click(btn_delete_click);
      $('div.words').prepend(c);
   }
}

$(function(){
   $('.btn-fix').click(btn_fix_click);
   $('.btn-delete').click(btn_delete_click);
   $('#form_add_word').submit(function(e){
      e.preventDefault();
      var input = $(e.target).find('input.search-query');
      add_word(input.val());
      input.val('');
   });
});

