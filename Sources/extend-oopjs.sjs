@module extend

# TODO: Should sepdn some time refactoring all this, making sure it's fast and sound

@shared modules  = {
	_expected : 0
	_ready    : []
}

@shared Counters = {
	Instances:0
	Classes:0
}

@function module name
	if not isDefined (modules [name])
		modules [name] = {__name__:name}
	end
	return modules [name]
@end

@function _wrapMethod o, n
	return {
		@embed JavaScript
		|var m = o[n];
		|var a = arguments;
		|switch (a.length) {
		|	case 0:  return (m.call(o));
		|	case 1:  return (m.call(o, a[0]));
		|	case 2:  return (m.call(o, a[0], a[1]));
		|	case 3:  return (m.call(o, a[0], a[1], a[2]));
		|	case 4:  return (m.call(o, a[0], a[1], a[2], a[3]));
		|	case 5:  return (m.call(o, a[0], a[1], a[2], a[3], a[4]));
		|	case 6:  return (m.call(o, a[0], a[1], a[2], a[3], a[4], a[5]));
		|	case 7:  return (m.call(o, a[0], a[1], a[2], a[3], a[4], a[5], a[6]));
		|	default: return this_method.apply(object, [object].concat(Array.prototype.slice.call(arguments)));
		|}
		@end
	}
@end

@function Class declaration
| Classes are created using extend by giving a dictionary that contains the
| following keys:
|
| - 'name', an optional name for this class
| - 'parent', with a reference to a parent class (created with extend)
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
| - 'proxyWithState(o)' returns a *proxy* that will use the given object as if
|    it was an instance of this class (useful for implementing 'super')
|
| When you instanciate your class, objects will have the following methods
| available:
|
| - 'isClass()' returns *false*( (because this is an object, not a class)
| - 'getClass()' returns the class of this instance
| - 'getMethod(n)' returns the bound method which name is 'n'
| - 'getCallback(n)' the equivalent of 'getMethod', but will give the 'this' as
|    additional last arguments (useful when you the invoker changes the 'this',
|    which happens in event handlers)
| - 'isInstance(c)' tells if this object is an instance of the given class
|
| Using the 'Class' function is very easy (in *Sugar*):
|
| >   var MyClass = extend Class {
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
	class_object id           = Counters Classes
	class_object _wrapMethod  = _wrapMethod
	Counters Classes         += 1
	class_object isSubclassOf = {c|
		var parent = this
		while parent
			if parent == c -> return True
			parent = parent getParent()
		end
		return False
	}
	class_object hasInstance   = {o|
		return o and (extend isDefined (o getClass)) and (o getClass () isSubclassOf (class_object))
	}
	class_object getOperation = {name|
		var this_operation = class_object [name]
		if not this_operation -> return None
		if not (class_object __operationCache) -> class_object __operationCache = {}
		# We use a cache so that multiple calls to getMethod will actually
		# return the same object
		var o = class_object __operationCache [name]
		if not o
			# NOTE: We don't do class_object[name] in the callback as we want
			# to preserve against monkey-patching
			o = { return this_operation apply (class_object, arguments) }
			class_object __operationCache [name] = o
		end
		return o
	}
	class_object listMethods   = {o,i|
		if o is Undefined -> o = True
		if i is Undefined -> i = True
		if o and i
			return class_object _methods all
		elif (not o) and i
			return class_object _methods inherited
		elif o and (not i)
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
		elif (not o) and i
			return class_object _operations inherited
		elif o and (not i)
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
		|  // This should not be necessary, but it actually is! -- should investigae at some point
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
	instance_proto _methodCache    = Undefined
	instance_proto getMethod       = {methodName|
		var this_object = target
		if not (this_object __methodCache) -> this_object __methodCache = {}
		# We use a cache so that multiple calls to getMethod will actually
		# return the same object
		var m = this_object __methodCache [methodName]
		if not m
			m = class_object _wrapMethod (this_object, methodName)
			this_object __methodCache [methodName] = m
		end
		return m
	}
	instance_proto getCallback       = {methodName|
		var this_object = target
		var this_object = target
		if not (this_object __methodCache) -> this_object __methodCache = {}
		var callback_name = methodName + "_k"
		# We use a cache so that multiple calls to getMethod will actually
		# return the same object
		if this_object __methodCache [callback_name]
			return this_object __methodCache [callback_name]
		else
			var m = class_object _wrapMethod (this_object, methodName)
			this_object __methodCache [callback_name] = m
			return m
		end
	}
	# FIXME: Closure could be shared
	instance_proto isInstance      = {c|return c hasInstance(target)}
	if declaration initialize
		instance_proto initialize = declaration initialize
	else
		instance_proto instance_proto = {}
	end
	# FIXME: Closure could be shared
	instance_proto getSuper        = {c|
		# NOTE: Here we cache the proxies to parent classes, as they are very
		# costly to create
		if typeof(target _extendProxyWithState) == "undefined"
			target _extendProxyWithState = {(c id):c proxyWithState(target)}
		if typeof(target _extendProxyWithState [c id]) == "undefined"
			target _extendProxyWithState [c id] = c proxyWithState(target)
		end
		return target _extendProxyWithState[c id]
	}

	# FIXME: This sounds a bit overkill to copy EVERY method defined here into
	# the instance proto... as it seems redundant with the class object. However, this has to be
	# done only ONCE per class, so it's OK!
	@embed JavaScript
	|if ( declaration.operations != undefined ) {
	|	for ( var name in declaration.operations ) {
	|		instance_proto[name] = instance_proto[full_name + "_" + name] = class_object.getOperation(name)
	|}}
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
		# FIXME: We have to deal with multiple declarations
		#if (Registry [declaration name])
		#	throw ("Class with same name already registered: " + (declaration name))
		#end
		if Registry != Undefined
			Registry [declaration name] = class_object
		end
	end

	return class_object

@end

@function Protocol pdata
@end

@function Singleton sdata
@end

# EOF
