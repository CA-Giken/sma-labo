$(document).ready(function(){
  let scan_inputs=[];
  let scan_divs=[];
  let scan_selects=[];

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

  $('.publish').click(function(e){
    let elm=$(e.target);
    let name=elm.attr('name');
    let val=elm.attr('value');
    let pu=elm.attr('popup');
    eel.log("publisher:"+name);
  });

  $('.subscribe').each(function(index){
    let elm=$(this);
    let name=elm.attr('name');
    eel.log("subscriber:"+name);
    //コールバックに登録
  });

  $('input.rosparam').each(function(index){
    let elm=$(this);
    let type=elm.attr('type');
    let name=elm.attr('name');
    eel.log("eel-ros::add to scan_inputs/"+name+","+type);
    scan_inputs.push(elm);   //ポーリングに登録

  });
  $('select.rosparam').each(function(index){
    let elm=$(this);
    let type=elm.attr('type');
    let name=elm.attr('name');
    scan_selects.push(elm);   //ポーリングに登録
  });
  $('div.rosparam').each(function(index){
    let elm=$(this);
    let type=elm.attr('type');
    let name=elm.attr('name');
    scan_divs.push(elm);   //ポーリングに登録
  });

  function cb_poll(){
    scan_inputs.forEach(async function(elm){
      let name=elm.attr('name');
      let val=await eel.get_param(name)();
      eel.log("scan "+name+"="+val+" focus="+elm.is(':focus'));
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
    scan_selects.forEach(async function(elm){
      let name=elm.attr('name');
      let val=await eel.get_param(name)();
      if(val==null){
        return;
      }
      elm.val(val);
    });
    setTimeout(cb_poll,1000);
  };
  setTimeout(cb_poll,1000);
});
