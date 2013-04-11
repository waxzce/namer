var btn_fix_click = function(e){
      e.stopPropagation();
      var t = $(e.target), t = (t.prop("tagName") == 'I' ? t.parent(): t);
      t.toggleClass('btn-success').toggleClass('btn-danger');
      t.siblings('input[type=text]').data((t.hasClass('btn-suffix') ? 'suffix': 'prefix'), (t.hasClass('btn-success') ? true: false));
};

$(function(){
   $('.btn-fix, .btn-fix i').click(btn_fix_click);
})