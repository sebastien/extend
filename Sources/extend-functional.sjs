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

# EOF
