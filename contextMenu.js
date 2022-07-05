/**
 * 右键菜单控件
 * @version: 1.0.0
 * @author: charles_li@msn.com
 * @copyright:2020 tynt.cn
 * @license: MIT
 * @link https://www.tynt.cn
 */
(function($) {
	var menu;
	var menucss = {};
	var options = {};
	var _defaultOptions = {
		width:110,	//菜单宽度
		height:26,	//菜单项高度
		color:'#000000',	//默认字体颜色
		arrowcolor:'#888888',	//下级菜单箭头颜色
		fontsize:14,	//字体大小，单位像素
		menuColor:'#ffffff', //菜单背景色
		boardColor:'#aaaaaa', //菜单边框颜色
		itemColor:'#eeeeee',	//菜单选中项背景色
		fontColor:'#000000',	//菜单选中项字体颜色
		lineColor:'#dddddd',	//分隔线颜色，分隔线颜色和背景色相同则看不出分割线
		isRadius:false,		//是否圆角
		isShadow:true,	//是否显示菜单阴影
		isIcon:false,			//显示图标，该项为false则配置icon也不显示
		onInit:null,	//前置过滤函数,参数e为右键target对象，返回布尔值，用于右键点击某个target是否显示，eg: onInit:function(e) { ... return true}
		setMenu:null,		//通过该函数可根据target的动态菜单，参数e为右键target对象，返回菜单对象，菜单对象同item，eg: setMenu:function(e) {... return menu}
		item:[],				//静态菜单项eg:item[{text:关闭,icon:"/images/color.png",disable:true,click:function(target){}}]，文字，图标，是否禁用默认false，点击后的效果其中target为目标对象
	}		
	var _path = (function( script, i ){
	  var l = script.length, path;
		for( ; i < l; i++ )
		{
			path = !!document.querySelector ?
			    script[i].src : script[i].getAttribute('src',4);
			if( path.substr(path.lastIndexOf('/')).indexOf('contextMenu') !== -1 )
			    break;
		}
		return path.substr( 0, path.lastIndexOf('/') + 1 );
	})(document.getElementsByTagName('script'),0);
	(function(head){
	    var link = document.createElement('link');
			link.href =  _path + 'contextMenu.css';
	    link.rel = 'stylesheet';
			head.appendChild( link );
	})(document.getElementsByTagName('head')[0]);
	$.fn.contextMenu = function(options) {
		if(!menu) {
			options = Object.assign(_defaultOptions,options);
			menu = init(options);
			$(document).bind("click",function(){
				menu.hide();
			});
		}
		$(this).bind("contextmenu",function(e) {
			var _hasMenu = (!!options.onInit) ? options.onInit(e.target) : true;
			if(_hasMenu) show(e,options);
			return false;
		});
		return this;
	}
	init=function(options) {
		menucss = {width:options.width,backgroundColor:options.menuColor,borderColor:options.boardColor}
		var _menustr = '<div id="TYF_contextmenu"><ul class="cm_default';
		if(options.isRadius) _menustr += ' cm_radius';
		if(options.isShadow) _menustr += ' cm_shadow';
		_menustr += '">';
		_menustr += '</ul></div>';
		var _menuObj = $(_menustr).hide().appendTo('body').bind('click',function(e){
			e.stopPropagation();
		});
		_menuObj.children('ul').css(menucss);
		return _menuObj;
	}
	setItem = function(item,target,options) {
		var _menustr = '<li>';
		_menustr += '<a href="javascript:void(0);"';
		if(_disable) _menustr += ' class="disabled"';
		_menustr += '>';
		var _disable = !!item.disable ? item.disable : false;
		if(options.isIcon) {
			_menustr += !!item.icon ? '<img src="'+item.icon+'" />' : '<span class="cm_icon"></span>';
		}

		_menustr += item.text + '</a>';
		if(!!item.sub) {
			_menustr += '<s';
			_menustr += ' style="border-color:'+options.arrowcolor+';top:'+(options.height/2-4.2)+'px"';
			_menustr += '></s><ul class="cm_default cm_sub';
			if(options.isRadius) _menustr += ' cm_radius';
			if(options.isShadow) _menustr += ' cm_shadow';
			_menustr += '"></ul>';
		}
		_menustr += '</li>';
		var _menuItemObj = $(_menustr).css({borderColor:options.lineColor,height:options.height,lineHeight:options.height+'px'});
		_menuItemObj.children('a').css({color:options.color}).bind('click',function(){
			item.click(target);
		});
		menucss.left = options.width-10;
		_menuItemObj.children("ul").css(menucss);
		if(!_disable) {
			_menuItemObj.hover(
				function() {
					$(this).css({backgroundColor:options.itemColor,color:options.fontColor});
					$(this).children('ul').show();
				},
				function() {
					$(this).css({backgroundColor:options.menuColor,color:options.color});
					$(this).children('ul').hide();
				}
			);
		}
		if(!!item.sub) {
			var _subItme = null;
			$.each(item.sub,function(k,v){
				_subItme = setItem(v,target,options);
				_menuItemObj.children('ul').append(_subItme);
			});
		}
		_menuItemObj.bind('click',function(){
			menu.hide();
		});
		return _menuItemObj;
	}
	show = function(obj,options) {
		if(!!options.setMenu) options.item = options.setMenu(obj.target);
		menu.css({'left':obj.pageX,'top':obj.pageY}).show();
		var _menustr,_menuObj;
		menu.children("ul").empty();
		if(!!options.item) {
			$.each(options.item,function(k,v){
				var _menuItem = setItem(v,obj.target,options);
				menu.children('ul').append(_menuItem);
			});
		}
	}
})(jQuery);