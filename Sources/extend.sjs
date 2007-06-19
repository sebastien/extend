@module Extend
@target JavaScript
| This module implements a complete OOP layer for JavaScript that makes it
| easy to develop highly structured JavaScript applications.
|
| Classes are created using extend by giving a dictionary that contains the
| following keys:
|
| - 'constructor', with a function to be used as a constructor
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

@function create declaration
| Classes are created using extend by giving a dictionary that contains the
| following keys:
|
| - 'constructor', with a function to be used as a constructor
| - 'attributes', with a dictionary of class attributes
| - 'operations', with a dictionary of class operations
| - 'methods', with a dictionary of instance methods
| - 'parent', with a reference to a parent class (created with Extend)
| - 'name', an optional name for this class
|
	var class_object = {
		target constructor apply (target, arguments)
	}
	class_object isClass   = {return true}
	class_object _parent    = declaration parent
	class_object _name      = declaration name
	class_object getName   = {return class_object _name}
	class_object getParent = {return class_object _parent}
	@embed JavaScript
		if ( declaration.operations != undefined ) {
			for ( var name in declaration.operations ) {
				class_object[name] = declaration.operations[name]
		}}
		if ( declaration.attributes != undefined ) {
			for ( var name in declaration.attributes ) {
				class_object[name] = declaration.attributes[name]
		}}
	@end

	var instance_proto = {}
	instance_proto isInstance = Undefined
	instance_proto getClass   = {return class_object}
	instance_proto isClass    = {return False}
	@embed JavaScript
		if ( declaration.methods != undefined ) {
			for ( var name in declaration.methods ) {
				instance_proto[name] = declaration.methods[name]
		}}
		if ( declaration.constructor != undefined ) {
			instance_proto.constructor = declaration.constructor
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
