@module extend
@version 2.3.28
@import flash.utils.getDefinitionByName
@import flash.utils.getQualifiedSuperclassName
@import flash.external.ExternalInterface

@shared ErrorCallback
@shared DebugCallback
@shared PrintCallback

@shared Nothing       = new Object()
@shared Timeout       = new Object()
@shared Error         = new Object()
@shared FLOW_CONTINUE = new Object()
@shared FLOW_BREAK    = new Object()
@shared FLOW_RETURN   = new Object()

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
	return "" + v
@end


@function range:List start:Number, end:Number, step:Number=1
| Creates a new list composed of elements in the given range, determined by
| the 'start' index and the 'end' index. This function will automatically
| find the proper step (wether '+1' or '-1') depending on the bounds you
| specify.
	# TODO: Create a big array (1...100) and use subsets instead
	var result = []
	@embed JavaScript
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
	if isList(value)
		return value length
	if isObject(value)
		if value length
			return value length
		if value __len__
			return value __len__ ()
		else
			var c = 0
			@embed JavaScript
			|for (var _ in value) {c += 1};
			@end
			return c
		end
	else
		return None
	end
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
	|  // We use foreach if it's available
	|  if ( value.forEach ) {
	|       try {result=value.forEach(callback)} catch (e) {
	|           if      ( e === extend.FLOW_CONTINUE ) {}
	|           else if ( e === extend.FLOW_BREAK    ) {return}
	|           else if ( e === extend.FLOW_RETURN   ) {return}
	|           else    {throw e}
	|       }
	|  } else if ( value.length != undefined ) {
	|    var length = undefined;
	|    // Is it an object with the length() and get() protocol ?
	|    if ( typeof(value.length) == "function" && typeof(value.get) == "function" ) {
	|      length = value.length()
	|      for ( var i=0 ; i<length ; i++ ) {
	|          var result = undefined;
	|          try {result=callback.call(context, value.get(i), i);} catch (e) {
	|              if      ( e === extend.FLOW_CONTINUE ) {}
	|              else if ( e === extend.FLOW_BREAK    ) {return}
	|              else if ( e === extend.FLOW_RETURN   ) {return}
	|              else    {throw e}
	|          }
	|          if (!(result===undefined)) {return result}
	|      }
	|    // Or a plain array ?
	|    } else {
	|      length = value.length;
	|      for ( var i=0 ; i<length ; i++ ) {
	|          var result = undefined;
	|          try {result=callback.call(context, value[i], i);} catch (e) {
	|              if      ( e === extend.FLOW_CONTINUE ) {}
	|              else if ( e === extend.FLOW_BREAK    ) {return}
	|              else if ( e === extend.FLOW_RETURN   ) {return}
	|              else    {throw e}
	|          }
	|          if (!(result===undefined)) {return result}
	|      }
	|    }
	|  } else {
	|    for ( var k in value ) {
	|       var result = undefined;
	|       try {result=callback.call(context, value[k], k);} catch (e) {
	|          if      ( e === extend.FLOW_CONTINUE ) {}
	|          else if ( e === extend.FLOW_BREAK    ) {return}
	|          else if ( e === extend.FLOW_RETURN   ) {return}
	|          else    {throw e}
	|       }
	|       if (!(result===undefined)) {return result}
	|    }
	|  }
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
			raise new Exception("extend.access:Type not supported:" + value)
		end
	end
@end

# =========================================================================
# MAP AND ARRAY OPERATIONS
# =========================================================================

@function keys value
	if extend isString(value) or extend isNumber(value)
		return None
	else
		var res = []
		# FIXME: Use map?
		@embed JavaScript
		|for(var k in value) { res.push(k); }
		@end
		return res
	end
@end

@function values value
	if extend isString(value) or extend isNumber(value)
		return None
	else
		var res = []
		# FIXME: Use map?
		@embed JavaScript
		|for(var k in value) { res.push(value[k]); }
		@end
		return res
	end
@end

@function items value
	if extend isString(value) or extend isNumber(value)
		return None
	else
		var res = []
		# FIXME: Use map?
		@embed JavaScript
		|for (var k in value) { res.push({key:k,value:value[k]}); }
		@end
		return res
	end
@end

@function sorted value, reverse=False
	if extend isList   (value)
		value = copy (value)
		value sort ()
		return value
	else
		raise new Exception("Not implemented")
	end
@end

@function copy value
	if extend isList   (value)
		return [] concat (value)
	if extend isObject (value)
		var r = {}
		@embed JavaScript
		|for (var k in value) {r[k]=value[k]}
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
	else
		error ("extend.merge(a,_) expects a to be a list or a map")
	end
	return value
@end

# =========================================================================
# ARRAY OPERATIONS
# =========================================================================

@function find enumerable, value
	var res   = []
	var found = -1
	for v,k in enumerable
		if (v == value) and (found == -1)
			found = k
			break
		end
	end
	return found
@end

@function findLike enumerable, predicate
	var res   = []
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

@function first enumerable, predicate
| Returns the first value that matches the given predicate
	var i = findLike(enumerable, predicate)
	if i >=0 
		return enumerable[i]
	else
		return None
	end 
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

# FIXME: There should be a different between isList and isListLike/isIterable
@function isList value
	@embed JavaScript
	|return value instanceof Array
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

@function isIterable value
| The value needs to be an array or an object with
	@embed JavaScript
	| return extend.isList(value) || value && typeof (value.length) == "number";
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
		return isDefined (value getClass) and value isInstance (ofClass) or is_instance
	else
		return isDefined (value getClass)
	end
@end

@function getType value
| Returns the type of the given value
	if not isDefined(value)
		return "undefined"
	if value is None
		return "none"
	if isNumber(value)
		return "number"
	if isString(value)
		return "string"
	if isList(value)
		return "list"
	if isMap(value)
		return "map"
	if isFunction(value)
		return "function"
	if isObject(value)
		if isFunction(value getClass)
			return "instance"
		else
			return "object"
		end
	else
		return "unknown"
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
