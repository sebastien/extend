// extend 2.0 test suite (12-Oct-2007)
// -----------------------------------

/*
Things you cannot do in JavaScript
 - Easily access a class variable from an instance
 - Things get really dirty for methods/attributes/inits with inheritance
   (super)
*/



// ===========================================================================
// SINGLE CLASS TESTING
// ===========================================================================

// TEST 1
testing.test("C: Single class declaration: A=extend.Class(...)")
	// SETUP
	var ClassA = extend.Class({
		initialize:function(){
			this._id=this.getClass().Count++
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
			getCount:function(){
				return this.Count
			}
		},
		shared:{Count:0},
		name:"ClassA"
	})
	// TEST
	testing.value(ClassA.getName(), "ClassA")
	testing.asUndefined(ClassA.getParent()) 
	testing.value(ClassA.isClass(), true) 
testing.end()

// TEST 2
testing.test("C: Class attribute access: A.V")
	testing.value(ClassA.Count, 0) 
testing.end()

// TEST 3
testing.test("C: Class operation: A.operation(...)")
	testing.value(ClassA.otherHello(), "OtherHello") 
	testing.value(ClassA.getCount(), ClassA.Count)
testing.end()

// TEST 4
testing.test("C: Class instanciation: var a = new A()")
	var new_a = new ClassA()
	testing.value(new_a.getClass(), ClassA) 
	testing.value(new_a.isClass(), false) 
testing.end()

// TEST 5
testing.test("C: Instance attribute: a.v")
	testing.value(new_a._id,0) 
testing.end()

// TEST 6
testing.test("C: Class attribute from instance: a.getClass().V")
	testing.value(ClassA.Count,1) 
	testing.value(new_a.getClass().Count,1)
testing.end()

// TEST 7
testing.test("C: Instance method: a.method()")
	testing.value(new_a._id,0) 
	testing.value(new_a.hello(),"Hello:0")
	testing.value(new_a.basehello(),"Hello:0")
	testing.value(new_a.thishello(),"Hello:0")
testing.end()

// TEST 7a
testing.test("C: Operation access from instance: a.Operation()")
	testing.asDefined(new_a.otherHello)
	testing.asDefined(new_a.getCount)
	testing.value(new_a.otherHello(), "OtherHello")
	testing.value(new_a.getCount(),   1)
testing.end()

// ===========================================================================
// SUBCLASS TESTING
// ===========================================================================

// TEST 8
testing.test("SC: Subclass declaration: var B=extend.Class({parent:...})")
	// SETUP
	var ClassB = extend.Class({
		name:"ClassB",
		parent:ClassA,
		methods:{
			hello:function(){return "From B:" + this._id}
		}
	})
	testing.value(ClassB.getName(), "ClassB")
	testing.value(ClassB.getParent(), ClassA) 
	testing.value(ClassB.isClass(), true) 
testing.end()

// TEST 9
testing.test("SC: Inhertied class attribute access: B.V ")
	testing.value(ClassA.Count, 1) 
	testing.value(ClassB.Count, 0) 
testing.end()

// TEST 10
testing.test("SC: Inherited class operation: B.operation(...)")
	testing.value(ClassB.otherHello(), "OtherHello") 
	testing.value(ClassB.getCount(), 0)
testing.end()

// TEST 11
testing.test("SC: Subclass instanciation: var b = new B()")
	var new_b = new ClassB()
	testing.value(new_b.isClass(), false) 
	testing.value(new_b.getClass(), ClassB) 
testing.end()

// TEST 12
testing.test("SC: Subclass instance attribute: b.v")
	testing.value(new_b._id,0) 
testing.end()

// TEST 13
testing.test("SC: Class attribute from instance: b.getClass().V")
	testing.value(ClassB.Count,1) 
	testing.value(new_b.getClass().Count,1) 
testing.end()

// TEST 14
testing.test("SC: Instance method: b.method()")
	testing.value(new_b.hello(),"From B:0") 

// TEST 15
testing.test("SC: Inherited method: b.inheritedmethod()")
	testing.value(new_b.thishello(),"From B:0") 
	testing.value(new_b.basehello(),"Hello:0") 
	new_b._id=10
	testing.value(new_b.thishello(),"From B:10") 
	testing.value(new_b.basehello(),"Hello:10") 
