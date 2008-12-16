@module extend

@shared Registry = {}

@function getClass name
	return Registry [name]
@end

@function getParentClass object
	return Registry [name]
@end

@function getClasses
	return Registry
@end

@function getMethod name, object
@end


@function getSuperMethod name, object
@end

@function getSuperMethod name, object
@end


@function getChildrenOf aClass:Class
	var res = {}
	@embed JavaScript
	|var values = extend.getClasses()
	|for ( key in values ) {
	|	if ( values[key] != aClass && values[key].isSubclassOf(aClass) )
	|	{ res[key] = values[key] }
	|}
	@end
	return res
@end

@function invoke t, f, args, extra
| The 'invoke' method allows advanced invocation (supporting by name, as list
| and as map invocation schemes) provided the given function 'f' has proper
| '__meta__' annotation.
|
| These annotations are expected to be like:
|
| >    f __meta__ = {
| >        arity:2
| >        arguments:{
| >           b:2,
| >           "*":[1]
| >           "**":{c:3,d:4}
| >        }
| >    }
|
	# TODO: Add consistency checks for invocation
	var meta = f ['__meta__']
	var actual_args = [] 
	extra ["*"]  :: {v   | args push(v) }
	extra ["**"] :: {v,k | extra[k] = v }
	args :: {v|actual_args push(args)}
	var start = args length
	while start < meta arity
		var arg = meta arguments [start]
		actual_args push (extra[arg name])
		start += 1
	end
	# print ("CALLING ", f toSource())
	# print (" with", actual_args toSource())
	return f apply (t, actual_args)
@end
