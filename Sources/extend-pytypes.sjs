@module extend

@function extendPrimitiveTypes
	# FIXME: This is incompatible with jQuery and all... shoule define specific types instead
	String prototype __len__ = {
		return target length
	}

	Array prototype extend = {array|
		array :: {e|target append (e)}
	}

	Array prototype append = {e|
		target push (e)
	}

	Array prototype insert = {e,i|
		target splice (i,e)
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
		var result = []
		@embed JavaScript
		|for (var k in this) { var key=k ; result.push(key) }
		@end
		return result
	}

	Object prototype items = {
		var result = []
		@embed JavaScript
		|for (var k in this) { var key=k ; result.push([key,this[key]]) }
		@end
		return result
	}

	Object prototype values = {
		var result = []
		@embed JavaScript
		|for (var k in this) { var key=k ; result.push([key,this[key]]) }
		@end
		return result
	}

	Object prototype hasKey = {key|
		return typeof(this[key]) != "undefined"
	}

	Object prototype get = {key|
		return target[key]
	}

	Object prototype set = {key,value|
		target[key] = value
		return this
	}

	Object prototype setDefault = {key,value|
		if typeof(target[key]) != "undefined"
			return  target[key]
		else
			target[key] = value
			return value
		end
	}

	Object prototype __iter__ = {
	}

	Object prototype __len__ = {
		return target keys () length
	}
@end

# EOF
