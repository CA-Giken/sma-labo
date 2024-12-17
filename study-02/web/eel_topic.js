$(document).ready(function(){
  $('.publish').click(function(e){
    let elm=$(e.target);
    let name=elm.attr('name');
    let val=elm.attr('value');
    let pu=elm.attr('popup');
    eel.log("publisher:"+name);
  });

  $('img.subscribe').each(function(index){
    let elm=$(this);
    let name=elm.attr('name');
    eel.log("eel::Image subscriber:"+name);
    //コールバックに登録
  });
});
