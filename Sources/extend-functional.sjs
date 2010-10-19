@module extend

@function car list
@end

@function cdr list
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

@function foldl seed, iterable, callback
	var first  = True
	var result = seed
	iterable :: {e| result = callback (result, e) }
	return result
@end

# EOF
