// 8< ---[extend.js]---

var extend=extend||{}
var __this__=extend
extend.car=	function(list){
		var __this__=extend;
	}
extend.cdr=	function(list){
		var __this__=extend;
	}
extend.cons=	function(list){
		var __this__=extend;
	}
extend.map=	function(callback, iterable){
		var __this__=extend;
	}
extend.filter=	function(callback, iterable){
		var __this__=extend;
	}
extend.reduce=	function(callback, iterable){
		var __this__=extend;
	}
extend.init=	function(){
		var __this__=extend;
	}
extend.init()
// 8< ---[_RW_extend46python.js]---

var _RW_extend46python=_RW_extend46python||{}
var __this__=_RW_extend46python
_RW_extend46python.len=	function(value){
		var __this__=_RW_extend46python;
		if ( isList(value) )
		{
			return value.length
		}
		else if ( isObject(value) )
		{
			if ( value.length )
			{
				return value.length
			}
			else if ( value.__len__ )
			{
				return value.__len__()
			}
		}
		else if ( true )
		{
			return null
		}
	}
_RW_extend46python.map=	function(callback, iterable){
		var __this__=_RW_extend46python;
	}
_RW_extend46python.filter=	function(callback, iterable){
		var __this__=_RW_extend46python;
	}
_RW_extend46python.reduce=	function(callback, iterable){
		var __this__=_RW_extend46python;
	}
_RW_extend46python.init=	function(){
		var __this__=_RW_extend46python;
		String.prototype.__len__ = function(){
			return this.length
		};
		Array.prototype.extend = function(){
		};
		Array.prototype.append = function(){
		};
		Array.prototype.insert = function(){
		};
		Array.prototype.slice = function(){
		};
		Array.prototype.__iter__ = function(){
			return this.length
		};
		Array.prototype.__len__ = function(){
			return this.length
		};
		Object.prototype.keys = function(){
		};
		Object.prototype.items = function(){
		};
		Object.prototype.values = function(){
		};
		Object.prototype.hasKey = function(key){
		};
		Object.prototype.get = function(key){
		};
		Object.prototype.set = function(key, value){
		};
		Object.prototype.setDefault = function(key, value){
		};
		Object.prototype.__iter__ = function(){
		};
		Object.prototype.__len__ = function(){
		};
	}
_RW_extend46python.init()
