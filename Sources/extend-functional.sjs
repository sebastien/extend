@module extend

@function str v
	return "" + v
@end

@function len v
    if isList(v)
        return v length
    if isMap(v)
        var c = 0
        v :: {c += 1}
        return c
    else
        return Undefined
    end
@end

@function find enumerable, value
	var res   = []
	var found = Undefined
	for v,k in enumerable
		if (v == value) and (found == Undefined)
			# FIXME: Should break the iteration
			found = k
		end
	end
	return found
@end

@function keys enumerable
	var res = []
	for v,k in enumerable
		res push [k]
	end
	return res
@end

@function values enumerable
	var res = []
	for v,k in enumerable
		res push [v]
	end
	return res
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
	for e in iterable
		result push (callback (e))
	end
	return result
@end

@function filter iterable, callback
	var result = []
	for e in iterable
		if callback (e)
			result push (e)
		end
	end
	return result
@end

@function reduce iterable, callback
	var res = Undefined
	var i   = 0
	iterable :: {e|
		if i == 0
			res = e
		else
			res = callback(res, e)
		end
		i += 1
	}
	return res
@end

@function foldl iterable, seed, callback
	var first  = True
	var result = seed
	iterable :: {e| result = callback (result, e) }
	return result
@end

# EOF