testing.end()

// ===========================================================================
// SUB/SUB/CLASS TESTING
// ===========================================================================

// TEST 16
testing.test("SSC: Sub-subclass declaration: var C=extend.Class({parent:B,...})")
	// SETUP
	var ClassC = extend.Class({
		name:"ClassC",
		parent:ClassB,
		methods:{
			hello:function(){return "From C:" + this._id}
		}
	})
	testing.value(ClassC.getName(), "ClassC")
	testing.value(ClassC.getParent(), ClassB) 
	testing.value(ClassC.getParent().getParent(), ClassA) 
	testing.value(ClassC.isClass(), true) 
testing.end()

// TEST 17
testing.test("SSC: Inhertied class attribute access: C.V ")
	testing.value(ClassA.Count, 1) 
	testing.value(ClassB.Count, 1) 
	testing.value(ClassC.Count, 0) 
testing.end()

// TEST 18
testing.test("SSC: Inherited class operation: C.operation(...)")
	testing.value(ClassC.otherHello(), "OtherHello") 
	testing.value(ClassC.getCount(), 0)
testing.end()

// TEST 19
testing.test("SSC: Subclass instanciation: var c = new C()")
	var new_c = new ClassC()
	testing.value(new_c.isClass(), false) 
	testing.value(new_c.getClass(), ClassC) 
testing.end()

// TEST 20
testing.test("SSC: Subclass instance attribute: c.v")
	testing.value(new_c._id,0) 
testing.end()

// TEST 21
testing.test("SSC: Class attribute from instance: c.getClass().V")
	testing.value(ClassC.Count,1) 
	testing.value(new_c.getClass().Count,1) 
testing.end()

// TEST 22
testing.test("SSC: Instance method: c.method()")
	testing.value(new_c.hello(),"From C:0") 

// TEST 23
testing.test("SSC: Inherited method: c.inheritedmethod()")
	testing.value(new_c.thishello(),"From C:0") 
	testing.value(new_c.basehello(),"Hello:0") 
	new_c._id=11
	testing.value(new_c.thishello(),"From C:11") 
	testing.value(new_c.basehello(),"Hello:11") 
testing.end()

// ===========================================================================
// SUPER KEYWORD
// ===========================================================================

// TEST 24
testing.test("S: Super methods: this.SuperClass_method()")
	var ClassSA = extend.Class({
		name:"ClassSA",
		initialize:function(){this.a="a"},
		methods:{doThis:function(){return "doThis:SA:" + this.a}}
	})
	var ClassSB = extend.Class({
		name:"ClassSB",
		parent:ClassSA,
		initialize:function(){this.a="b"},
		methods:{doThis:function(){return this.ClassSA_doThis() + ":SB"}}
	})
	var ClassSC = extend.Class({
		name:"ClassSC",
		parent:ClassSB,
		initialize:function(){this.a="c"},
		methods:{
			doThis:function(){return this.ClassSB_doThis() + ":SC"},
			doThat:function(){return this.ClassSA_doThis() + ":SC"}
		}
	})
	var new_sa = new ClassSA()
	var new_sb = new ClassSB()
	var new_sc = new ClassSC()
	testing.value(new_sa.doThis(), "doThis:SA:a")
	testing.value(new_sb.doThis(), "doThis:SA:b:SB")
	testing.value(new_sc.doThis(), "doThis:SA:c:SB:SC")
	testing.value(new_sc.doThat(), "doThis:SA:c:SC")
testing.end()

// TEST 25
testing.test("S: Super constructor: this.SuperClass_initialize()")
	var ClassSA = extend.Class({
		name:"ClassSA",
		initialize:function(){this.a="a"}
	})
	var ClassSB = extend.Class({
		name:"ClassSB",
		parent:ClassSA,
		initialize:function(){
			this.ClassSA_initialize();
			this.b="b"
		}
	})
	var ClassSC = extend.Class({
		name:"ClassSC",
		parent:ClassSB,
		initialize:function(){
			this.ClassSB_initialize()
			this.c="c"
		},
		methods:{
			doThis:function(){return this.ClassSB_doThis() + ":SC"},
			doThat:function(){return this.ClassSA_doThis() + ":SC"}
		}
	})
	var new_sa = new ClassSA()
	var new_sb = new ClassSB()
	var new_sc = new ClassSC()
	testing.value(new_sa.a, "a")
	testing.asUndefined(new_sa.b)
	testing.asUndefined(new_sa.c)
	testing.value(new_sb.a, "a")
	testing.value(new_sb.b, "b")
	testing.asUndefined(new_sb.c)
	testing.value(new_sc.a, "a")
	testing.value(new_sc.b, "b")
	testing.value(new_sc.c, "c")

