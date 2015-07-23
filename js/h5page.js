/**
 * Created by Administrator on 2015/7/21.
 */
(function(win){
  var common={
    extend: function (defaultobj,mobj) {
      if(typeof mobj!='object'){
        return mobj;
      }
      for(key in defaultobj){
        if(mobj.hasOwnProperty(key)){
          defaultobj[key]=typeof mobj[key]=='object'?arguments.callee(defaultobj[key],mobj[key]):mobj[key];
        }
      }
    },
    getStyle: function (obj,attr) {
      if(obj.currentStyle){
        return obj.currentStyle[attr];
      }else{
        return getComputedStyle(obj,false)[attr];
      }
    }
  }
  var h5pagePri=function(opt){
    var defaultSetting={
      curIndex:0,
      speed:200,
      hasbar:false,
      moveComplete:function(ev){
        //ev.curindex  ev.preindex
        console.log(JSON.stringify(ev));
      },
      moving:function(ev){
        console.log(JSON.stringify(ev));
        //ev.percent ev.curindex ev.movetoindex
      }
    }
    common.extend(defaultSetting,opt);
    this.setting=defaultSetting;
    this.pageCon=document.querySelector('.content');
    this.pages=document.querySelectorAll('.h5page');
    this.footer=document.querySelector('.h5footer');
    this.header=document.querySelector('.h5header');
    this.client={
      w:document.documentElement.clientWidth,
      h:document.documentElement.clientHeight
    }
    this.pageNum=this.pages.length;
    this.init();
  }
  h5pagePri.prototype={
    init:function(){
      var _this=this;
      this.contentWH();
      if(this.setting.hasbar){
        this.initBar();
      }
      this.bindEvent();
    },
    contentWH: function () {
      var con=document.querySelector('.content-container');
      var conHeight=this.client.h-parseFloat(common.getStyle(this.footer,'height'))-parseFloat(common.getStyle(this.header,'height'))+'px';
      con.style.height=conHeight;
      this.pageCon.style.width=this.pages.length*this.client.w+'px';
      //con.style.transition='all '+this.setting.speed+'ms';
      for(var key=0;key<this.pages.length;key++){
        this.pages[key].style.width=this.client.w+'px';
        this.pages[key].style.height=conHeight;
      }
    },
    initBar: function () {
      this.barCon=document.createElement('p');
      this.barCon.className="h5page-bar-container";
      var barItem=[];
      for(var i=0;i<this.pageNum;i++){
        if(i==this.setting.curIndex){
          barItem.push('<span class="active"></span>');
        }else{
          barItem.push('<span></span>');
        }
      }
      this.barCon.innerHTML=barItem.join('');
      document.body.appendChild(this.barCon);
    },
    barSetActive:function(){
      var childs=this.barCon.children;
      for(var i=0;i<childs.length;i++){
        childs[i].className='';
        childs[i].style.opacity=1;
        if(i==this.setting.curIndex){
          childs[i].className="active";
        }
      }
    },
    barChanging: function (percent,cur,moveto) {
      percent=Math.abs(percent);
      if(!(cur==0&&moveto<0||cur==this.pageNum&&moveto>this.pageNum)){
        this.barCon.children[cur].style.opacity=1-percent;
        this.barCon.children[moveto].style.opacity=percent;
      }
    },
    bindEvent: function () {
      var startX,startY,startTemp=false,_this=this;
      for(var i=0;i<this.pages.length;i++){
        this.pages[i].addEventListener('touchstart',touchStart,false);
        this.pages[i].addEventListener('touchmove',touchMove,false);
        this.pages[i].addEventListener('touchend',touchEnd,false);
      }
      this.pageCon.addEventListener('touchstart',touchStart,false);
      this.pageCon.addEventListener('touchmove',touchMove,false);
      this.pageCon.addEventListener('touchend',touchEnd,false);
      function touchStart(ev){
        ev.stopPropagation();
        ev=ev.changedTouches?ev.changedTouches[0]:ev;
        startX=ev.clientX;
        startY=ev.clientY;
        startTemp=true;
      }
      function touchMove(eve){
        eve.stopPropagation();
        ev=eve.changedTouches?eve.changedTouches[0]:eve;
        //if(Math.abs(ev.clientY-startY)>=20)startTemp=false;
        if(startTemp){
          var cha=ev.clientX-startX;
          if(Math.abs(cha)>=30){
          //console.log(_this.header.innerHTML=cha);
            eve.preventDefault();//阻止浏览器的左右滑动退出该页面
            var curindex=_this.setting.curIndex;
            _this.moveTo(_this.pageCon,true,cha-(curindex*_this.client.w));
            _this.barChanging(cha/_this.client.w,curindex,cha>0?curindex-1:curindex+1);
            _this.setting.moving({percent:cha/_this.client.w,curindex:curindex,movetoindex:cha>0?curindex-1:curindex+1});
          }
        }
      }
      function touchEnd(ev){
        ev.stopPropagation();
        ev=ev.changedTouches?ev.changedTouches[0]:ev;
        if(startTemp){
          var curindex=_this.setting.curIndex;
          startTemp=false;
          if(Math.abs(ev.clientX-startX)>=100){
            if((ev.clientX-startX)>=100){
              _this.moveToIndex(curindex==0?curindex:--_this.setting.curIndex,true);
            }else{
              _this.moveToIndex(curindex==_this.pageNum-1?curindex:++_this.setting.curIndex,true);
            }
          }else{
            _this.moveToIndex(curindex,true);
          }
          _this.setting.moveComplete({curindex:_this.setting.curIndex,preindex:curindex});
          if(_this.setting.hasbar){
            _this.barSetActive();
          }
        }
      }
    },
    moveTo: function (obj, isx, value, transition) {
      obj.style.transition=transition?'all '+transition+'ms':'';
      obj.style.webkitTransition=transition?'all '+transition+'ms':'';
      obj.style.mozTransition=transition?'all '+transition+'ms':'';
      obj.style.transform=(isx?"translateX":'translateY')+'('+value+'px)';
      obj.style.webkitTransform=(isx?"translateX":'translateY')+'('+value+'px)';
      obj.style.mozTransform=(isx?"translateX":'translateY')+'('+value+'px)';
    },
    moveToIndex: function (index,animate) {
      this.setting.curIndex=index;
      this.moveTo(this.pageCon,true,-(index*this.client.w),animate?this.setting.speed:'');
    }
  }
  var hp='';
  win['h5page']= function (opt) {
    return hp = new h5pagePri(opt);
  }
  var fnarr=['moveToIndex'];
  for(var i=0;i<fnarr.length;i++){
    -function(i){
      win['h5page'][fnarr[i]]= function () {
        hp[fnarr[i]].apply(hp,[].slice.call(arguments,0));
      }
    }(i)
  }
})(window)