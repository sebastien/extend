@module Extend
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
		return function(){return functionToWrap.apply(targetObject, arguments)}
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
	var class_object = {
		target init apply (target, arguments)
	}
	class_object isClass      = {return true}
	class_object _parent      = declaration parent
	class_object _name        = declaration name
	class_object _attributes  = {}
	class_object _operations  = {}
	class_object _methods     = {}
	class_object _init        = Undefined
	class_object getName      = {return class_object _name}
	class_object getParent    = {return class_object _parent}
	@embed JavaScript
		if ( declaration.parent != undefined ) {
			// We copy parent class attributes default values
			for ( var name in declaration.parent._attributes ) {
				class_object._attributes[name] = declaration.parent._attributes[name]
				class_object[name] = declaration.parent._attributes[name]
			}
			// We proxy parent operation
			for ( var name in declaration.parent._operations ) {
				class_object._operations[name] = declaration.parent
				class_object[name] = Extend._proxyFunction(declaration.parent[name],class_object)
			}
			// We proxy parent methods
			for ( var name in declaration.parent._methods ) {
				class_object._methods[name] = declaration.parent
			}
			if ( declaration.parent._init ) {
				class_object._init = declaration.parent._init
			}
		}
		if ( declaration.operations != undefined ) {
			for ( var name in declaration.operations ) {
				class_object[name] = declaration.operations[name]
				class_object._operations[name] = class_object
		}}
		if ( declaration.methods != undefined ) {
			for ( var name in declaration.methods ) {
				class_object._methods[name] = class_object
		}}
		if ( declaration.attributes != undefined ) {
			for ( var name in declaration.attributes ) {
				class_object[name] = declaration.attributes[name]
				class_object._attributes[name] = declaration.attributes[name]
		}}
		if ( declaration.init != undefined ) {
			class_object._init = declaration.init
		}
	@end

	var instance_proto             = {}
	instance_proto isInstance      = Undefined
	instance_proto getClass        = {return class_object}
	instance_proto isClass         = {return False}
	# FIXME: Uncommenting this will break the @embed
	#instance_proto getSuperMethod  = {name|
	#	var this_object  = target
	#	var parent_proto = declaration parent prototype
	#	return {parent_proto[name] apply (target, arguments)}
	#}
	@embed JavaScript
		if ( declaration.parent ) {
			var parent_class = declaration.parent
			for ( var name in parent_class._methods ) {
				instance_proto[name] = declaration.parent.prototype[name]
			}
		}
		if ( declaration.methods != undefined ) {
			for ( var name in declaration.methods ) {
				instance_proto[name] = declaration.methods[name]
		}}
		if ( declaration.parent != undefined ) {
			console.log(declaration.parent._init)
			instance_proto.init = declaration.parent._init
		}
		if ( declaration.init != undefined ) {
			console.log( "" + declaration.init.valueOf())
			console.log(typeof(declaration.init))
			instance_proto.init = declaration.init
		}
	@end
	class_object prototype    = instance_proto
	return class_object

@end

@function protocol pdata
@end

@function singleton sdata
@end

# EOF vim: syn=sugar sw=4 ts=4 noet