testing.end()

// TEST 26
testing.test("S: Super constructor: this.getSuper(parentClass)()")
	var ClassSA = extend.Class({
		name:"ClassSA",
		initialize:function(){this.a="a"}
	})
	var ClassSB = extend.Class({
		name:"ClassSB",
		parent:ClassSA,
		initialize:function(){
			this.getSuper(ClassSA)()
			this.b="b"
		}
	})
	var ClassSC = extend.Class({
		name:"ClassSC",
		parent:ClassSB,
		initialize:function(){
			this.getSuper(ClassSB)()
			this.c="c"
		}
	})
	var new_sa = new ClassSA()
	var new_sb = new ClassSB()
	var new_sc = new ClassSC()
	testing.value(new_sa.a, "a")
	testing.asUndefined(new_sa.b)
	testing.asUndefined(new_sa.c)
	testing.value(new_sb.a, "a")
	testing.value(new_sb.b, "b")
	testing.asUndefined(new_sb.c)
	testing.value(new_sc.a, "a")
	testing.value(new_sc.b, "b")
	testing.value(new_sc.c, "c")
testing.end()

// TEST 27
testing.test("S: Super methods: this.getSuper(parentClass).methods()")
	var ClassSA = extend.Class({
		name:"A",
		methods:{doThis:function(){return this.getClass().getName() + ":" + "A"}}
	})
	var ClassSB = extend.Class({
		name:"B",
		parent:ClassSA,
		methods:{doThis:function(){return this.getSuper(ClassSA).doThis() + "B"}}
	})
	var ClassSC = extend.Class({
		name:"C",
		parent:ClassSB,
		shared:{V:"C"},
		methods:{
			doThis:function(){return this.getSuper(ClassSB).doThis() + "C"},
			doA:function(){
				return this.getSuper(ClassSB).getSuper().doThis()
			},
		}
	})
	var ClassSD = extend.Class({
		name:"D",
		parent:ClassSC
	})
	var new_sa = new ClassSA()
	var new_sb = new ClassSB()
	var new_sc = new ClassSC()
	var new_sd = new ClassSD()
	testing.value(new_sa.doThis(),   "A:A")
	testing.value(new_sb.doThis(),   "B:AB")
	testing.value(new_sc.doThis(),   "C:ABC")
	testing.value(new_sd.doThis(),   "D:ABC")
	testing.value(new_sd.doA(),      "D:A")
testing.end()

// TEST 28
testing.test("S: Super operations: this.SuperClass_operation()")
	var ClassSA = extend.Class({
		name:"ClassSA",
		shared:{V:"A"},
		operations:{doThis:function(){return this.V}}
	})
	var ClassSB = extend.Class({
		name:"ClassSB",
		parent:ClassSA,
		shared:{V:"B"},
		operations:{doThat:function(){return this.ClassSA_doThis() +
		this.doThis();}}
	})
	var ClassSC = extend.Class({
		name:"ClassSC",
		parent:ClassSB,
		shared:{V:"C"},
		operations:{doThat:function(){return this.ClassSB_doThat() +
		this.doThis();}}
	})
	testing.value(ClassSA.doThis(), "A")
	testing.value(ClassSB.doThis(), "B")
	testing.value(ClassSC.doThis(), "C")
	testing.value(ClassSB.doThat(), "BB")
	testing.value(ClassSC.doThat(), "CCC")

testing.end()

// ===========================================================================
// INTROSPECTION
// ===========================================================================

// isInstance

// TEST 29
testing.test("I: A.hasInstance(a)")
	testing.asTrue( ClassA.hasInstance(new_a) )
	testing.asTrue( ClassB.hasInstance(new_b) )
	testing.asTrue( ClassC.hasInstance(new_c) )
	testing.asTrue( ClassA.hasInstance(new_b) )
	testing.asTrue( ClassB.hasInstance(new_c) )
