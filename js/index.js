/**
 * Created by Administrator on 2015/7/23.
 */
(function(){
  var barcon=document.getElementById("btnContainer"),
  btnActive=document.getElementById('btnActive'),
  barChilds=barcon.children,
  removeClass=false,//滑动过程中 首次清除所有active class，不重复清除
  btnsLeft=[],//保存各个btn的left、top值
  btnsDistance= 0,//按钮之间left的差值
  speed=300,
  curIndex=0;
  function getLT(obj){
    var lt={
      left:obj.offsetLeft,
      top:obj.offsetTop
    }
    if(obj.offsetParent){
      var relt=getLT(obj.offsetParent)
      lt.left+=relt.left;
      lt.top+=relt.top;
    }
    return lt;
  }
  window['h5page']({speed:speed,curIndex:curIndex,hasbar:true,moving: function (ev) {
    if(!removeClass){
      removeClass=true;
      btnActive.style.display='block';
      for(var i=0;i<barChilds.length;i++){
        barChilds[i].className='';
      }
    }
    h5page.moveTo(btnActive,true,-btnsDistance*ev.percent);
  },moveComplete:function(ev){
    h5page.moveTo(btnActive,true,btnsDistance*(ev.curindex-ev.preindex),speed);
    setTimeout(function () {
      for(var i=0;i<barChilds.length;i++){
        if(i==ev.curindex){
          barChilds[i].className='active';
          removeClass=false;
          break;
        }
      }
      btnActive.style.display='none';
      btnActive.style.left=btnsLeft[ev.curindex].left+'px';//重新赋值btnActive的left值
      h5page.moveTo(btnActive,true,0);//位移归0
      curIndex=ev.curindex;//将当前active index赋值给curIndex
    },speed);
  }});
  for(var i=0;i<barChilds.length;i++){
    btnsLeft.push(getLT(barChilds[i]));
    (function(i){
      barChilds[i].addEventListener('touchend', function () {
        if(this.className=='active'){return false;}
        for(var j=0;j<barChilds.length;j++){
            barChilds[j].className='';
        }
        btnActive.style.display='block';
        h5page.moveTo(btnActive,true,(i-curIndex)*btnsDistance,speed);
        window['h5page'].moveToIndex(i,curIndex,true);//i是点击的btn  curIndex是上次active btn的index
      })
    })(i)
  }
  //
  btnsDistance=btnsLeft[1].left-btnsLeft[0].left;
  btnActive.style.left=btnsLeft[curIndex].left+'px';
})()