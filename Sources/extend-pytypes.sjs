@module extend

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


String __len__ = {
	return target length
}

Array extend = {array|
}

Array append = {
}

Array insert = {
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
}

Object items = {
}

Object values = {
}

Object hasKey = {key|
}

Object get = {key|
}

Object set = {key,value|
}

Object setDefault = {key,value|
}

Object __iter__ = {
}

Object __len__ = {
}

# EOF
