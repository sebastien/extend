@module Extend
@version 2.1.0c (31-Jan-2007)

@target JavaScript
| This module implements a complete OOP layer for JavaScript that makes it
| easy to develop highly structured JavaScript applications.
|
| Classes are created using extend by giving a dictionary that contains the
| following keys:
|
| - 'name', an optional name for this class
| - 'parent', with a reference to a parent class (created with Extend)
| - 'initialize', with a function to be used as a constructor
| - 'properties', with a dictionary of instance attributes
| - 'methods', with a dictionary of instance methods
| - 'shared', with a dictionary of class attributes
| - 'operations', with a dictionary of class operations
|
| Extend 2.0 is a rewritten, simplified version of the Extend 1 library. It is
| not compatible with the previous versions, but the API will be stable from
| this release.
|
| You can get more information at the Extend [project
| page](http://www.ivy.fr/js/extend).

# TODO: Add a class registry (needs @shared on Modules)
# TODO: Add a class prototype
# TODO: Add isA, instanceOf

@specific ActionScript
	@shared console  = Undefined
	@shared document = Undefined
@end

@shared Registry = {}

@function Class declaration
| Classes are created using extend by giving a dictionary that contains the
| following keys:
|
| - 'name', an optional name for this class
| - 'parent', with a reference to a parent class (created with Extend)
| - 'initialize', with a function to be used as a constructor
| - 'properties', with a dictionary of instance attributes
| - 'methods', with a dictionary of instance methods
| - 'shared', with a dictionary of class attributes
| - 'operations', with a dictionary of class operations
|
| Invoking the 'Class' function will return you a _Class Object_ that
| implements the following API:
|
| - 'isClass()' returns *true*( (because this is an object, not a class)
| - 'getName()' returns the class name, as a string
| - 'getParent()' returns a reference to the parent class
| - 'getOperation(n)' returns the operation with the given name
| - 'hasInstance(o)' tells if the given object is an instance of this class
| - 'isSubclassOf(c)' tells if the given class is a subclass of this class
| - 'listMethods()' returns a dictionary of *methods* available for this class
| - 'listOperations()' returns a dictionary of *operations* (class methods)
| - 'listShared()' returns a dictionary of *class attributes*
| - 'listProperties()' returns a dictionary of *instance attributes*
| - 'bindMethod(o,n)' binds the method with the given name to the given object
| - 'proxyWithState(o)' returns a *proxy* that will use the given object as if
|    it was an instance of this class (useful for implementing 'super')
|
| When you instanciate your class, objects will have the following methods
| available:
|
| - 'isClass()' returns *true*( (because this is an object, not a class)
| - 'getClass()' returns the class of this instance
| - 'getMethod(n)' returns the bound method which name is 'n'
| - 'getCallback(n)' the equivalent of 'getMethod', but will give the 'this' as
|    additional last arguments (useful when you the invoker changes the 'this',
|    which happens in event handlers)
| - 'isInstance(c)' tells if this object is an instance of the given class
|
| Using the 'Class' function is very easy (in *Sugar*):
|
| >   var MyClass = Extend Class {
| >      name:"MyClass"
| >      initialize:{
| >         self message = "Hello, world !"
| >      }
| >      methods:{
| >        helloWorld:{print (message)}
| >      }
| >   }
|
| instanciating the class is very easy too
|
| >   var my_instance = new MyClass()

	var full_name    = declaration name
	var class_object = {
		if not (arguments length == 1 and arguments[0] == "__Extend_SubClass__")
			@embed JavaScript
			| var properties = class_object.listProperties()
			| for ( var prop in properties ) {
			|   this[prop] = properties[prop];
			| }
			@end
			if target initialize -> return target initialize apply (target, arguments)
		end
	}
	class_object isClass      = {return true}
	class_object _parent      = declaration parent
	class_object _name        = declaration name
	class_object _properties  = {all:{},inherited:{},own:{}}
	class_object _shared      = {all:{},inherited:{},own:{}}
	class_object _operations  = {all:{},inherited:{},own:{},fullname:{}}
	class_object _methods     = {all:{},inherited:{},own:{},fullname:{}}
	class_object getName      = {return class_object _name}
	class_object getParent    = {return class_object _parent}
	class_object isSubclassOf = {c|
		var parent = this
		while parent
			if parent == c -> return True
			parent = parent getParent()
		end
		return False
	}
	class_object hasInstance   = {o|
		return o getClass() isSubclassOf (class_object)
	}
	class_object bindMethod = {object, methodName|
		var this_method = object [methodName]
		# FIXME: Throw exception if this_method is not defined
		return {
			var a = arguments
			if a length == 0
				return this_method call (object)
			if a length == 1
				return this_method call (object, a[0])
			if a length == 2
				return this_method call (object, a[0], a[1])
			if a length == 3
				return this_method call (object, a[0], a[1], a[2])
			if a length == 4
				return this_method call (object, a[0], a[1], a[2], a[3])
			if a length == 5
				return this_method call (object, a[0], a[1], a[2], a[3], a[4])
			else
				var args=[] ; args concat(arguments)
				return this_method apply (object, args)
			end
		}
	}
	class_object bindCallback = {object, methodName|
		var this_method = object [methodName]
		# FIXME: Throw exception if this_method is not defined
		return {
			var a = arguments
			if a length == 0
				return this_method call (object, target)
			if a length == 1
				return this_method call (object, a[0], target)
			if a length == 2
				return this_method call (object, a[0], a[1], target)
			if a length == 3
				return this_method call (object, a[0], a[1], a[2], target)
			if a length == 4
				return this_method call (object, a[0], a[1], a[2], a[3], target)
			if a length == 5
				return this_method call (object, a[0], a[1], a[2], a[3], a[4], target)
			else
				var args=[] ; args concat(arguments) ; args push(target)
				return this_method apply (object, args)
			end
		}
	}
	class_object getOperation = {name|
		var this_operation = class_object [name]
		# FIXME: Throw exception if this_method is not defined
		return { return this_operation apply (class_object, arguments) }
	}
	class_object listMethods   = {o,i|
		if o is Undefined -> o = True
		if i is Undefined -> i = True
		if o and i
			return class_object _methods all
		if (not o) and i
			return class_object _methods inherited
		if o and (not i)
			return class_object _methods own
		else
			return {}
		end
	}
	class_object listOperations   = {o,i|
		if o is Undefined -> o = True
		if i is Undefined -> i = True
		if o and i
			return class_object _operations all
		if (not o) and i
			return class_object _operations inherited
		if o and (not i)
			return class_object _operations own
		else
			return {}
		end
	}
	class_object listShared   = {o,i|
		if o is Undefined -> o = True
		if i is Undefined -> i = True
		if o and i
			return class_object _shared all
		if (not o) and i
			return class_object _shared inherited
		if o and (not i)
			return class_object _shared own
		else
			return {}
		end
	}
	class_object listProperties   = {o,i|
		if o is Undefined -> o = True
		if i is Undefined -> i = True
		if o and i
			return class_object _properties all
		if (not o) and i
			return class_object _properties inherited
		if o and (not i)
			return class_object _properties own
		else
			return {}
		end
	}
	class_object proxyWithState = {o|
		var proxy        = {}
		var constr       = Undefined
		var wrapper      = {f|return {return f apply(o,arguments)}}
		var proxy_object = {return class_object prototype initialize apply(o, arguments)}
		proxy_object prototype = proxy
		@embed JavaScript
		| for (var key in class_object.prototype) {
		|  var w = wrapper(class_object.prototype[key])
		|  if (key == "initialize") { constr=w }
		|  proxy[key] = w
		|  // This should not be necessary
		|  proxy_object[key] = w
		| }
		@end
		proxy_object getSuper = {
			return class_object getParent() proxyWithState(o)
		}
		return proxy_object
	}

	# TODO: There may be a way to inherit (using the prototype) from the parent
	# class operations without having to duplicate them.
	@embed JavaScript
	|if ( declaration.parent != undefined ) {
	|	// We proxy parent operations
	|	for ( var name in declaration.parent._operations.fullname ) {
	|		var operation = declaration.parent._operations.fullname[name]
	|		class_object._operations.fullname[name] = operation
	|		class_object[name] = operation
	|	}
	|	for ( var name in declaration.parent._operations.all ) {
	|		var operation = declaration.parent[name]
	|		class_object[name] = operation
	|		class_object._operations.all[name] = operation
	|		class_object._operations.inherited[name] = operation
	|	}
	|	for ( var name in declaration.parent._methods.all ) {
	|		var method = declaration.parent._methods.all[name]
	|		class_object._methods.all[name] = method
	|		class_object._methods.inherited[name] = method
	|	}
	|	// We copy parent class attributes default values
	|	for ( var name in declaration.parent._shared.all ) {
	|		var attribute = declaration.parent._shared.all[name]
	|		class_object[name] = attribute
	|		class_object._shared.all[name] = attribute
	|		class_object._shared.inherited[name] = attribute
	|	}
	|	// We copy parent instance attributes default values
	|	for ( var name in declaration.parent._properties.all ) {
	|		var prop = declaration.parent._properties.all[name]
	|		class_object._properties.all[name] = prop
	|		class_object._properties.inherited[name] = prop
	|	}
	|}
	|if ( declaration.operations != undefined ) {
	|	for ( var name in declaration.operations ) {
	|		var operation = declaration.operations[name]
	|		class_object[name] = operation
	|		class_object[full_name + "_" + name] = operation
	|		class_object._operations.all[name] = operation
	|		class_object._operations.all[name] = operation
	|		class_object._operations.own[name] = operation
	|		class_object._operations.fullname[full_name + "_" + name] = operation
	|	}
	|}
	|if ( declaration.methods != undefined ) {
	|	for ( var name in declaration.methods ) {
	|		var method = declaration.methods[name]
	|		class_object._methods.all[name] = method
	|		class_object._methods.own[name] = method
	|	}
	|}
	|if ( declaration.shared != undefined ) {
	|	for ( var name in declaration.shared ) {
	|		var attribute = declaration.shared[name]
	|		class_object[name] = attribute
	|		class_object._shared.all[name] = attribute
	|		class_object._shared.own[name] = attribute
	|	}
	|}
	|if ( declaration.properties != undefined ) {
	|	for ( var name in declaration.properties ) {
	|		var attribute = declaration.properties[name]
	|		class_object._properties.all[name] = attribute
	|		class_object._properties.own[name] = attribute
	|	}
	|}
	@end

	var instance_proto             = {}
	if declaration parent
		instance_proto = new declaration parent ("__Extend_SubClass__")
		instance_proto constructor = class_object
	end
	instance_proto isInstance      = Undefined
	instance_proto getClass        = {return class_object}
	instance_proto isClass         = {return False}
	instance_proto getMethod       = {methodName|
		var this_object = target
		return class_object bindMethod(this_object, methodName)
	}
	instance_proto getCallback       = {methodName|
		var this_object = target
		return class_object bindCallback(this_object, methodName)
	}
	instance_proto isInstance      = {c|return c hasInstance(target)}
	if declaration initialize
		instance_proto initialize = declaration initialize
	else
		instance_proto instance_proto = {}
	end
	instance_proto getSuper        = {c|return c proxyWithState(target)}

	@embed JavaScript
	|if ( declaration.methods != undefined ) {
	|	for ( var name in declaration.methods ) {
	|		instance_proto[name] = instance_proto[full_name + "_" + name] = declaration.methods[name]
	|}}
	|if ( declaration.initialize != undefined ) {
	|	instance_proto.initialize = instance_proto[full_name + "_initialize"] = declaration.initialize
	|}
	@end

	class_object prototype = instance_proto

	# We register the class in the registry
	if (declaration name)
		#if (Registry [declaration name])
		#	
		#	throw ("Class with same name already registered: " + (declaration name))
		#end
		Registry [declaration name] = class_object
	end

	return class_object

@end

@function Protocol pdata
@end

@function Singleton sdata
@end

@function getClass name
	return Registry [name]
@end

@function getClasses
	return Registry
@end

@function invoke t, f, args, extra
| The 'invoke' method allows advanced invocation (supporting by name, as list
| and as map invocation schemes) provided the given function 'f' has proper
| '__meta__' annotation.
|
| These annotations are expected to be like:
|
| >    f __meta__ = {
| >        arity:2
| >        arguments:{
| >           b:2,
| >           "*":[1]
| >           "**":{c:3,d:4}
| >        }
| >    }
|
	# TODO: Add consistency checks for invocation
	var meta = f ['__meta__']
	var actual_args = [] 
	extra ["*"]  :: {v   | args push(v) }
	extra ["**"] :: {v,k | extra[k] = v }
	args :: {v|actual_args push(args)}
	var start = args length
	while start < meta arity
		var arg = meta arguments [start]
		actual_args push (extra[arg name])
		start += 1
	end
	print ("CALLING ", f toSource())
	print (" with", actual_args toSource())
	return f apply (t, actual_args)
@end

@function getChildrenOf aClass:Class
	var res = {}
	@embed JavaScript
	|var values = Extend.getClasses()
	|for ( key in values ) {
	|	if ( values[key] != aClass && values[key].isSubclassOf(aClass) )
	|	{ res[key] = values[key] }
	|}
	@end
	return res
@end

@specific SUGAR_RUNTIME
| This contains specific code that is useful to [Sugar](http://www.ivy.fr/sugar)

	# =========================================================================
	# ARRAY OPERATIONS
	# =========================================================================

	@function range:List start:Number, end:Number, step:Number?
	| Creates a new list composed of elements in the given range, determined by
	| the 'start' index and the 'end' index. This function will automatically
	| find the proper step (wether '+1' or '-1') depending on the bounds you
	| specify.
		# TODO: Create a big array (1...100) and use subsets instead
		var result = []
		@embed JavaScript
		| if (start < end ) {
		|   for ( var i=start ; i<end ; i++ ) {
		|     result.push(i);
		|   }
		| }
		| else if (start > end ) {
		|   for ( var i=start ; i>end ; i-- ) {
		|     result.push(i);
		|   }
		| }
		@end
		return result
	@end

	@function iterate value:any, callback:Function, context:Object
	| Iterates on the given values. If 'value' is an array, the _callback_ will be
	| invoked on each item (giving the 'value[i], i' as argument) until the callback
	| returns 'false'. If 'value' is a dictionary, the callback will be applied
	| on the values (giving 'value[k], k' as argument). Otherwise the object is
	| expected to define both 'length' or 'getLength' and 'get' or 'getItem' to
	| enable the iteration.
		@embed JavaScript
		|  if ( !value ) { return }
		|  if ( value.length != undefined ) {
		|    var length = undefined
		|    // Is it an object with the length() and get() protocol ?
		|    if ( typeof(value.length) == "function" ) {
		|      length = value.length()
		|      for ( var i=0 ; i<length ; i++ ) {
		|        var cont = callback.call(context, value.get(i), i)
		|        if ( cont == false ) { i = length + 1 };
		|      }
		|    // Or a plain array ?
		|    } else {
		|      length = value.length
		|      for ( var i=0 ; i<length ; i++ ) {
		|       var cont = callback.call(context, value[i], i);
		|       if ( cont == false ) { i = length + 1 };
		|      }
		|    }
		|  } else {
		|    for ( var k in value ) {
		|      var cont = callback.call(context, value[k], k);
		|      if ( cont == false ) { i = length + 1 };
		|    }
		|  }
		@end
	@end

	@function sliceArguments args, index
	| This is a utility function that will return the rest of the given
	| arguments list, without using the 'slice' operation which is only
	| available to arrays.
		var res = []
		@embed JavaScript
		| while (index<args.length) { res.push(args[index++]) }
		@end
		return res
	@end

	@function slice value, start=0, end=Undefined
		if isString(value)
			if end is Undefined -> end = value length
			if start < 0 -> start = value length + start
			if end   < 0 -> end = value length + end
			return value substring (start, end)
		if isList(value)
			if end is Undefined -> end = value length
			if start < 0 -> start = value length + start
			if end   < 0 -> end = value length + end
			return value slice (start, end)
		else
			raise ("Unsupported type for slice:" + value)
		end
	@end

	# =========================================================================
	# TYPE INTROSPECTION FUNCTIONS
	# =========================================================================

	@function isDefined value
		return not (value is Undefined)
	@end

	@function isList value
		# We took our inspiration from here, and added support for null
		# <http://base2.googlecode.com/svn/version/1.0(beta2)/src/base2.js>
		@embed JavaScript
		| return !!( !(value===null) && typeof value == "object" && value.join && value.splice);
		@end
	@end

	@function isString value
		return typeof (value) == "string"
	@end

	@function isMap value
		@embed JavaScript
		| return !!(!typeof object == "object")
		@end
	@end

	@function isFunction value
		@embed JavaScript
		| return !!(typeof object == "function")
		@end
	@end

	@function isInstance value
		return isDefined (value getClass)
	@end

	# =========================================================================
	# STDIO
	# =========================================================================

	@function print args...
	| Prints the given arguments to the JavaScript console (available in Safari
	| and in Mozilla if you've installed FireBug), or using the 'print' command
	| in SpiderMonkey. If neither 'console' or 'print' is defined,
	| this won't do anything.
	|
	| When objects are given as arguments, they will be printed using the
	| 'toSource' method they offer.
	|
	| Example:
	|
	| >    Extend print ("Here is a dict:", {a:1,b:2,c:3})
	|
	| will output
	|
	| >    "Here is a dict: {a:1,b:2,c:3}"
		@embed JavaScript
		| if (typeof(console)=="undefined"&&typeof(print)=="undefined"){return;}
		| var res = ""
		| for ( var i=0 ; i<args.length ; i++ ) {
		|   var val = args[i]
		|   if ( val!=undefined && typeof(val) == "object" && val.toSource != undefined) { val = val.toSource() }
		|   if ( i<args.length-1 ) { res += val + " " }
		|   else { res += val }
		| }
		| if(typeof(console)!="undefined"){console.log(res);}
		| else if(typeof(document)=="undefined"&&typeof(print)!="undefined"){print(res);}
		@end
	@end

@end

# EOF vim: syn=sugar sw=4 ts=4 noet