testing.end()

// TEST 30
testing.test("I: a.isInstance(A)")
	testing.asTrue( new_a.isInstance(ClassA) )
	testing.asTrue( new_b.isInstance(ClassB) )
	testing.asTrue( new_c.isInstance(ClassC) )
	testing.asTrue( new_b.isInstance(ClassA) )
	testing.asTrue( new_c.isInstance(ClassB) )
	testing.asTrue( new_c.isInstance(ClassC) )
testing.end()

// TEST 31
testing.test("I: B.isSubclassOf(A)")
	testing.asTrue( ClassB.isSubclassOf(ClassA) )
	testing.asTrue( ClassC.isSubclassOf(ClassB) )
	testing.asTrue( ClassC.isSubclassOf(ClassA) )
testing.end()

function get_keys(dict) {
	var res = []
	for ( k in dict ) { res.push(k) }
	return res;
}

function cmp_list(a,b) {
	if ( a.length == b.length ) {
		for ( var i=0 ; i<a.length ; i++ ) {
			if ( a[i] != b[i] ) { return false};
		}
		return true;
	} else {
		return false;
	}
}

function same_keys(a,b) {
	return cmp_list(get_keys(a),get_keys(b))
}

// TEST 32
testing.test("I: a.listMethods(A)")
	var ClassA = extend.Class({
		name:"ClassA",
		initialize:function(){this.a="a"},
		shared:{A:0},
		methods:{ doA:function(){} },
		operations:{ DoA:function(){} }
	})
	var ClassB = extend.Class({
		name:"ClassB",
		parent:ClassA,
		initialize:function(){this.b="b"},
		shared:{B:0},
		methods:{ doB:function(){} },
		operations:{ DoB:function(){} }
	})
	var ClassC = extend.Class({
		name:"ClassC",
		parent:ClassB,
		initialize:function(){this.c="c"},
		shared:{C:0},
		methods:{ doC:function(){} },
		operations:{ DoC:function(){} }
	})

	var a_all = ClassA.listMethods()
	var a_own = ClassA.listMethods(true,false)
	var a_inh = ClassA.listMethods(false,true)

	testing.asDefined( a_all.doA )
	testing.asTrue( same_keys(a_all, a_own) )
	testing.asTrue( same_keys(a_inh, {}) )

	var b_all = ClassB.listMethods()
	var b_own = ClassB.listMethods(true,false)
	var b_inh = ClassB.listMethods(false,true)

	testing.asDefined(   b_all.doB )
	testing.asDefined(   b_all.doA )
	testing.asUndefined( b_own.doA )
	testing.asDefined(   b_own.doB )
	testing.asDefined(   b_inh.doA )
	testing.asUndefined( b_inh.doB )

	var c_all = ClassC.listMethods()
	var c_own = ClassC.listMethods(true,false)
	var c_inh = ClassC.listMethods(false,true)

	testing.asDefined(   c_all.doC )
	testing.asDefined(   c_all.doB )
	testing.asDefined(   c_all.doA )
	testing.asDefined(   c_own.doC )
	testing.asUndefined( c_own.doB )
	testing.asUndefined( c_own.doA )
	testing.asDefined(   c_inh.doA )
	testing.asDefined(   c_inh.doB )
	testing.asUndefined( c_inh.doC )

testing.end()

// TEST 33
testing.test("I: a.listShared(A)")
	var a_all = ClassA.listShared()
	var a_own = ClassA.listShared(true,false)
	var a_inh = ClassA.listShared(false,true)

	testing.asDefined( a_all.A )
	testing.value( same_keys(a_all, a_own) )
	testing.value( same_keys(a_inh, {}) )

	var b_all = ClassB.listShared()
	var b_own = ClassB.listShared(true,false)
	var b_inh = ClassB.listShared(false,true)

	testing.asDefined(   b_all.B )
	testing.asDefined(   b_all.A )
	testing.asDefined(   b_own.B )
	testing.asUndefined( b_own.A )
	testing.asDefined(   b_inh.A )
	testing.asUndefined( b_inh.B )

	var c_all = ClassC.listShared()
	var c_own = ClassC.listShared(true,false)
	var c_inh = ClassC.listShared(false,true)

	testing.asDefined(   c_all.C )
	testing.asDefined(   c_all.B )
	testing.asDefined(   c_all.A )
	testing.asDefined(   c_own.C )
	testing.asUndefined( c_own.B )
	testing.asUndefined( c_own.A )
	testing.asDefined(   c_inh.A )
	testing.asDefined(   c_inh.B )
	testing.asUndefined( c_inh.C )
