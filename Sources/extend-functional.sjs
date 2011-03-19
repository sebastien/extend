@module extend

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

@function cons list
@end

@function map callback, iterable
	var result = []
	for e in iterable
		result push (callback (e))
	end
	return result
@end

@function filter callback, iterable
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

@function foldl seed, iterable, callback
	var first  = True
	var result = seed
	iterable :: {e| result = callback (result, e) }
	return result
@end

# EOF
