@function f args...
	console log (args)
@end

@function g args..
	f (...args)
@end
