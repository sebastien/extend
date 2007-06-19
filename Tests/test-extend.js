// Extend 2.0 test suite (18-Jun-2007)
// -----------------------------------

/*
Things you cannot do in JavaScript
 - Easily access a class variable from an instance
 - Things get really dirty for methods/attributes/inits with inheritance
   (super)
*/

// TEST SETUP ________________________________________________________________
// TODO: Convert to Sugar
Testing.OnTestStart = function(testId, testName) {
	var test_row = html.tr(
		{"id":"test_" + testId, "class":"test testRunning"},
		html.td({"class":"testID"},"#" + testId),
		html.td({"class":"testName"},"" + testName,
		html.div(html.ul({"class":"assertions empty"}))),
		html.td({"class":"testTime"},"running...")
	)
	$("#result").append(test_row)
}
Testing.OnTestEnd   = function(testId, test) {
	var test_row = $("#test_" + testId)
	$(test_row).removeClass("testRunning");
	if ( test.status == "S" ) {
		$(test_row).addClass("testSucceeded");
	} else {
		$(test_row).addClass("testFailed");
	}
	$(".testTime", test_row).html(test.run + "ms")
}

Testing.OnFailure = function( testId, num, reason ) {
	$("#test_" + testId +" .assertions").removeClass("empty")
	$("#test_" + testId +" .assertions").append(html.li({"class":"assertion assertionFailed"},"Assertion #" + num + " failed: " + reason))
}
// END SETUP

// TEST 0
Testing.test("JavaScript Inheritance Basics")
	// SETUP
	var A = function(){this.isClass=function(){return false}}
	var A_proto={
		isClass:function(){return true},
		hello:function(){return "Hello"}
	}
	A.prototype=A_proto
	A_proto.isClass=function(){return true}
	//A.hello=function(){return "Hello"}
	var a = new A()
	// TEST
	Testing.asTrue(A_proto.isClass())
	Testing.asFalse(a.isClass())
	Testing.value(A_proto.hello(),"Hello")
	Testing.value(a.hello(),"Hello")
	// Now, this is the fun part: when doing a 'new A()', there is no link
	// between A (or A_proto) and 'a'. When invoking new, it seems like the
	// given object is actually cloned.
	Testing.unlike(a,A_proto)
	Testing.unlike(a,A)
	Testing.unlike(a.prototype,A_proto)
	Testing.unlike(a.prototype,A)
	// But strangely, we can add 'otherHello' to "A_proto", and automatically,
	// 'a' will benefit from it.
	A_proto.otherHello=function(){return "Pouet"}
	Testing.value(A_proto.otherHello(),"Pouet")
	Testing.value(a.otherHello(),"Pouet")
	// And we can check that if we modify the 'class', the instance won't be
	// updated
	A.pouet = function(){return "Pouet"}
	Testing.value(A.pouet(),"Pouet")
	Testing.asUndefined(a.pouet)
	// But it will if we modify the prototype
	A.prototype.pouet = A.pouet
	Testing.asDefined(a.pouet)
	Testing.asDefined(a.pouet(),"Pouet")
Testing.end()

// ===========================================================================
// SINGLE CLASS TESTING
// ===========================================================================

// TEST 1
Testing.test("C: Single class declaration: A=Extend.create(...)")
	// SETUP
	var ClassA = Extend.create({
		init:function(){
			this._id=this.getClass().Count++
			console.log("CLASS " + this.getClass().getName())
			console.log("Count " + this.getClass().Count)
		},
		methods:{
			basehello:function(){
				return "Hello:" + this._id
			},
			thishello:function(){
				return this.hello()
			},
			hello:function(){
				return "Hello:" + this._id
			}
		},
		operations:{
			otherHello:function(){return "OtherHello"},
			getCount:function(){return this.Count}
		},
		attributes:{Count:0},
		name:"ClassA"
	})
	// TEST
	Testing.value(ClassA.getName(), "ClassA")
	Testing.asUndefined(ClassA.getParent()) 
	Testing.value(ClassA.isClass(), true) 
Testing.end()

// TEST 2
Testing.test("C: Class attribute access: A.V")
	Testing.value(ClassA.Count, 0) 
Testing.end()

// TEST 3
Testing.test("C: Class operation: A.operation(...)")
	Testing.value(ClassA.otherHello(), "OtherHello") 
	Testing.value(ClassA.getCount(), ClassA.Count)
Testing.end()

// TEST 4
Testing.test("C: Class instanciation: var a = new A()")
	var new_a = new ClassA()
	Testing.value(new_a.getClass(), ClassA) 
	Testing.value(new_a.isClass(), false) 
Testing.end()

// TEST 5
Testing.test("C: Instance attribute: a.v")
	Testing.value(new_a._id,0) 
Testing.end()

// TEST 6
Testing.test("C: Class attribute from instance: a.getClass().V")
	Testing.value(ClassA.Count,1) 
	Testing.value(new_a.getClass().Count,1) 
Testing.end()

// TEST 7
Testing.test("C: Instance method: a.method()")
	Testing.value(new_a._id,0) 
	Testing.value(new_a.hello(),"Hello:0") 
	Testing.value(new_a.basehello(),"Hello:0") 
	Testing.value(new_a.thishello(),"Hello:0") 
Testing.end()

// ===========================================================================
// SUBCLASS TESTING
// ===========================================================================

