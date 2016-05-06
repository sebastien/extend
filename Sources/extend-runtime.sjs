@module  extend
@version 3.0.3

@shared ExceptionCallback
@shared ErrorCallback
@shared WarningCallback
@shared DebugCallback
@shared PrintCallback

@shared FLOW_BREAK    = 1
@shared FLOW_CONTINUE = 2
@shared FLOW_RETURN   = 3

@shared Nothing       = new Object()
@shared Timeout       = new Object()
@shared Error         = new Object()
@shared Type          = {
	Undefined : "undefined"
	None      : "none"
	Number    : "number"
	String    : "string"
	List      : "list"
	Map       : "map"
	Object    : "object"
	Function  : "function"
	Instance  : "instance"
	Unknown   : "unknown"
}

@shared OPTIONS       = {
	modulePrefix : "lib/sjs/"
	moduleSuffix : ".sjs"
}

@function require module, callback
	if not extend modules [module]
		extend modules [module] = Nothing
		var head   = document getElementByTagName "head" [0]
		var script = document createElement "script"
		script setAttribute ("src", OPTIONS modulePrefix + module + OPTIONS moduleSuffix)
		head appendChild (script)
		# FIXME: Rendez-vous for when all the moduels are loaded... or document ready?
		# if extend modules _expected == 0
		# 	window setTimeout
		# end
	else
		return extend modules [module]
	end
@end

# @function ready callback
# 	extend modules _ready (callback)
# @end

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

@function str v
	if isString (v)
		return v
	else
		return JSON stringify (v)
	end
@end

@function range:List start:Number, end:Number, step:Number=1
| Creates a new list composed of elements in the given range, determined by
| the 'start' index and the 'end' index. This function will automatically
| find the proper step (wether '+1' or '-1') depending on the bounds you
| specify.
	# TODO: Create a big array (1...100) and use subsets instead
	var result = []
	@embed JavaScript
	| if (!extend.isDefined(end)) {
	|   if (extend.isList(start)) {end=start[1];start=start[0];}
	|   else                      {end=start;start=0;}
	| }
	| if (start < end ) {
	|   for ( var i=start ; i<end ; i+=step ) {
	|     result.push(i);
	|   }
	| }
	| else if (start > end ) {
	|   for ( var i=start ; i>end ; i-=step ) {
	|     result.push(i);
	|   }
	| }
	@end
	return result
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

# =========================================================================
# ALL TYPES OPERATIONS
# =========================================================================

@function len:Integer value
	@embed JavaScript
	|return  value && value !== "" && (value instanceof Array ? value.length : (value.length !== undefined ? value.length : Object.getOwnPropertyNames(value).length)) || 0;
	@end
@end

@function access value, index
	if index >= 0
		@embed JavaScript
		|return value[index]
		@end
	else
		if (typeof(value) == "string") or isList(value) or (value and isNumber(value length))
			@embed JavaScript
			|return value[value.length + index]
			@end
		else
			raise ("extend.access:Type not supported:" + value)
		end
	end
@end

@function offset value, index
	if index >= 0
		return index
	else
		return len(value) + index
	end
@end

