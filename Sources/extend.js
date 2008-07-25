// 8< ---[Extend.js]---
// This module implements a complete OOP layer for JavaScript that makes it
// easy to develop highly structured JavaScript applications.
// 
// Classes are created using extend by giving a dictionary that contains the
// following keys:
// 
// - 'name', an optional name for this class
// - 'parent', with a reference to a parent class (created with Extend)
// - 'initialize', with a function to be used as a constructor
// - 'properties', with a dictionary of instance attributes
// - 'methods', with a dictionary of instance methods
// - 'shared', with a dictionary of class attributes
// - 'operations', with a dictionary of class operations
// 
// Extend 2.0 is a rewritten, simplified version of the Extend 1 library. It is
// not compatible with the previous versions, but the API will be stable from
// this release.
// 
// You can get more information at the Extend [project
// page](http://www.ivy.fr/js/extend).
function _meta_(v,m){var ms=v['__meta__']||{};for(var k in m){ms[k]=m[k]};v['__meta__']=ms;return v}
var Extend={}
var __this__=Extend
Extend._VERSION_='2.1.2';
Extend.Registry={}
Extend.Counters={'Instances':0}
Extend.PrintCallback=undefined
Extend.Class=	_meta_(function(declaration){
		// Classes are created using extend by giving a dictionary that contains the
		// following keys:
		// 
		// - 'name', an optional name for this class
		// - 'parent', with a reference to a parent class (created with Extend)
		// - 'initialize', with a function to be used as a constructor
		// - 'properties', with a dictionary of instance attributes
		// - 'methods', with a dictionary of instance methods
		// - 'shared', with a dictionary of class attributes
		// - 'operations', with a dictionary of class operations
		// 
		// Invoking the 'Class' function will return you a _Class Object_ that
		// implements the following API:
		// 
		// - 'isClass()' returns *true*( (because this is an object, not a class)
		// - 'getName()' returns the class name, as a string
		// - 'getParent()' returns a reference to the parent class
		// - 'getOperation(n)' returns the operation with the given name
		// - 'hasInstance(o)' tells if the given object is an instance of this class
		// - 'isSubclassOf(c)' tells if the given class is a subclass of this class
		// - 'listMethods()' returns a dictionary of *methods* available for this class
		// - 'listOperations()' returns a dictionary of *operations* (class methods)
		// - 'listShared()' returns a dictionary of *class attributes*
		// - 'listProperties()' returns a dictionary of *instance attributes*
		// - 'bindMethod(o,n)' binds the method with the given name to the given object
		// - 'proxyWithState(o)' returns a *proxy* that will use the given object as if
		// it was an instance of this class (useful for implementing 'super')
		// 
		// When you instanciate your class, objects will have the following methods
		// available:
		// 
		// - 'isClass()' returns *true*( (because this is an object, not a class)
		// - 'getClass()' returns the class of this instance
		// - 'getMethod(n)' returns the bound method which name is 'n'
		// - 'getCallback(n)' the equivalent of 'getMethod', but will give the 'this' as
		// additional last arguments (useful when you the invoker changes the 'this',
		// which happens in event handlers)
		// - 'isInstance(c)' tells if this object is an instance of the given class
		// 
		// Using the 'Class' function is very easy (in *Sugar*):
		// 
		// >   var MyClass = Extend Class {
		// >      name:"MyClass"
		// >      initialize:{
		// >         self message = "Hello, world !"
		// >      }
		// >      methods:{
		// >        helloWorld:{print (message)}
		// >      }
		// >   }
		// 
		// instanciating the class is very easy too
		// 
		// >   var my_instance = new MyClass()
		var __this__=Extend;
		var full_name=declaration.name;
		var class_object=_meta_(function(){
			if ( (! ((arguments.length == 1) && (arguments[0] == '__Extend_SubClass__'))) )
			{
				 var properties = class_object.listProperties()
				 for ( var prop in properties ) {
				   this[prop] = properties[prop];
				 }
				 this._callbacks  = {}
				
				if ( this.initialize )
				{
					return this.initialize.apply(this, arguments)
				}
			}
		},{arguments:[]});
		class_object.isClass = _meta_(function(){
			return true
		},{arguments:[]});
		class_object._parent = declaration.parent;
		class_object._name = declaration.name;
		class_object._properties = {'all':{}, 'inherited':{}, 'own':{}};
		class_object._shared = {'all':{}, 'inherited':{}, 'own':{}};
		class_object._operations = {'all':{}, 'inherited':{}, 'own':{}, 'fullname':{}};
		class_object._methods = {'all':{}, 'inherited':{}, 'own':{}, 'fullname':{}};
		class_object.getName = _meta_(function(){
			return class_object._name
		},{arguments:[]});
		class_object.getParent = _meta_(function(){
			return class_object._parent
		},{arguments:[]});
		class_object.isSubclassOf = _meta_(function(c){
			var parent=this;
			while (parent)
			{
				if ( (parent == c) )
				{
					return true
				}
				parent = parent.getParent();
			}
			return false
		},{arguments:[{'name': 'c'}]});
		class_object.hasInstance = _meta_(function(o){
			return o.getClass().isSubclassOf(class_object)
		},{arguments:[{'name': 'o'}]});
		class_object.bindMethod = _meta_(function(object, methodName){
			var this_method=object[methodName];
			return _meta_(function(){
				var a=arguments;
				if ( (a.length == 0) )
				{
					return this_method.call(object)
				}
				else if ( (a.length == 1) )
				{
					return this_method.call(object, a[0])
				}
				else if ( (a.length == 2) )
				{
					return this_method.call(object, a[0], a[1])
				}
				else if ( (a.length == 3) )
				{
					return this_method.call(object, a[0], a[1], a[2])
				}
				else if ( (a.length == 4) )
				{
					return this_method.call(object, a[0], a[1], a[2], a[3])
				}
				else if ( (a.length == 5) )
				{
					return this_method.call(object, a[0], a[1], a[2], a[3], a[4])
				}
				else if ( true )
				{
					var args=[];
					args.concat(arguments)
					return this_method.apply(object, args)
				}
			},{arguments:[]})
		},{arguments:[{'name': 'object'}, {'name': 'methodName'}]});
		class_object.bindCallback = _meta_(function(object, methodName){
			var this_method=object[methodName];
			return _meta_(function(){
				var a=arguments;
				if ( (a.length == 0) )
				{
					return this_method.call(object, this)
				}
				else if ( (a.length == 1) )
				{
					return this_method.call(object, a[0], this)
				}
				else if ( (a.length == 2) )
				{
					return this_method.call(object, a[0], a[1], this)
				}
				else if ( (a.length == 3) )
				{
					return this_method.call(object, a[0], a[1], a[2], this)
				}
				else if ( (a.length == 4) )
				{
					return this_method.call(object, a[0], a[1], a[2], a[3], this)
				}
				else if ( (a.length == 5) )
				{
					return this_method.call(object, a[0], a[1], a[2], a[3], a[4], this)
				}
				else if ( true )
				{
					var args=[];
					args.concat(arguments)
					args.push(this)
					return this_method.apply(object, args)
				}
			},{arguments:[]})
		},{arguments:[{'name': 'object'}, {'name': 'methodName'}]});
		class_object.getOperation = _meta_(function(name){
			var this_operation=class_object[name];
			return _meta_(function(){
				return this_operation.apply(class_object, arguments)
			},{arguments:[]})
		},{arguments:[{'name': 'name'}]});
		class_object.listMethods = _meta_(function(o, i){
			if ( (o === undefined) )
			{
				o = true;
			}
			if ( (i === undefined) )
			{
				i = true;
			}
			if ( (o && i) )
			{
				return class_object._methods.all
			}
			else if ( ((! o) && i) )
			{
				return class_object._methods.inherited
			}
			else if ( (o && (! i)) )
			{
				return class_object._methods.own
			}
			else if ( true )
			{
				return {}
			}
		},{arguments:[{'name': 'o'}, {'name': 'i'}]});
		class_object.listOperations = _meta_(function(o, i){
			if ( (o === undefined) )
			{
				o = true;
			}
			if ( (i === undefined) )
			{
				i = true;
			}
			if ( (o && i) )
			{
				return class_object._operations.all
			}
			else if ( ((! o) && i) )
			{
				return class_object._operations.inherited
			}
			else if ( (o && (! i)) )
			{
				return class_object._operations.own
			}
			else if ( true )
			{
				return {}
			}
		},{arguments:[{'name': 'o'}, {'name': 'i'}]});
		class_object.listShared = _meta_(function(o, i){
			if ( (o === undefined) )
			{
				o = true;
			}
			if ( (i === undefined) )
			{
				i = true;
			}
			if ( (o && i) )
			{
				return class_object._shared.all
			}
			else if ( ((! o) && i) )
			{
				return class_object._shared.inherited
			}
			else if ( (o && (! i)) )
			{
				return class_object._shared.own
			}
			else if ( true )
			{
				return {}
			}
		},{arguments:[{'name': 'o'}, {'name': 'i'}]});
		class_object.listProperties = _meta_(function(o, i){
			if ( (o === undefined) )
			{
				o = true;
			}
			if ( (i === undefined) )
			{
				i = true;
			}
			if ( (o && i) )
			{
				return class_object._properties.all
			}
			else if ( ((! o) && i) )
			{
				return class_object._properties.inherited
			}
			else if ( (o && (! i)) )
			{
				return class_object._properties.own
			}
			else if ( true )
			{
				return {}
			}
		},{arguments:[{'name': 'o'}, {'name': 'i'}]});
		class_object.proxyWithState = _meta_(function(o){
			var proxy={};
			var constr=undefined;
			var wrapper=_meta_(function(f){
				return _meta_(function(){
					return f.apply(o, arguments)
				},{arguments:[]})
			},{arguments:[{'name': 'f'}]});
			var proxy_object=_meta_(function(){
				return class_object.prototype.initialize.apply(o, arguments)
			},{arguments:[]});
			proxy_object.prototype = proxy;
			 for (var key in class_object.prototype) {
			  var w = wrapper(class_object.prototype[key])
			  if (key == "initialize") { constr=w }
			  proxy[key] = w
			  // This should not be necessary
			  proxy_object[key] = w
			 }
			
			proxy_object.getSuper = _meta_(function(){
				return class_object.getParent().proxyWithState(o)
			},{arguments:[]});
			return proxy_object
		},{arguments:[{'name': 'o'}]});
		if ( declaration.parent != undefined ) {
			// We proxy parent operations
			for ( var name in declaration.parent._operations.fullname ) {
				var operation = declaration.parent._operations.fullname[name]
				class_object._operations.fullname[name] = operation
				class_object[name] = operation
			}
			for ( var name in declaration.parent._operations.all ) {
				var operation = declaration.parent[name]
				class_object[name] = operation
				class_object._operations.all[name] = operation
				class_object._operations.inherited[name] = operation
			}
			for ( var name in declaration.parent._methods.all ) {
				var method = declaration.parent._methods.all[name]
				class_object._methods.all[name] = method
				class_object._methods.inherited[name] = method
			}
			// We copy parent class attributes default values
			for ( var name in declaration.parent._shared.all ) {
				var attribute = declaration.parent._shared.all[name]
				class_object[name] = attribute
				class_object._shared.all[name] = attribute
				class_object._shared.inherited[name] = attribute
			}
			// We copy parent instance attributes default values
			for ( var name in declaration.parent._properties.all ) {
				var prop = declaration.parent._properties.all[name]
				class_object._properties.all[name] = prop
				class_object._properties.inherited[name] = prop
			}
		}
		if ( declaration.operations != undefined ) {
			for ( var name in declaration.operations ) {
				var operation = declaration.operations[name]
				class_object[name] = operation
				class_object[full_name + "_" + name] = operation
				class_object._operations.all[name] = operation
				class_object._operations.all[name] = operation
				class_object._operations.own[name] = operation
				class_object._operations.fullname[full_name + "_" + name] = operation
			}
		}
		if ( declaration.methods != undefined ) {
			for ( var name in declaration.methods ) {
				var method = declaration.methods[name]
				class_object._methods.all[name] = method
				class_object._methods.own[name] = method
			}
		}
		if ( declaration.shared != undefined ) {
			for ( var name in declaration.shared ) {
				var attribute = declaration.shared[name]
				class_object[name] = attribute
				class_object._shared.all[name] = attribute
				class_object._shared.own[name] = attribute
			}
		}
		if ( declaration.properties != undefined ) {
			for ( var name in declaration.properties ) {
				var attribute = declaration.properties[name]
				class_object._properties.all[name] = attribute
				class_object._properties.own[name] = attribute
			}
		}
		
		var instance_proto={};
		if ( declaration.parent )
		{
			instance_proto = new declaration.parent('__Extend_SubClass__');
			instance_proto.constructor = class_object;
		}
		instance_proto.isInstance = undefined;
		instance_proto.getClass = _meta_(function(){
			return class_object
		},{arguments:[]});
		instance_proto.isClass = _meta_(function(){
			return false
		},{arguments:[]});
		instance_proto.getMethod = _meta_(function(methodName){
			var this_object=this;
			var callback=this._callbacks[('M:' + methodName)];
			if ( (callback === undefined) )
			{
				callback = class_object.bindCallback(this_object, methodName);
				this._callbacks[('M:' + methodName)] = callback;
			}
			return callback
		},{arguments:[{'name': 'methodName'}]});
		instance_proto.getCallback = _meta_(function(methodName){
			var this_object=this;
			var callback=this._callbacks[('C:' + methodName)];
			if ( (callback === undefined) )
			{
				callback = class_object.bindCallback(this_object, methodName);
				this._callbacks[('C:' + methodName)] = callback;
			}
			return callback
		},{arguments:[{'name': 'methodName'}]});
		instance_proto.isInstance = _meta_(function(c){
			return c.hasInstance(this)
		},{arguments:[{'name': 'c'}]});
		if ( declaration.initialize )
		{
			instance_proto.initialize = declaration.initialize;
		}
		else if ( true )
		{
			instance_proto.instance_proto = {};
		}
		instance_proto.getSuper = _meta_(function(c){
			return c.proxyWithState(this)
		},{arguments:[{'name': 'c'}]});
		if ( declaration.operations != undefined ) {
			for ( var name in declaration.operations ) {
				instance_proto[name] = instance_proto[full_name + "_" + name] = class_object.getOperation(name)
		}}
		if ( declaration.methods != undefined ) {
			for ( var name in declaration.methods ) {
				instance_proto[name] = instance_proto[full_name + "_" + name] = declaration.methods[name]
		}}
		if ( declaration.initialize != undefined ) {
			instance_proto.initialize = instance_proto[full_name + "_initialize"] = declaration.initialize
		}
		
		class_object.prototype = instance_proto;
		if ( declaration.name )
		{
			Extend.Registry[declaration.name] = class_object;
		}
		return class_object
	},{arguments:[{'name': 'declaration'}]})