// TEST 8
Testing.test("SC: Subclass declaration: var B=Extend.create({parent:...})")
	// SETUP
	var ClassB = Extend.create({
		name:"ClassB",
		parent:ClassA,
		methods:{
			hello:function(){return "From B:" + this._id}
		}
	})
	Testing.value(ClassB.getName(), "ClassB")
	Testing.value(ClassB.getParent(), ClassA) 
	Testing.value(ClassB.isClass(), true) 
Testing.end()

// TEST 9
Testing.test("SC: Inhertied class attribute access: B.V ")
	Testing.value(ClassA.Count, 1) 
	Testing.value(ClassB.Count, 0) 
Testing.end()

// TEST 10
Testing.test("SC: Inherited class operation: B.operation(...)")
	Testing.value(ClassB.otherHello(), "OtherHello") 
	Testing.value(ClassB.getCount(), 0)
Testing.end()

// TEST 11
Testing.test("SC: Subclass instanciation: var b = new B()")
	var new_b = new ClassB()
	Testing.value(new_b.isClass(), false) 
	Testing.value(new_b.getClass(), ClassB) 
Testing.end()

// TEST 11
Testing.test("SC: Subclass instance attribute: b.v")
	Testing.value(new_b._id,0) 
Testing.end()

// TEST 12
Testing.test("SC: Class attribute from instance: a.getClass().V")
	Testing.value(ClassB.Count,1) 
	Testing.value(new_b.getClass().Count,1) 
Testing.end()

// TEST 12
Testing.test("SC: Instance method: a.method()")
	Testing.value(new_b.hello(),"From B:0") 

// TEST 13
Testing.test("SC: Inherited method: a.inheritedmethod()")
	Testing.value(new_b.thishello(),"From B:0") 
	Testing.value(new_b.basehello(),"Hello:0") 
	new_b._id=10
	Testing.value(new_b.thishello(),"From B:10") 
	Testing.value(new_b.basehello(),"Hello:10") 
Testing.end()

// ===========================================================================
// SUB/SUB/CLASS TESTING
// ===========================================================================

// TEST 13
Testing.test("SSC: Sub-subclass declaration: var C=Extend.create({parent:B,...})")
	// SETUP
	var ClassC = Extend.create({
		name:"ClassC",
		parent:ClassB,
		methods:{
			hello:function(){return "From C:" + this._id}
		}
	})
	Testing.value(ClassC.getName(), "ClassC")
	Testing.value(ClassC.getParent(), ClassB) 
	Testing.value(ClassC.isClass(), true) 
Testing.end()

// ===========================================================================
// INTROSPECTION
// ===========================================================================

// isInstance
// getMethod

/*
var ClassC = Class.create({
	CLASSDEF:{
		name:  "ClassC",
		parent: ClassB
	},
	hello: function() {
		return ClassC.parentClass.method("hello").call(this) + ", again !"
	}
})

var a = new ClassA()
var b = new ClassB()
var c = new ClassC()

var test = function( test, expected ) {
	var result = eval(test)
	var li   = document.createElement("li")
	if ( result == expected ) {
		var text = document.createTextNode("" + test + " == " + result)
		li.appendChild(text)
		document.getElementById("succeeded").appendChild(li)
	}
	else {
		var text = document.createTextNode("" + test + ":" + expected + " != " + result)
		li.appendChild(text)
		document.getElementById("failed").appendChild(li)
	}
}

test("ClassA.className", "ClassA")
test("ClassB.className", "ClassB")
test("ClassC.className", "ClassC")
test("a.getClass()", ClassA)
test("b.getClass()", ClassB)
test("c.getClass()", ClassC)

test("a.hello()", "Hello (0)")
test("b.hello()", "Hello (1), world")
test("c.hello()", "Hello (2), world, again !")

ClassA.method("newHello", function() { return "New hello" })
test("a.newHello()",'New hello')
test("b.newHello()",'New hello')
test("c.newHello()",'New hello')

test("ClassA.inherited.newHello",undefined)
test("ClassB.inherited.newHello",ClassA)
test("ClassC.inherited.newHello",ClassA)

ClassB.method("newHello", function() { return "Other hello" })

test("ClassA.inherited.newHello",undefined)
test("ClassB.inherited.newHello",undefined)
test("ClassC.inherited.newHello",ClassB)

test("a.newHello()",'New hello')
test("b.newHello()",'Other hello')
test("c.newHello()",'Other hello')
test("b.parentCall('newHello')",'New hello')
test("c.parentCall('newHello')",'Other hello')

test("a.newHello()",'New hello')
test("b.newHello()",'Other hello')
test("c.newHello()",'Other hello')

var ClassD = Class.create({
	CLASSDEF:{
		name:  "ClassD"
	},
	newHello: function() {
		return "Completely different hello !"
	}
})

ClassB.reparent(ClassD)
ClassB.method("newHello", Extend.DELETE)

test("ClassB.parentClass.className",ClassD.className)
test("ClassC.parentClass.className",ClassB.className)
test("ClassC.parentClass.parentClass.className",ClassD.className)

test("b.getClass().className",    ClassB.className)
test("b.parentClass().className", ClassD.className)

test("c.getClass().className",    ClassC.className)
test("c.parentClass().className", ClassB.className)

test("a.newHello()",'New hello')
test("b.newHello()",'Completely different hello !')
test("c.newHello()",'Completely different hello !')
*/