@function iterate value, callback:Function, context:Object
| Iterates on the given values. If 'value' is an array, the _callback_ will be
| invoked on each item (giving the 'value[i], i' as argument) until the callback
| returns 'false'. If 'value' is a dictionary, the callback will be applied
| on the values (giving 'value[k], k' as argument). Otherwise the object is
| expected to define both '__len__' and '__item__' to
| enable the iteration.
	@embed JavaScript
	|  if ( !value ) { return }
	|  // We use foreach if it's available
	|  var result      = undefined;
	|  if ( value.forEach ) {
	|       try {result=value.forEach(callback)} catch (e) {
	|           if      ( e === extend.FLOW_CONTINUE ) {}
	|           else if ( e === extend.FLOW_BREAK    ) {return e}
	|           else if ( e === extend.FLOW_RETURN   ) {return e}
	|           else    { extend.exception(e) ; throw e}
	|       }
	|  } else if ( value.length != undefined ) {
	|    var length = undefined;
	|    // Is it an object with the length() and get() protocol ?
	|    if ( typeof(value.__len__) == "function" && typeof(value.__getitem__) == "function" ) {
	|      length = value.__len__()
	|      for ( var i=0 ; i<length ; i++ ) {
	|          try {result=callback.call(context, value.__getitem__(i), i);} catch (e) {
	|              if      ( e === extend.FLOW_CONTINUE ) {}
	|              else if ( e === extend.FLOW_BREAK    ) {return e}
	|              else if ( e === extend.FLOW_RETURN   ) {return e}
	|              else    { extend.exception(e) ; throw e}
	|          }
	|      }
	|    // Or a plain array ?
	|    } else {
	|      length = value.length;
	|      for ( var i=0 ; i<length ; i++ ) {
	|          var result = undefined;
	|          try {result=callback.call(context, value[i], i);} catch (e) {
	|              if      ( e === extend.FLOW_CONTINUE ) {}
	|              else if ( e === extend.FLOW_BREAK    ) {return e}
	|              else if ( e === extend.FLOW_RETURN   ) {return e}
	|              else    { extend.exception(e) ; throw e}
	|          }
	|      }
	|    }
	|  } else {
	|    for ( var k in value ) {
	|       var result = undefined;
	|       try {result=callback.call(context, value[k], k);} catch (e) {
	|          if      ( e === extend.FLOW_CONTINUE ) {}
	|          else if ( e === extend.FLOW_BREAK    ) {return e}
	|          else if ( e === extend.FLOW_RETURN   ) {return e}
	|          else    { extend.exception(e) ; throw e}
	|       }
	|    }
	|  }
	|  if (!(result===undefined)) {return result}
	@end
@end

# =========================================================================
# MAP AND ARRAY OPERATIONS
# =========================================================================

@function keys value
	if (value is None) or (value is Undefined) or (value is True) or (value is False or extend isString(value)) or extend isNumber(value)
		return None
	elif extend isList (value)
		var l = value length
		var i = 0
		var r = new Array (value length)
		while i < l
			r[i] = i
			i += 1
		end
		return r
	else
		return Object getOwnPropertyNames (value)
	end
@end

@function values value
	if extend isString(value) or extend isNumber(value)
		return None
	elif extend isList (value)
		return [] concat (value)
	else
		#return extend map (value, {v,j|return v})
		# FIXME: Use map?
		var res = []
		@embed JavaScript
		|for(var k in value) { res.push(value[k]); }
		@end
		return res
	end
@end

@function items value
	if extend isString(value) or extend isNumber(value)
		return None
	elif extend isList (value)
		return extend map (value, {v,i|return {key:i, value:v}})
	else
		#return extend map (value, {v,k|return {key:k, value:v}})
		var res = []
		# FIXME: Use map?
		@embed JavaScript
		|for (var k in value) { res.push({key:k,value:value[k]}); }
		@end
		return res
	end
@end

@function pairs value
| Returns (key, value) pairs
	if extend isString(value) or extend isNumber(value)
		return None
	elif extend isList (value)
		return extend map (value, {v,i|return [i, v]})
	else
		var res = []
		value :: {v,i|res push [i, v]}
		return res
		# var res = []
		# # FIXME: Use map?
		# @embed JavaScript
		# |for (var k in value) { res.push({key:k,value:value[k]}); }
		# @end
		# return res
	end
@end

@function equals a, b
	return cmp (a,b) == 0
@end

@function greater a, b
	return cmp (a,b) > 0
@end

@function smaller a, b
	return cmp (a,b) < 0
@end

