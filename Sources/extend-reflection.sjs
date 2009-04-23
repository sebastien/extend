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


@function getChildrenOf aClass
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


