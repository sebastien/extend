@module extend

@function merge value, otherValue
	if isList(value)
		assert (isList(otherValue), "extend.merge(a,b) b expected to be a list")
		for v in otherValue
			if find (value, v) == -1
				value push (v)
			end
		end
	if isMap(value)
		assert (isMap(otherValue),   "extend.merge(a,b) b expected to be a map")
		for v,k in otherValue
			if value[k] == Undefined
				value[k] = v
			end
		end
	else
		error ("extend.merge(a,_) expects a to be a list or a map")
	end
	return value
@end

@function car list
	if list length > 0
		return list[0]
	else
		return None
	end
@end

@function cdr list
	if list length == 0
		return None
	if list length == 1
		return []
	else
		return list[1:]
	end
@end

@function map iterable, callback
	var result = []
	for e,k in iterable
		result push (callback (e,k))
	end
	return result
@end

@function filter iterable, callback
	var result = []
	for e,k in iterable
		if callback (e,k)
			result push (e)
		end
	end
	return result
@end

@function reduce iterable, callback
	var res = Undefined
	var i   = 0
	iterable :: {e,k|
		if i == 0
			res = e
		else
			res = callback(res, e, k)
		end
		i += 1
	}
	return res
@end

@function foldl iterable, seed, callback
	var first  = True
	var result = seed
	iterable :: {e,k| result = callback (result, e,k) }
	return result
@end

# EOF
