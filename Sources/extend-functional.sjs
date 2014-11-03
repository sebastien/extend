@module extend

# TODO: asMap
# TODO: asList
# TODO: unique

@function strip value
	# TODO: Implement strip for arrays and objects
	@embed JavaScript
	|return value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	@end
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

@function asMap iterable, extractor, replacer=Undefined
| Converts the given iterable where the key is extracted by the given
| `extractor`. If `replacer` is defined and there is already an element
| with the given key, then `replacer` will be called.
	var res = {}
	for value, key in iterable
		key = extractor (value, key)
		if isDefined (res[key]) and isDefined (replacer)
			res[key] = replacer (value, res[key], key)
		else
			res[key] = value
		end
	end
	return res
@end


@function map iterable, callback
	var result = None
	if extend isList(iterable)
		if iterable map
			result = iterable map (callback)
		else
			result = []
			for e,k in iterable
				result push (callback (e,k))
			end
		end
	elif extend isMap (iterable)
		result = {}
		for e,k in iterable
			result[k] = callback (e,k)
		end
	elif extend isIterable (iterable)
		result = []
		for e,k in iterable
			result push (callback (e,k))
		end
	else
		result = {}
		for e,k in iterable
			result[k] = (callback (e,k))
		end
	end
	return result
@end

@function filter iterable, callback
	var result = None
	if extend isList (iterable)
		if iterable filter
			result = iterable filter (callback)
		else
			result = []
			for e,k in iterable
				if callback (e,k)
					result push (e)
				end
			end
		end
	elif extend isMap (iterable)
		result = {}
		for e,k in iterable
			if callback (e, k)
				result[k] = e
			end
		end
	elif extend isIterable (iterable)
		result = []
		for e,k in iterable
			if callback (e,k)
				result push (e)
			end
		end
	else
		result = {}
		for e,k in iterable
			if callback (e,k)
				result[k] = e
			end
		end
	end
	return result
@end

@function reduce iterable, callback, initial=Undefined
	# FIXME: Use reduce function if available
	var res = initial
	var i   = 0
	iterable :: {e,k|
		var r = Undefined
		if i == 0 and (not isDefined (res))
			r = e
		else
			r = callback(res, e, k, i)
		end
		if isDefined (r) -> res = r
		i += 1
	}
	return res
@end

@function foldl iterable, seed, callback
| An alias to reduce, with different parameter ordering. Preserved for
| compatibility.
	return extend reduce (iterable, callback, seed)
@end

# EOF