@function cmp a, b
| Compares the given values, with the following semantics:
|
| - Arrays: will compare each value, returning the result for the
|   first non-zero comparison
| - Maps: will compare all the  values that are defined in both
| - Strings: use `localeCompare`
	# FIXME: Implement list
	if isList (a)
		if isList (b)
			var la  = len(a)
			var lb  = len(b)
			var l   = Math max (la, lb)
			var res = 0
			var i   = 0
			while (res == 0) and (i < l)
				res = cmp (a[i], b[i])
				i  += 1
			end
			return res
		elif len(a) > len(b)
			return 1
		else
			return -1
		end
	elif isMap (a)
		if isMap (b)
			var res = 0
			a :: {va,k|
				var vb = b[k]
				if not isDefined (va)
					res = -1
				if not isDefined (vb)
					res = 1
				else
					res = cmp (va, vb)
				end
				if res != 0 -> break
			}
			if res == 0
				b :: {vb,k|
					var va = a[k]
					if not isDefined (va)
						res = -1
					if not isDefined (vb)
						res = 1
					else
						res = cmp (va, vb)
					end
					if res != 0 -> break
				}
			end
			return res
		elif len(a) > len(b)
			return 1
		else
			return -1
		end
	elif isString (a) and isString (b) and isDefined (a localeCompare)
		return a localeCompare (b)
	elif a is None
		if b is None
			return 0
		elif b is Undefined
			return 1
		else
			return -1
		end
	elif a is Undefined
		if b is Undefined
			return 0
		else
			return -1
		end
	else
		if a is b
			return 0
		if a == b
			return 0
		if a is Nothing
			return -1
		if b is Nothing
			return 1
		if a > b
			return 1
		if a < b
			return -1
		if not extend isDefined (b)
			return 1
		if not extend isDefined (a)
			return -1
		else
			# We return -2 in that unsupported case
			return -2
		end
	end
@end

@function reverse value
	var l = value length
	var r = new Array ()
	for v,i in value
		r[l - i] = v
	end
	return r
@end

@function sorted value, comparison=cmp, reverse=False
	if isList (comparison)
		var l = len (comparison) - 1
		# FIXME: Experimental multi-criteria sort
		var c = {a,b|
			var total = 0
			for extractor, i in comparison
				var va = extractor (a)
				var vb = extractor (b)
				var v  = extend cmp (va, vb) * Math pow (10, l - i)
				total += v
			end
			return total
		}
		return sorted (value, c, reverse)
	else
		if extend isList   (value)
			value = copy (value)
			value sort (comparison)
			if reverse
				value reverse ()
			end
			return value
		if isMap (value)
			return sorted (values (value), cmp, reverse)
		if isNumber (value) or isString (value)
			return value
		if not value
			return value
		else
			raise ("Not implemented")
		end
	end
@end

@function copy value, depth=1
	if (not isDefined (value)) or (value is False) or (value is True) or (value is None)
		return value
	if depth < 1
		return value
	if extend isList   (value)
		if depth <= 1
			if value and value concat
				return [] concat (value)
			else
				return extend map (value, {_|return _})
			end
		else
			return extend map (value, {_|return copy(_, depth - 1)})
		end
	if extend isObject (value)
		var r = {}
		@embed JavaScript
		|for (var k in value) {
		|if (depth <= 1) { r[k]=value[k]; }
		|else            { r[k]=extend.copy(value[k], depth - 1); }
		|}
		@end
		return r
	else
		return value
	end
@end

@function merge value, otherValue, replace=False
	if isList(value)
		assert (isList(otherValue), "extend.merge(a,b) b expected to be a list")
		for v in otherValue
			if extend find (value, v) == -1
				value push (v)
			end
		end
	if isMap(value)
		assert (isMap(otherValue),   "extend.merge(a,b) b expected to be a map")
		for v,k in otherValue
			if (not isDefined (value[k])) or replace
				value[k] = v
			end
		end
	elif (value)
		error ("extend.merge(a,_) expects a to be a list or a map")
	end
	return value
@end

@function couplesAsMap value
	if extend isList (value)
		var r = {}
		for v,k in value
			r[v[0]] = v[1]
		end
		return r
	else
		error ("couplesAsMap: expects [[<key>, <value>]] as input, got", value)
		return None
	end
