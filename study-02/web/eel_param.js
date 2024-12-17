$(document).ready(function(){
  let polls_input=[];
  let polls_div=[];
  let polls_select=[];

  async function set_param(elm,name){
    if(arguments.length==1) name=elm.attr('name');  //override elm.name
    let type="text";
    try{
      type=elm.attr('type');
    }
    catch(e){
      eel.log("eel::set_param["+name+"]"+e);
    }
    let val=elm.attr('value');
    if(type.startsWith("te")) val=String(val);
    else val=Number(val);
    await eel.set_param(name,val);
  }
  async function set_param_tree(elm,name,key){
    let tree=await eel.get_param(name)();
    let val=elm.attr('value');
    eval("tree"+key+"="+"Number("+val+")");
    await eel.set_param(name,tree);
  }
  function cb_poll(){
    polls_input.forEach(async function(elm){
      let name=elm.attr('name');
      let val=await eel.get_param(name)();
//      eel.log("eel::param::poll "+name+"="+val+" focus="+elm.is(':focus'));
      if(val==null){
        return;
      }
      if(elm.attr('type')=='radio'){
        if(elm.val()==val) elm.prop('checked', true);
        else elm.prop('checked', false);
      }
      else if(!elm.is(':focus')){
        elm.val(val);
      }
    });
    polls_select.forEach(async function(elm){
      let name=elm.attr('name');
      let val=await eel.get_param(name)();
      if(val==null){
        return;
      }
      elm.val(val);
    });
    setTimeout(cb_poll,1000);
  };

 	$('input.rosparam').bind('change',function(e){//bind "change" callback to <input...
    let elm=$(e.target);
    set_param(elm);
  });

 	$('select.rosparam').bind('change',function(e){//bind "change" callback to <select...
    let elm=$(e.target);
    set_param(elm);
  });

  $('div.rosparam').each(function(index){//bind "change" callback to every child <input...
    let elm=$(this);
    let name=elm.attr('name');
    eel.log("div.rosparam"+","+name);
    elm.children('input').bind('change',async function(e){
      let elm=$(e.target);
      let name=elm.parent().attr('name');
      let key=elm.attr('key');
      if(key.indexOf('[')<0) set_param(elm,name+'/'+key);
      else set_param_tree(elm,name,key);
    });
  });

  $('input.rosparam').each(function(index){
    let elm=$(this);
    let type=elm.attr('type');
    let name=elm.attr('name');
    eel.log("eel::add to polls_input/"+name+","+type);
    polls_input.push(elm);   //ポーリングに登録

  });
  $('select.rosparam').each(function(index){
    let elm=$(this);
    let type=elm.attr('type');
    let name=elm.attr('name');
    polls_select.push(elm);   //ポーリングに登録
  });
  $('div.rosparam').each(function(index){
    let elm=$(this);
    let type=elm.attr('type');
    let name=elm.attr('name');
    polls_div.push(elm);   //ポーリングに登録
  });

  setTimeout(cb_poll,1000);
});
