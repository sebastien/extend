function _meta_(v,m){var ms=v['__meta__']||{};for(var k in m){ms[k]=m[k]};v['__meta__']=ms;return v}
var oop={}
var __this__=oop
oop.A=Extend.Class({
	name:'oop.A', parent:undefined,
	methods:{
		foo:_meta_(function(){
			var __this__=this
			return __this__.bar()
		},{arguments:[]}),
		bar:_meta_(function(){
			var __this__=this
			return 'A.bar()'
		},{arguments:[]})
	}
})
oop.B=Extend.Class({
	name:'oop.B', parent:oop.A,
	methods:{
		superFoo:_meta_(function(){
			var __this__=this
			__this__.getSuper(oop.B.getParent()).foo()
		},{arguments:[]}),
		foo:_meta_(function(){
			var __this__=this
			return ('B:' + __this__.bar())
		},{arguments:[]}),
		bar:_meta_(function(){
			var __this__=this
			return 'B.bar()'
		},{arguments:[]})
	}
})
oop.init=	_meta_(function(){
		var __this__=oop;
		a = oop.A();
		b = oop.B();
		Extend.print('A->', a.foo())
		Extend.print('B->', b.foo())
		Extend.print('C->', b.superFoo())
	},{arguments:[]})
oop.init()