@end

@function itemsAsMap value
	if extend isList (value)
		var r = {}
		for v,k in value
			r[v key] = v value
		end
		return r
	else
		error ("itemsAsMap: expects [[{key:<key>, value:<value>}] as input, got", value)
		return None
	end
@end

# =========================================================================
# ARRAY OPERATIONS
# =========================================================================

@function find enumerable, value
| Returns the index of the first element that equals the given value
| Returns -1 if not found.
	var found = -1
	for v,k in enumerable
		if (v == value) and (found == -1)
			found = k
			break
		end
	end
	return found
@end

@function insert enumerable, position, value
	if isList (enumerable)
		enumerable splice (position, 0, value)
		return enumerable
	else
		error ("extend.add: Type not supported", enumerable)
		return None
	end
@end

@function add enumerable, value
	if isList (enumerable)
		enumerable push (value)
		return enumerable
	else
		error ("extend.add: Type not supported", enumerable)
		return None
	end
@end

@function remove enumerable, value
| Removes the given value from the list or map
	if isList (enumerable)
		var index = find(enumerable, value)
		if index >= 0
			enumerable splice (index, 1)
		end
		return enumerable
	elif isMap (enumerable)
		var k = keys (enumerable)
		for _ in k
			if _ == value
				@embed JavaScript
				|delete enumerable[_];
				@end
			end
		end
		return enumerable
	else
		return enumerable
	end
@end

@function removeAt enumerable, index
| Removes the element at the given index, returning the updated enumerable.
	if isList (enumerable)
		if index >= 0 and index < len (enumerable)
			enumerable splice (index, 1)
		end
		return enumerable
	elif isMap (enumerable)
		@embed JavaScript
		|delete enumerable[index];
		@end
		return enumerable
	else
		return enumerable
	end
@end

@function findLike enumerable, predicate
| Returns the index of the first element that matches the given predicate.
| Returns -1 if not found.
	# FIXME: This is not consistent
	var found = -1
	for v,k in enumerable
		if predicate(v) and (found == -1)
			# FIXME: Should break the iteration
			found = k
			break
		end
	end
	return found
@end

@function findOneOf enumerable, values
| Find one of the `values` in the given `enumerable`, returning
| the matching index.
	var r = -1
	for v, i in enumerable
		if v in values
			r = i
			break
		end
	end
	return r
@end

@function first enumerable, predicate
| Returns the first value that matches the given predicate
	var i = findLike(enumerable, predicate)
	if (i is None) or (not enumerable)
		return None
	else
		return enumerable[i]
	end
@end

@function last enumerable, predicate
| Returns the last value that matches the given predicate
	var res = None
	for v,k in enumerable
		if predicate(v)
			res = v
		end
	end
	return res
@end

@function replace container, original, replacement
	if isString(container)
		while container indexOf (original) != -1
			container = container replace (original, replacement)
		end
	else
		error("extend.replace only supports string for now")
	end
	return container
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
	if isObject(value) and isDefined(value length)
		var res = []
		if end is Undefined -> end = value length
		if start < 0 -> start = value length + start
		if end   < 0 -> end = value length + end
		var i = start
		while i < end
			res push (value [i])
		end
		return res
	else
		raise ("Unsupported type for slice:" + value)
	end
@end

@function equals a,b
	return a == b
@end

@function isIn value, list, predicate=equals
| Returns true if the given value is in the given list
	if isList (list)
		@embed JavaScript
		| if (list.some) {
		|   return list.some(function(v){return predicate(v,value)});
		| } else {
		|   for ( var i=0 ; i<list.length ; i++) {
		|     if (predicate(list[i],value)) { return true }
		|   }
		|   return false
		|}
		@end
	if isMap (list)
		@embed JavaScript
		| for ( var i in list ) {
		|   if (predicate(list[i],value)) { return true }
		| }
		| return false
		@end
	else
		return False
	end
