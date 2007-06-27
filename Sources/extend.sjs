@module Extend
@version 1.99 (27-Jun-2007)

@target JavaScript
| This module implements a complete OOP layer for JavaScript that makes it
| easy to develop highly structured JavaScript applications.
|
| Classes are created using extend by giving a dictionary that contains the
| following keys:
|
| - 'name', an optional name for this class
| - 'parent', with a reference to a parent class (created with Extend)
| - 'init', with a function to be used as a init
| - 'methods', with a dictionary of instance methods
| - 'attributes', with a dictionary of class attributes
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


@function Class declaration
| Classes are created using extend by giving a dictionary that contains the
| following keys:
|
| - 'name', an optional name for this class
| - 'parent', with a reference to a parent class (created with Extend)
| - 'init', with a function to be used as a init
| - 'methods', with a dictionary of instance methods
| - 'attributes', with a dictionary of class attributes
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
| - 'listAttributes()' returns a dictionary of *class attributes*
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
| - 'isInstance(c)' tells if this object is an instance of the given class
|
| Using the 'Class' function is very easy (in *Sugar*):
|
| >   var MyClass = Extend Class {
| >      name:"MyClass"
| >      init:{
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
		when not (arguments length == 1 and arguments[0] == "__Extend_SubClass__")
			when target init -> return target init apply (target, arguments)
		end
	}
	class_object isClass      = {return true}
	class_object _parent      = declaration parent
	class_object _name        = declaration name
	class_object _attributes  = {all:{},inherited:{},own:{}}
	class_object _operations  = {all:{},inherited:{},own:{},fullname:{}}
	class_object _methods     = {all:{},inherited:{},own:{},fullname:{}}
	class_object getName      = {return class_object _name}
	class_object getParent    = {return class_object _parent}
	class_object isSubclassOf = {c|
		var parent = this
		while parent
			when parent == c -> return True
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
		return { return this_method apply (object, arguments) }
	}
	class_object getOperation = {name|
		var this_operation = object [name]
		# FIXME: Throw exception if this_method is not defined
		return { return this_operation apply (class_object, arguments) }
	}
	class_object listMethods   = {o,i|
		when o is Undefined -> o = True
		when i is Undefined -> i = True
		when o and i
			return class_object _methods all
		when (not o) and i
			return class_object _methods inherited
		when o and (not i)
			return class_object _methods own
		otherwise
			return {}
		end
	}
	class_object listOperations   = {o,i|
		when o is Undefined -> o = True
		when i is Undefined -> i = True
		when o and i
			return class_object _operations all
		when (not o) and i
			return class_object _operations inherited
		when o and (not i)
			return class_object _operations own
		otherwise
			return {}
		end
	}
	class_object listAttributes   = {o,i|
		when o is Undefined -> o = True
		when i is Undefined -> i = True
		when o and i
			return class_object _attributes all
		when (not o) and i
			return class_object _attributes inherited
		when o and (not i)
			return class_object _attributes own
		otherwise
			return {}
		end
	}
	class_object proxyWithState = {o|
		var proxy        = {}
		var constr       = Undefined
		var wrapper      = {f|return {return f apply(o,arguments)}}
		var proxy_object = {return constr apply(undefined, arguments)}
		proxy_object prototype = proxy
		@embed JavaScript
		| for (var key in class_object.prototype) {
		|  var w = wrapper(class_object.prototype[key])
		|  if (key == "init") { constr=w }
		|  proxy[key] = w
		|  // This should not be necessary
		|  proxy_object[key] = w
		| }
		@end
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
	|	for ( var name in declaration.parent._attributes.all ) {
	|		var attribute = declaration.parent._attributes.all[name]
	|		class_object[name] = attribute
	|		class_object._attributes.all[name] = attribute
	|		class_object._attributes.inherited[name] = attribute
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
	|if ( declaration.attributes != undefined ) {
	|	for ( var name in declaration.attributes ) {
	|		var attribute = declaration.attributes[name]
	|		class_object[name] = attribute
	|		class_object._attributes.all[name] = attribute
	|		class_object._attributes.own[name] = attribute
	|	}
	|}
	@end

	var instance_proto             = {}
	when declaration parent
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
	instance_proto isInstance      = {c|return c hasInstance(target)}
	when declaration init -> instance_proto init = declaration init 
	instance_proto getSuper        = {c|return c proxyWithState(target)}

	@embed JavaScript
	|if ( declaration.methods != undefined ) {
	|	for ( var name in declaration.methods ) {
	|		instance_proto[name] = instance_proto[full_name + "_" + name] = declaration.methods[name]
	|}}
	|if ( declaration.init != undefined ) {
	|	instance_proto.init = instance_proto[full_name + "_init"] = declaration.init
	|}
	@end

	class_object prototype = instance_proto
	return class_object

@end

@function Protocol pdata
@end

@function Singleton sdata
@end

@specific SUGAR_RUNTIME
| This contains specific code that is useful to [Sugar](http://www.ivy.fr/sugar)

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
		|     res.push(i);
		|   }
		| }
		| else if (start > end ) {
		|   for ( var i=start ; i>end ; i-- ) {
		|     res.push(i);
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
		| if(typeof(print)!="undefined"){print(res);}
		@end
	@end

@end

# EOF vim: syn=sugar sw=4 ts=4 noet
