@module extend.python

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

@function map callback, iterable
@end

@function filter callback, iterable
@end

@function reduce callback, iterable
@end


String prototype __len__ = {
	return target length
}

Array prototype extend = {
}

Array prototype append = {
}

Array prototype insert = {
}

Array prototype slice = {
}

Array prototype __iter__ = {
	return target length
}

Array prototype __len__ = {
	return target length
}

Object prototype keys = {
}

Object prototype items = {
}

Object prototype values = {
}

Object prototype hasKey = {key|
}

Object prototype get = {key|
}

Object prototype set = {key,value|
}

Object prototype setDefault = {key,value|
}

Object prototype __iter__ = {
}

Object prototype __len__ = {
}

# EOF