@end

# =========================================================================
# SET OPERATIONS
# =========================================================================

@function difference a, b
| Returns the difference between a and b. Lists and maps are supported.
	if (not a) or len (a) == 0 -> return a
	if (not b) or len (b) == 0 -> return a
	if isList (a)
		if isMap (b)
			b = values (b)
		end
		if isList (b)
			return extend filter (a, {_|return not (_ in b)})
		else
			error ("extend.difference: Unsupported type for b, " + type(b))
			return None
		end
	elif isMap (a)
		if   isMap (b)
			var b_keys = extend keys (b)
			return extend filter (a, {_,k|return not (k in b_keys)})
		elif isList (b)
			return extend filter (a, {v|return not (v in b)})
		else
			error ("extend.difference: Unsupported type for b, " + type(b))
			return None
		end
	else
		error ("extend.difference: Unsupported type for a, " + type(a))
		return None
	end
@end

@function union a, b
| Returns the union of a and b. Lists and maps are supported.
	if (not a) or len (a) == 0 -> return b
	if (not b) or len (b) == 0 -> return a
	if isList (a)
		if isMap (b)
			b = values (b)
		end
		if isList (b)
			var r = [] concat (a)
			for e in b
				if not (e in a)
					r push (e)
				end
			end
			return r
		else
			error ("extend.union: Unsupported type for b, " + type(b))
		end
	elif isMap (a)
		a = extend copy (a)
		if   isMap (b)
			# NOTE: Should check wether the keys are the same, otherwise should
			# raise a union conflict or return items
			return extend merge (a, b)
		elif isList (b)
			b :: {v,i|
				if not isDefined (a[i])
					a[i] = v
				end
			}
			return a
		else
			error ("extend.union: Unsupported type for b, " + type(b))
			return None
		end
	else
		error ("extend.union: Unsupported type for a, " + type(a))
		return None
	end
@end

@function intersection a, b
| Returns the intersection between a and b. Lists and maps are supported.
	if (not a) or len(a) == 0
		return None
	elif isList (a)
		if isMap (b)
			return filter (a, {_,i|return isDefined (b[k])})
		else
			return filter (a, {_,i|return _ in b})
		end
	elif isMap (a)
		if isMap (b)
			return reduce (b, {r,v,k|if isDefined(a[k]) -> r[k] = v}, {})
		elif isList (b)
			return reduce (b, {r,k|var v=a[k];if isDefined(v) -> r[k] = v}, {})
		else
			error ("extend.intersection: Type for b not supported", type(b))
		end
	else
		return error ("NotImplemented")
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

@function type value
	return typeof(value)
@end

@function isDefined value
	return not (value is Undefined)
@end

@function isUndefined value
	return (value is Undefined)
@end

# FIXME: There should be a different between isList and isListLike/isIterable
@function isList value
	# NOTE: On older iOS Safari versions, Float64 is undefined, while
	# Float32 is.
	@embed JavaScript
	|if (typeof(Float64Array)!="undefined") {
	|return (
	|value instanceof Array        ||
	|value instanceof Float32Array ||
	|value instanceof Float64Array ||
	|value instanceof Int8Array    ||
	|value instanceof Int16Array   ||
	|value instanceof Int32Array
	|);
	|} else {
	|return (value instanceof Array);
	|}
	@end
@end

@function isNumber value
	return (not isNaN (value)) and (typeof (value) == "number")
@end

@function isString value
	return typeof (value) == "string"
@end

@function isMap value
	@embed JavaScript
	| return !!(!(value===null) && typeof value == "object" && !extend.isList(value))
	@end
@end

@function isIterable value
| The value needs to be an array or an object with
	@embed JavaScript
	| return extend.isList(value) || extend.isMap(value) || value && typeof (value.length) == "number";
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
		var is_instance = False
		@embed JavaScript
		|is_instance = value instanceof ofClass;
		@end
		return value and isDefined (value getClass) and value isInstance (ofClass) or is_instance
	else
		return value and isDefined (value getClass)
	end
