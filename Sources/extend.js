// This module implements a complete OOP layer for JavaScript that makes it
// easy to develop highly structured JavaScript applications.
// 
// Classes are created using extend by giving a dictionary that contains the
// following keys:
// 
// - 'name', an optional name for this class
// - 'parent', with a reference to a parent class (created with Extend)
// - 'init', with a function to be used as a init
// - 'methods', with a dictionary of instance methods
// - 'attributes', with a dictionary of class attributes
// - 'operations', with a dictionary of class operations
// 
// Extend 2.0 is a rewritten, simplified version of the Extend 1 library. It is
// not compatible with the previous versions, but the API will be stable from
// this release.
// 
// You can get more information at the Extend [project
// page](http://www.ivy.fr/js/extend).
var Extend={}
Extend.Class=	function(declaration){
		// Classes are created using extend by giving a dictionary that contains the
		// following keys:
		// 
		// - 'name', an optional name for this class
		// - 'parent', with a reference to a parent class (created with Extend)
		// - 'init', with a function to be used as a init
		// - 'methods', with a dictionary of instance methods
		// - 'attributes', with a dictionary of class attributes
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
		// - 'listAttributes()' returns a dictionary of *class attributes*
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
		// - 'isInstance(c)' tells if this object is an instance of the given class
		// 
		// Using the 'Class' function is very easy (in *Sugar*):
		// 
		// >   var MyClass = Extend Class {
		// >      name:"MyClass"
		// >      init:{
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
		var class_object=function(){
			if ( (! ((arguments.length == 1) && (arguments[0] == "__Extend_SubClass__"))) )
			{
				if ( this.init )
				{
					return this.init.apply(this, arguments)
				}
			}
		};
		class_object.isClass = function(){
			return true
		};
		class_object._parent = declaration.parent;
		class_object._name = declaration.name;
		class_object._attributes = {"all":{}, "inherited":{}, "own":{}};
		class_object._operations = {"all":{}, "inherited":{}, "own":{}, "fullname":{}};
		class_object._methods = {"all":{}, "inherited":{}, "own":{}, "fullname":{}};
		class_object.getName = function(){
			return class_object._name
		};
		class_object.getParent = function(){
			return class_object._parent
		};
		class_object.isSubclassOf = function(c){
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
		};
		class_object.hasInstance = function(o){
			return o.getClass().isSubclassOf(class_object)
		};
		class_object.bindMethod = function(object, methodName){
			var this_method=object[methodName];
			return function(){
				return this_method.apply(object, arguments)
			}
		};
		class_object.getOperation = function(name){
			var this_operation=object[name];
			return function(){
				return this_operation.apply(class_object, arguments)
			}
		};
		class_object.listMethods = function(o, i){
			if ( (o == undefined) )
			{
				o = true;
			}
			if ( (i == undefined) )
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
		};
		class_object.listOperations = function(o, i){
			if ( (o == undefined) )
			{
				o = true;
			}
			if ( (i == undefined) )
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
		};
		class_object.listAttributes = function(o, i){
			if ( (o == undefined) )
			{
				o = true;
			}
			if ( (i == undefined) )
			{
				i = true;
			}
			if ( (o && i) )
			{
				return class_object._attributes.all
			}
			else if ( ((! o) && i) )
			{
				return class_object._attributes.inherited
			}
			else if ( (o && (! i)) )
			{
				return class_object._attributes.own
			}
			else if ( true )
			{
				return {}
			}
		};
		class_object.proxyWithState = function(o){
			var proxy={};
			var constr=undefined;
			var wrapper=function(f){
				return function(){
					return f.apply(o, arguments)
				}
			};
			var proxy_object=function(){
				return constr.apply(undefined, arguments)
			};
			proxy_object.prototype = proxy;
			 for (var key in class_object.prototype) {
			  var w = wrapper(class_object.prototype[key])
			  if (key == "init") { constr=w }
			  proxy[key] = w
			  // This should not be necessary
			  proxy_object[key] = w
			 }
			
			proxy_object.getSuper = function(){
				return class_object.getParent().proxyWithState(o)
			};
			return proxy_object
		};
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
			for ( var name in declaration.parent._attributes.all ) {
				var attribute = declaration.parent._attributes.all[name]
				class_object[name] = attribute
				class_object._attributes.all[name] = attribute
				class_object._attributes.inherited[name] = attribute
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
		if ( declaration.attributes != undefined ) {
			for ( var name in declaration.attributes ) {
				var attribute = declaration.attributes[name]
				class_object[name] = attribute
				class_object._attributes.all[name] = attribute
				class_object._attributes.own[name] = attribute
			}
		}
		
		var instance_proto={};
		if ( declaration.parent )
		{
			instance_proto = new declaration.parent("__Extend_SubClass__");
			instance_proto.constructor = class_object;
		}
		instance_proto.isInstance = undefined;
		instance_proto.getClass = function(){
			return class_object
		};
		instance_proto.isClass = function(){
			return false
		};
		instance_proto.getMethod = function(methodName){
			var this_object=this;
			return class_object.bindMethod(this_object, methodName)
		};
		instance_proto.isInstance = function(c){
			return c.hasInstance(this)
		};
		if ( declaration.init )
		{instance_proto.init = declaration.init;}
		instance_proto.getSuper = function(c){
			return c.proxyWithState(this)
		};
		if ( declaration.methods != undefined ) {
			for ( var name in declaration.methods ) {
				instance_proto[name] = instance_proto[full_name + "_" + name] = declaration.methods[name]
		}}
		if ( declaration.init != undefined ) {
			instance_proto.init = instance_proto[full_name + "_init"] = declaration.init
		}
		
		class_object.prototype = instance_proto;
		return class_object
	}
Extend.Protocol=	function(pdata){
		var __this__=Extend;
	}
Extend.Singleton=	function(sdata){
		var __this__=Extend;
	}
Extend.init=	function(){
		var __this__=Extend;
	}
Extend.init()