Extend.Protocol=	_meta_(function(pdata){
		var __this__=Extend;
	},{arguments:[{'name': 'pdata'}]})
Extend.Singleton=	_meta_(function(sdata){
		var __this__=Extend;
	},{arguments:[{'name': 'sdata'}]})
Extend.getClass=	_meta_(function(name){
		var __this__=Extend;
		return Extend.Registry[name]
	},{arguments:[{'name': 'name'}]})
Extend.getClasses=	_meta_(function(){
		var __this__=Extend;
		return Extend.Registry
	},{arguments:[]})
Extend.invoke=	_meta_(function(t, f, args, extra){
		// The 'invoke' method allows advanced invocation (supporting by name, as list
		// and as map invocation schemes) provided the given function 'f' has proper
		// '__meta__' annotation.
		// 
		// These annotations are expected to be like:
		// 
		// >    f __meta__ = {
		// >        arity:2
		// >        arguments:{
		// >           b:2,
		// >           "*":[1]
		// >           "**":{c:3,d:4}
		// >        }
		// >    }
		// 
		var __this__=Extend;
		var meta=f['__meta__'];
		var actual_args=[];
		Extend.iterate(extra['*'], _meta_(function(v){
			args.push(v)
		},{arguments:[{'name': 'v'}]}), __this__)
		Extend.iterate(extra['**'], _meta_(function(v, k){
			extra[k] = v;
		},{arguments:[{'name': 'v'}, {'name': 'k'}]}), __this__)
		Extend.iterate(args, _meta_(function(v){
			actual_args.push(args)
		},{arguments:[{'name': 'v'}]}), __this__)
		var start=args.length;
		while ((start < meta.arity))
		{
			var arg=meta.arguments[start];
			actual_args.push(extra[arg.name])
			start = (start + 1);
		}
		return f.apply(t, actual_args)
	},{arguments:[{'name': 't'}, {'name': 'f'}, {'name': 'args'}, {'name': 'extra'}]})
Extend.getChildrenOf=	_meta_(function(aClass){
		var __this__=Extend;
		var res={};
		var values = Extend.getClasses()
		for ( key in values ) {
			if ( values[key] != aClass && values[key].isSubclassOf(aClass) )
			{ res[key] = values[key] }
		}
		
		return res
	},{arguments:[{'name': 'aClass'}]})
Extend.init=	_meta_(function(){
		var __this__=Extend;
	},{arguments:[]})
Extend.init()
