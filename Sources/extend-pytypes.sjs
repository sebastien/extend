@module extend

@function map callback, iterable
	var result = []
	for e in iterable
		result append (callback (e))
	end
	return result
@end

@function filter callback, iterable
	var result = []
	for e in iterable
		if callback 'e
			result append 'e
		end
	end
	return result
@end

@function reduce callback, iterable
	var first  = True
	var result = Undefined
	for e in iterable
		if first
			result = callback(e)
			first  = False
		else
			result = callback(e, result)
		end
	end
	return result
@end


String __len__ = {
	return target length
}

Array extend = {array|
	array :: {e|target append (e)}
}

Array append = {e|
	target push (e)
}

Array insert = {e,i|
	target splice (i,e)
}

Array slice = {
}

Array __iter__ = {
	return target length
}

Array __len__ = {
	return target length
}

Object keys = {
	var result = []
	@embed JavaScript
	|for (var k in this) { var key=k ; result.push(key) }
	@end
	return result
}

Object items = {
	var result = []
	@embed JavaScript
	|for (var k in this) { var key=k ; result.push([key,this[key]]) }
	@end
	return result
}

Object values = {
	var result = []
	@embed JavaScript
	|for (var k in this) { var key=k ; result.push([key,this[key]]) }
	@end
	return result
}

Object hasKey = {key|
	return typeof(this[key]) != "undefined"
}

Object get = {key|
	return target[key]
}

Object set = {key,value|
	target[key] = value
	return this
}

Object setDefault = {key,value|
	if typeof(target[key]) != "undefined"
		return  target[key]
	else
		target[key] = value
		return value
	end
}

Object __iter__ = {
}

Object __len__ = {
	return target keys () length
}

# EOF
