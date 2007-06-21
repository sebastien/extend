@module Extend
@version 1.99 (21-Jun-2007)

@target JavaScript
| This module implements a complete OOP layer for JavaScript that makes it
| easy to develop highly structured JavaScript applications.
|
| Classes are created using extend by giving a dictionary that contains the
| following keys:
|
| - 'init', with a function to be used as a init
| - 'attributes', with a dictionary of class attributes
| - 'operations', with a dictionary of class operations
| - 'methods', with a dictionary of instance methods
| - 'parent', with a reference to a parent class (created with Extend)
| - 'name', an optional name for this class
|
| Extend 2.0 is a rewritten, simplified version of the Extend 1 library. It is
| not compatible with the previous versions, but the API will be stable from
| this release.

# TODO: Add a class registry (needs @shared on Modules)
# TODO: Add a class prototype

@function _proxyFunction functionToWrap:Function, targetObject:Object
	@embed JavaScript
	|return function(){
	|	return functionToWrap.apply(targetObject, arguments)
	|}
	@end
@end

@function create declaration
| Classes are created using extend by giving a dictionary that contains the
| following keys:
|
| - 'init', with a function to be used as a init
| - 'attributes', with a dictionary of class attributes
| - 'operations', with a dictionary of class operations
| - 'methods', with a dictionary of instance methods
| - 'parent', with a reference to a parent class (created with Extend)
| - 'name', an optional name for this class
|
	var full_name    = declaration name
	var class_object = {
		when not (arguments length == 1 and arguments[0] == "__Extend_SubClass__")
			return target init apply (target, arguments)
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
	instance_proto getSuperMethod  = {name|
		var this_object  = target
		var parent_proto = declaration parent prototype
		return {parent_proto[name] apply (target, arguments)}
	}
	instance_proto isInstance      = {c|return c hasInstance(target)}

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

@function protocol pdata
@end

@function singleton sdata
@end

# EOF vim: syn=sugar sw=4 ts=4 noet
