@module extend
@version 2.1.0f (19-Feb-2007)
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
@shared Counters = {
	Instances:0
}

#if JAVASCRIPT
	#include <extend-oop-javascript.sjs>
#end

#if NO_RUNTIME
	#include <extend-runtime.sjs>
#end

# EOF vim: syn=sugar sw=4 ts=4 noet