@end

@function getType value
| Returns the type of the given value
	if not isDefined(value)
		return Type Undefined
	elif value is None
		return Type None
	elif isNumber(value)
		return Type Number
	elif isString(value)
		return Type String
	elif isList(value)
		return Type List
	elif isMap(value)
		return Type Map
	elif isFunction(value)
		return Type Function
	elif isObject(value)
		if isFunction(value getClass)
			return Type Instance
		else
			return Type Object
		end
	else
		return Type Unknown
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
			if isDefined (console log apply)
				console log apply (console, args)
			else
				console log (args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7])
			end
		if typeof(document) == "undefined" and typeof(pr_func) != "undefined"
			pr_func (res)
		end
	else
		PrintCallback (res)
	end
	return args
@end

@function warning message...
	if WarningCallback
		WarningCallback apply (extend, message)
	elif isDefined (console)
		if isDefined (console warn apply)
			console warn apply (console, message)
		else
			console warn (message[0], message[1], message[2], message[3], message[4], message[5], message[6], message[7])
		end
	else
		print apply (extend, ["[!] "] concat (message))
	end
	return message
@end

@function error message...
	if ErrorCallback
		ErrorCallback apply (extend, message)
	elif isDefined (console)
		if isDefined (console error apply)
			console error apply (console, message)
		else
			console error (message[0], message[1], message[2], message[3], message[4], message[5], message[6], message[7])
		end
	else
		print apply (extend, ["[!] "] concat (message))
	end
	return message
@end

@function debug message...
	if DebugCallback
		DebugCallback apply (extend, message)
	elif isDefined (console)
		console debug apply (console, message)
	else
		print apply (extend, ["[!] "] concat (message))
	end
	return message
@end

@function exception e, message...
	var m = []
	message :: {_|m push (_)}
	if len(m) == 0
		m push ("Extend: exception intercepted")
	end
	m push (e)
	if ExceptionCallback
		ExceptionCallback apply (extend, m)
	elif isDefined (console)
		if isDefined (console error apply)
			console error apply (console, m)
		else
			console error (m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7])
		end
	else
		print apply (extend, m)
	end
	return e
@end

@function assert predicate, message...
	if not predicate
		error apply (extend, message)
	end
	return message
@end

@function fail message...
	error apply (extend, message)
	return False
@end

@function sprintf
	@embed JavaScript
	|var str_repeat  = function(i, m){ for (var o = []; m > 0; o[--m] = i); return(o.join(''));};
	|var i = 0, a, f = arguments[i++], o = [], m, p, c, x;
	|while (f) {
	|  if (m = /^[^\x25]+/.exec(f)) o.push(m[0]);
	|  else if (m = /^\x25{2}/.exec(f)) o.push('%');
	|  else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
	|    if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) throw("Too few arguments.");
	|    if (/[^s]/.test(m[7]) && (typeof(a) != 'number'))
	|      throw("Expecting number but found " + typeof(a));
	|    switch (m[7]) {
	|      case 'b': a = a.toString(2); break;
	|      case 'c': a = String.fromCharCode(a); break;
	|      case 'd': a = parseInt(a); break;
	|      case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
	|      case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
	|      case 'o': a = a.toString(8); break;
	|      case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
	|      case 'u': a = Math.abs(a); break;
	|      case 'x': a = a.toString(16); break;
	|      case 'X': a = a.toString(16).toUpperCase(); break;
	|    }
	|    a = (/[def]/.test(m[7]) && m[2] && a > 0 ? '+' + a : a);
	|    c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
	|    x = m[5] - String(a).length;
	|    p = m[5] ? str_repeat(c, x) : '';
	|    o.push(m[4] ? a + p : p + a);
	|  }
	|  else {throw ("Huh ?!");}
	|  f = f.substring(m[0].length);
	|}
	|return o.join('');
	@end
@end

#EOF
