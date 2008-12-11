@class A

	@method foo
		return bar ()
	@end

	@method bar
		return "A.bar()"
	@end
@end

@class B: A

	@method superFoo
		return super foo ()
	@end

	@method foo
		return "B:"+self bar()
	@end

	@method bar
		return "B.bar()"
	@end

@end

a = new A()
b = new B()
print ("A->", a foo())
print ("B->", b foo())
print ("C->", b superFoo())