testing.end()


// TEST 34
testing.test("I: a.listOperations(A)")
	var a_all = ClassA.listOperations()
	var a_own = ClassA.listOperations(true,false)
	var a_inh = ClassA.listOperations(false,true)

	testing.asDefined( a_all.DoA )
	testing.value(  same_keys(a_all, a_own) )
	testing.value(  same_keys(a_inh, {}) )

	var b_all = ClassB.listOperations()
	var b_own = ClassB.listOperations(true,false)
	var b_inh = ClassB.listOperations(false,true)

	testing.asDefined(   b_all.DoB )
	testing.asDefined(   b_all.DoA )
	testing.asDefined(   b_own.DoB )
	testing.asUndefined( b_own.DoA )
	testing.asDefined(   b_inh.DoA )
	testing.asUndefined( b_inh.DoB )

	var c_all = ClassC.listOperations()
	var c_own = ClassC.listOperations(true,false)
	var c_inh = ClassC.listOperations(false,true)

	testing.asDefined(   c_all.DoC )
	testing.asDefined(   c_all.DoB )
	testing.asDefined(   c_all.DoA )
	testing.asDefined(   c_own.DoC )
	testing.asUndefined( c_own.DoB )
	testing.asUndefined( c_own.DoA )
	testing.asDefined(   c_inh.DoA )
	testing.asDefined(   c_inh.DoB )
	testing.asUndefined( c_inh.DoC )

testing.end()

// TEST 35
testing.test("I: a.listProperties(A)")
	var ClassA = extend.Class({
		name:"ClassA",
		initialize:function(){this.check=this.c},
		properties:{a:0,b:1,c:2}
	})
	var ClassB = extend.Class({
		name:"ClassB",
		parent:ClassA,
		initialize:function(){this.check=this.d},
		properties:{d:3}
	})
	var ClassC = extend.Class({
		name:"ClassC",
		parent:ClassB,
		properties:{e:4}
	})

	var new_a = new ClassA();
	var new_b = new ClassB();
	var new_c = new ClassC();

	var a_all = ClassA.listProperties()
	var a_own = ClassA.listProperties(true,false)
	var a_inh = ClassA.listProperties(false,true)

	testing.asDefined( a_all.a )
	testing.asDefined( a_all.b )
	testing.asDefined( a_all.c )
	testing.value(  same_keys(a_all, a_own) )
	testing.value(  same_keys(a_inh, {}) )

	testing.value(new_a.a, 0)
	testing.value(new_a.b, 1)
	testing.value(new_a.c, 2)
	testing.value(new_a.check, 2)

	var b_all = ClassB.listProperties()
	var b_own = ClassB.listProperties(true,false)
	var b_inh = ClassB.listProperties(false,true)

	testing.asDefined( b_all.a )
	testing.asDefined( b_all.b )
	testing.asDefined( b_all.c )
	testing.asDefined( b_all.d )

	testing.asUndefined( b_own.a )
	testing.asUndefined( b_own.b )
	testing.asUndefined( b_own.c )
	testing.asDefined(   b_own.d )

	testing.asDefined(   b_inh.a )
	testing.asDefined(   b_inh.b )
	testing.asDefined(   b_inh.c )
	testing.asUndefined( b_inh.d )

	testing.value(new_b.a, 0)
	testing.value(new_b.b, 1)
	testing.value(new_b.c, 2)
	testing.value(new_b.d, 3)
	testing.value(new_b.check, 3)

	var c_all = ClassC.listProperties()
	var c_own = ClassC.listProperties(true,false)
	var c_inh = ClassC.listProperties(false,true)

	testing.asDefined( c_all.a )
	testing.asDefined( c_all.b )
	testing.asDefined( c_all.c )
	testing.asDefined( c_all.d )

	testing.asUndefined( c_own.a )
	testing.asUndefined( c_own.b )
	testing.asUndefined( c_own.c )
	testing.asUndefined( c_own.d )
	testing.asDefined(   c_own.e )

	testing.asDefined(   c_inh.a )
	testing.asDefined(   c_inh.b )
	testing.asDefined(   c_inh.c )
	testing.asDefined(   c_inh.d )
	testing.asUndefined( c_inh.e )

	testing.value(new_c.a, 0)
	testing.value(new_c.b, 1)
	testing.value(new_c.c, 2)
	testing.value(new_c.d, 3)
	testing.value(new_c.e, 4)
	testing.value(new_c.check, 3)

