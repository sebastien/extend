@module extend
@version 2.2.7
@import flash.utils.getDefinitionByName
@import flash.utils.getQualifiedSuperclassName
@import flash.external.ExternalInterface

@shared ErrorCallback
@shared DebugCallback
@shared PrintCallback

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
	return f apply (t, actual_args)
@end

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

@function iterate value, callback:Function, context:Object
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

@function len:Integer value
	if isList(value)
		return value length
	if isObject(value)
		if value length
			return value length
		if value __len__
			return value __len__ ()
		end
	else
		return None
	end
@end

@function type value
	return typeof(value)
@end

@function access value, index
	if isList(value)
		if index >= 0
			@embed JavaScript
			|return value[index]
			@end
		else
			@embed JavaScript
			|return value[value.length + index]
			@end
		end
	else
		# FIXME: Support access protocol for objects
		@embed JavaScript
		|return value[index]
		@end
	end
@end

@function isIn value, list
| Returns true if the given value is in the given list
	if isList (list)
		@embed JavaScript
		| for ( var i=0 ; i<list.length ; i++) {
		|   if (list[i]==value) { return true }
		| }
		| return false
		@end
	if isMap (list)
		@embed JavaScript
		| for ( var i in list ) {
		|   if (list[i]==value) { return true }
		| }
		| return false
		@end
	else
		return False
	end
@end

# =========================================================================
# PRIMITIVE FACTORY METHODS
# =========================================================================

@function createMapFromItems items...
	@embed JavaScript
	| var result = {}
	| for ( var i=0 ; i<items.length ; i++ ) {
	|   result[items[i][0]] = items[i][1]
	| }
	| return result
	@end
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
	# and then from 
	# <http://thinkweb2.com/projects/prototype/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/>
	@embed JavaScript
	| return Object.prototype.toString.call(value) === '[object Array]';
	@end
@end

@function isNumber value
	return typeof (value) == "number"
@end

@function isString value
	return typeof (value) == "string"
@end

@function isMap value
	@embed JavaScript
	| return !!(!(value===null) && typeof value == "object" && !extend.isList(value))
	@end
@end

@function isFunction value
	@embed JavaScript
	| return !!(typeof value == "function")
	@end
@end

@function isObject value
	@embed JavaScript
	| return !!(typeof value == "object")
	@end
@end

@function isInstance value, ofClass=Undefined
| Tells if the given value is an instance (in the sense of extend) of the
| given 'ofClass'. If there is no given class, then it will just return
| true if the value is an instance of any class.
	if ofClass
		return isDefined (value getClass) and value isInstance (ofClass)
	else
		return isDefined (value getClass)
	end
@end

@function getMethodOf instance, name
	return instance[name]
@end

@function getClassOf instance
	@embed ActionScript
	|return getDefinitionByName(getQualifiedSuperclassName(instance));
	@end
	@embed JavaScript
	|return instance.getClass()
	@end
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
| >    extend print ("Here is a dict:", {a:1,b:2,c:3})
|
| will output
|
| >    "Here is a dict: {a:1,b:2,c:3}"
	var pr_func = eval("print")
	if typeof(console) == "undefined" and typeof(pr_func) is "undefined" and PrintCallback is Undefined
		return None
	end
	var res = ""
	@embed JavaScript
	| for ( var i=0 ; i<args.length ; i++ ) {
	|   var val = args[i]
	|   if ( val!=undefined && typeof(val) == "object" && val.toSource != undefined) { val = val.toSource() }
	|   if ( i<args.length-1 ) { res += val + " " }
	|   else { res += val }
	| }
	@end
	if PrintCallback is Undefined
		if typeof(console) != "undefined"
			console log (res)
		if typeof(document) == "undefined" and typeof(pr_func) != "undefined"
			pr_func (res)
		end
	else
		PrintCallback (res)
	end
@end

@function error message
	if ErrorCallback
		ErrorCallback (message)
	else
		print ("[!] " + message)
	end
@end

@function debug message
	if DebugCallback
		DebugCallback (message)
	else
		print ("[ ] " + message)
	end
@end

@function assert predicate, message
	if not predicate
		error (message)
	end
@end

@function fail message
	error (message)
	return False
@end

#EOF
