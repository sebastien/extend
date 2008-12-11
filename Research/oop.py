class A(object):

	def foo(self):
		return self.bar()

	def bar(self):
		return "A.bar()"

class B(A):

	def superFoo(self):
		return super(B,self).foo()

	def foo(self):
		return "B:"+self.bar()

	def bar(self):
		return "B.bar()"

a = A()
b = B()
print "A->",a.foo()
print "B->", b.foo()
print "C->",b.superFoo()