testing.end()

// TEST 36
testing.test("I: a.listMethods(A)")
	var ClassA = extend.Class({
		name:"ClassA",
		initialize:function(){this.a="a"},
		shared:{A:0},
		methods:{ doA:function(){return this.a} },
		operations:{ DoA:function(){} }
	})
	var ClassB = extend.Class({
		name:"ClassB",
		parent:ClassA,
		initialize:function(){this.b="b"},
		shared:{B:0},
		methods:{ doB:function(){this.b} },
		operations:{ DoB:function(){} }
	})
	var ClassC = extend.Class({
		name:"ClassC",
		parent:ClassB,
		initialize:function(){this.c="c"},
		shared:{C:0},
		methods:{ doC:function(){this.c} },
		operations:{ DoC:function(){} }
	})

	var new_a = new ClassA();
	var new_a_doA = new_a.getMethod("doA")
	testing.value(new_a.doA.apply({a:"not a"}, []), "not a")
	testing.value(new_a_doA.apply({a:"not a"}, []), "a")

testing.end()

// TEST 37
testing.test("I: a.getClass(A)")
	var A     = extend.Class({name:"A" })
	testing.identical(A, extend.getClass("A"))
	var a_A   = extend.Class({name:"a.A" })
	testing.identical(a_A, extend.getClass("a.A"))
	var a_b_A = extend.Class({name:"a.b.A" })
	testing.identical(a_b_A, extend.getClass("a.b.A"))
	//try {
	//	extend.Class({name:"a.b.A" })
	//	testing.fail("Exception should be raised when redefining class")
	//} catch (e) {
	//	testing.succeed()
	//}
	testing.identical(a_b_A, extend.getClass("a.b.A"))
testing.end()

// TEST 38
testing.test("I: a.getChildrenOf(A)")
	var A = extend.Class({name:"A" })
	var B = extend.Class({name:"B", parent:A })
	var C = extend.Class({name:"C", parent:B })
	var D = extend.Class({name:"D", parent:C })
	var E = extend.Class({name:"E", parent:D })
	testing.asUndefined(extend.getChildrenOf(A).A)
	testing.identical(extend.getChildrenOf(A).B, B)
	testing.identical(extend.getChildrenOf(A).C, C)
	testing.identical(extend.getChildrenOf(A).D, D)
	testing.identical(extend.getChildrenOf(A).E, E)

	testing.asUndefined(extend.getChildrenOf(B).A)
	testing.asUndefined(extend.getChildrenOf(B).B)
	testing.identical(  extend.getChildrenOf(B).C, C)
	testing.identical(  extend.getChildrenOf(B).D, D)
	testing.identical(  extend.getChildrenOf(B).E, E)

	testing.asUndefined(extend.getChildrenOf(C).A)
	testing.asUndefined(extend.getChildrenOf(C).B)
	testing.asUndefined(extend.getChildrenOf(C).C)
	testing.identical(  extend.getChildrenOf(C).D, D)
	testing.identical(  extend.getChildrenOf(C).E, E)

	testing.asUndefined(extend.getChildrenOf(D).A)
	testing.asUndefined(extend.getChildrenOf(D).B)
	testing.asUndefined(extend.getChildrenOf(D).C)
	testing.asUndefined(extend.getChildrenOf(D).D)
	testing.identical(  extend.getChildrenOf(D).E, E)

	testing.asUndefined(extend.getChildrenOf(E).A)
	testing.asUndefined(extend.getChildrenOf(E).B)
	testing.asUndefined(extend.getChildrenOf(E).C)
	testing.asUndefined(extend.getChildrenOf(E).D)
	testing.asUndefined(extend.getChildrenOf(E).E)

testing.end()

// EOF
