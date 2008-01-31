// Extend 2.0 test suite (12-Oct-2007)
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
Testing.test("C: Single class declaration: A=Extend.Class(...)")
	// SETUP
	var ClassA = Extend.Class({
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
Testing.test("SC: Subclass declaration: var B=Extend.Class({parent:...})")
	// SETUP
	var ClassB = Extend.Class({
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

// TEST 12
Testing.test("SC: Subclass instance attribute: b.v")
	Testing.value(new_b._id,0) 
Testing.end()

// TEST 13
Testing.test("SC: Class attribute from instance: b.getClass().V")
	Testing.value(ClassB.Count,1) 
	Testing.value(new_b.getClass().Count,1) 
Testing.end()

// TEST 14
Testing.test("SC: Instance method: b.method()")
	Testing.value(new_b.hello(),"From B:0") 

// TEST 15
Testing.test("SC: Inherited method: b.inheritedmethod()")
	Testing.value(new_b.thishello(),"From B:0") 
	Testing.value(new_b.basehello(),"Hello:0") 
	new_b._id=10
	Testing.value(new_b.thishello(),"From B:10") 
	Testing.value(new_b.basehello(),"Hello:10") 
Testing.end()

// ===========================================================================
// SUB/SUB/CLASS TESTING
// ===========================================================================

// TEST 16
Testing.test("SSC: Sub-subclass declaration: var C=Extend.Class({parent:B,...})")
	// SETUP
	var ClassC = Extend.Class({
		name:"ClassC",
		parent:ClassB,
		methods:{
			hello:function(){return "From C:" + this._id}
		}
	})
	Testing.value(ClassC.getName(), "ClassC")
	Testing.value(ClassC.getParent(), ClassB) 
	Testing.value(ClassC.getParent().getParent(), ClassA) 
	Testing.value(ClassC.isClass(), true) 
Testing.end()

// TEST 17
Testing.test("SSC: Inhertied class attribute access: C.V ")
	Testing.value(ClassA.Count, 1) 
	Testing.value(ClassB.Count, 1) 
	Testing.value(ClassC.Count, 0) 
Testing.end()

// TEST 18
Testing.test("SSC: Inherited class operation: C.operation(...)")
	Testing.value(ClassC.otherHello(), "OtherHello") 
	Testing.value(ClassC.getCount(), 0)
Testing.end()

// TEST 19
Testing.test("SSC: Subclass instanciation: var c = new C()")
	var new_c = new ClassC()
	Testing.value(new_c.isClass(), false) 
	Testing.value(new_c.getClass(), ClassC) 
Testing.end()

// TEST 20
Testing.test("SSC: Subclass instance attribute: c.v")
	Testing.value(new_c._id,0) 
Testing.end()

// TEST 21
Testing.test("SSC: Class attribute from instance: c.getClass().V")
	Testing.value(ClassC.Count,1) 
	Testing.value(new_c.getClass().Count,1) 
Testing.end()

// TEST 22
Testing.test("SSC: Instance method: c.method()")
	Testing.value(new_c.hello(),"From C:0") 

// TEST 23
Testing.test("SSC: Inherited method: c.inheritedmethod()")
	Testing.value(new_c.thishello(),"From C:0") 
	Testing.value(new_c.basehello(),"Hello:0") 
	new_c._id=11
	Testing.value(new_c.thishello(),"From C:11") 
	Testing.value(new_c.basehello(),"Hello:11") 
Testing.end()

// ===========================================================================
// SUPER KEYWORD
// ===========================================================================

// TEST 24
Testing.test("S: Super methods: this.SuperClass_method()")
	var ClassSA = Extend.Class({
		name:"ClassSA",
		initialize:function(){this.a="a"},
		methods:{doThis:function(){return "doThis:SA:" + this.a}}
	})
	var ClassSB = Extend.Class({
		name:"ClassSB",
		parent:ClassSA,
		initialize:function(){this.a="b"},
		methods:{doThis:function(){return this.ClassSA_doThis() + ":SB"}}
	})
	var ClassSC = Extend.Class({
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
	Testing.value(new_sa.doThis(), "doThis:SA:a")
	Testing.value(new_sb.doThis(), "doThis:SA:b:SB")
	Testing.value(new_sc.doThis(), "doThis:SA:c:SB:SC")
	Testing.value(new_sc.doThat(), "doThis:SA:c:SC")
Testing.end()

// TEST 25
Testing.test("S: Super constructor: this.SuperClass_initialize()")
	var ClassSA = Extend.Class({
		name:"ClassSA",
		initialize:function(){this.a="a"}
	})
	var ClassSB = Extend.Class({
		name:"ClassSB",
		parent:ClassSA,
		initialize:function(){
			this.ClassSA_initialize();
			this.b="b"
		}
	})
	var ClassSC = Extend.Class({
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
	Testing.value(new_sa.a, "a")
	Testing.asUndefined(new_sa.b)
	Testing.asUndefined(new_sa.c)
	Testing.value(new_sb.a, "a")
	Testing.value(new_sb.b, "b")
	Testing.asUndefined(new_sb.c)
	Testing.value(new_sc.a, "a")
	Testing.value(new_sc.b, "b")
	Testing.value(new_sc.c, "c")

Testing.end()

// TEST 26
Testing.test("S: Super constructor: this.getSuper(parentClass)()")
	var ClassSA = Extend.Class({
		name:"ClassSA",
		initialize:function(){this.a="a"}
	})
	var ClassSB = Extend.Class({
		name:"ClassSB",
		parent:ClassSA,
		initialize:function(){
			this.getSuper(ClassSA)()
			this.b="b"
		}
	})
	var ClassSC = Extend.Class({
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
	Testing.value(new_sa.a, "a")
	Testing.asUndefined(new_sa.b)
	Testing.asUndefined(new_sa.c)
	Testing.value(new_sb.a, "a")
	Testing.value(new_sb.b, "b")
	Testing.asUndefined(new_sb.c)
	Testing.value(new_sc.a, "a")
	Testing.value(new_sc.b, "b")
	Testing.value(new_sc.c, "c")
Testing.end()

// TEST 27
Testing.test("S: Super methods: this.getSuper(parentClass).methods()")
	var ClassSA = Extend.Class({
		name:"A",
		methods:{doThis:function(){return this.getClass().getName() + ":" + "A"}}
	})
	var ClassSB = Extend.Class({
		name:"B",
		parent:ClassSA,
		methods:{doThis:function(){return this.getSuper(ClassSA).doThis() + "B"}}
	})
	var ClassSC = Extend.Class({
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
	var ClassSD = Extend.Class({
		name:"D",
		parent:ClassSC
	})
	var new_sa = new ClassSA()
	var new_sb = new ClassSB()
	var new_sc = new ClassSC()
	var new_sd = new ClassSD()
	Testing.value(new_sa.doThis(),   "A:A")
	Testing.value(new_sb.doThis(),   "B:AB")
	Testing.value(new_sc.doThis(),   "C:ABC")
	Testing.value(new_sd.doThis(),   "D:ABC")
	Testing.value(new_sd.doA(),      "D:A")
Testing.end()

// TEST 28
Testing.test("S: Super operations: this.SuperClass_operation()")
	var ClassSA = Extend.Class({
		name:"ClassSA",
		shared:{V:"A"},
		operations:{doThis:function(){return this.V}}
	})
	var ClassSB = Extend.Class({
		name:"ClassSB",
		parent:ClassSA,
		shared:{V:"B"},
		operations:{doThat:function(){return this.ClassSA_doThis() +
		this.doThis();}}
	})
	var ClassSC = Extend.Class({
		name:"ClassSC",
		parent:ClassSB,
		shared:{V:"C"},
		operations:{doThat:function(){return this.ClassSB_doThat() +
		this.doThis();}}
	})
	Testing.value(ClassSA.doThis(), "A")
	Testing.value(ClassSB.doThis(), "B")
	Testing.value(ClassSC.doThis(), "C")
	Testing.value(ClassSB.doThat(), "BB")
	Testing.value(ClassSC.doThat(), "CCC")

Testing.end()

// ===========================================================================
// INTROSPECTION
// ===========================================================================

// isInstance

// TEST 29
Testing.test("I: A.hasInstance(a)")
	Testing.asTrue( ClassA.hasInstance(new_a) )
	Testing.asTrue( ClassB.hasInstance(new_b) )
	Testing.asTrue( ClassC.hasInstance(new_c) )
	Testing.asTrue( ClassA.hasInstance(new_b) )
	Testing.asTrue( ClassB.hasInstance(new_c) )
Testing.end()

// TEST 30
Testing.test("I: a.isInstance(A)")
	Testing.asTrue( new_a.isInstance(ClassA) )
	Testing.asTrue( new_b.isInstance(ClassB) )
	Testing.asTrue( new_c.isInstance(ClassC) )
	Testing.asTrue( new_b.isInstance(ClassA) )
	Testing.asTrue( new_c.isInstance(ClassB) )
	Testing.asTrue( new_c.isInstance(ClassC) )
Testing.end()

// TEST 31
Testing.test("I: B.isSubclassOf(A)")
	Testing.asTrue( ClassB.isSubclassOf(ClassA) )
	Testing.asTrue( ClassC.isSubclassOf(ClassB) )
	Testing.asTrue( ClassC.isSubclassOf(ClassA) )
Testing.end()

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
Testing.test("I: a.listMethods(A)")
	var ClassA = Extend.Class({
		name:"ClassA",
		initialize:function(){this.a="a"},
		shared:{A:0},
		methods:{ doA:function(){} },
		operations:{ DoA:function(){} }
	})
	var ClassB = Extend.Class({
		name:"ClassB",
		parent:ClassA,
		initialize:function(){this.b="b"},
		shared:{B:0},
		methods:{ doB:function(){} },
		operations:{ DoB:function(){} }
	})
	var ClassC = Extend.Class({
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

	Testing.asDefined( a_all.doA )
	Testing.asTrue( same_keys(a_all, a_own) )
	Testing.asTrue( same_keys(a_inh, {}) )

	var b_all = ClassB.listMethods()
	var b_own = ClassB.listMethods(true,false)
	var b_inh = ClassB.listMethods(false,true)

	Testing.asDefined(   b_all.doB )
	Testing.asDefined(   b_all.doA )
	Testing.asUndefined( b_own.doA )
	Testing.asDefined(   b_own.doB )
	Testing.asDefined(   b_inh.doA )
	Testing.asUndefined( b_inh.doB )

	var c_all = ClassC.listMethods()
	var c_own = ClassC.listMethods(true,false)
	var c_inh = ClassC.listMethods(false,true)

	Testing.asDefined(   c_all.doC )
	Testing.asDefined(   c_all.doB )
	Testing.asDefined(   c_all.doA )
	Testing.asDefined(   c_own.doC )
	Testing.asUndefined( c_own.doB )
	Testing.asUndefined( c_own.doA )
	Testing.asDefined(   c_inh.doA )
	Testing.asDefined(   c_inh.doB )
	Testing.asUndefined( c_inh.doC )

Testing.end()

// TEST 33
Testing.test("I: a.listShared(A)")
	var a_all = ClassA.listShared()
	var a_own = ClassA.listShared(true,false)
	var a_inh = ClassA.listShared(false,true)

	Testing.asDefined( a_all.A )
	Testing.value( same_keys(a_all, a_own) )
	Testing.value( same_keys(a_inh, {}) )

	var b_all = ClassB.listShared()
	var b_own = ClassB.listShared(true,false)
	var b_inh = ClassB.listShared(false,true)

	Testing.asDefined(   b_all.B )
	Testing.asDefined(   b_all.A )
	Testing.asDefined(   b_own.B )
	Testing.asUndefined( b_own.A )
	Testing.asDefined(   b_inh.A )
	Testing.asUndefined( b_inh.B )

	var c_all = ClassC.listShared()
	var c_own = ClassC.listShared(true,false)
	var c_inh = ClassC.listShared(false,true)

	Testing.asDefined(   c_all.C )
	Testing.asDefined(   c_all.B )
	Testing.asDefined(   c_all.A )
	Testing.asDefined(   c_own.C )
	Testing.asUndefined( c_own.B )
	Testing.asUndefined( c_own.A )
	Testing.asDefined(   c_inh.A )
	Testing.asDefined(   c_inh.B )
	Testing.asUndefined( c_inh.C )
Testing.end()


// TEST 34
Testing.test("I: a.listOperations(A)")
	var a_all = ClassA.listOperations()
	var a_own = ClassA.listOperations(true,false)
	var a_inh = ClassA.listOperations(false,true)

	Testing.asDefined( a_all.DoA )
	Testing.value(  same_keys(a_all, a_own) )
	Testing.value(  same_keys(a_inh, {}) )

	var b_all = ClassB.listOperations()
	var b_own = ClassB.listOperations(true,false)
	var b_inh = ClassB.listOperations(false,true)

	Testing.asDefined(   b_all.DoB )
	Testing.asDefined(   b_all.DoA )
	Testing.asDefined(   b_own.DoB )
	Testing.asUndefined( b_own.DoA )
	Testing.asDefined(   b_inh.DoA )
	Testing.asUndefined( b_inh.DoB )

	var c_all = ClassC.listOperations()
	var c_own = ClassC.listOperations(true,false)
	var c_inh = ClassC.listOperations(false,true)

	Testing.asDefined(   c_all.DoC )
	Testing.asDefined(   c_all.DoB )
	Testing.asDefined(   c_all.DoA )
	Testing.asDefined(   c_own.DoC )
	Testing.asUndefined( c_own.DoB )
	Testing.asUndefined( c_own.DoA )
	Testing.asDefined(   c_inh.DoA )
	Testing.asDefined(   c_inh.DoB )
	Testing.asUndefined( c_inh.DoC )

Testing.end()

// TEST 35
Testing.test("I: a.listProperties(A)")
	var ClassA = Extend.Class({
		name:"ClassA",
		initialize:function(){this.check=this.c},
		properties:{a:0,b:1,c:2}
	})
	var ClassB = Extend.Class({
		name:"ClassB",
		parent:ClassA,
		initialize:function(){this.check=this.d},
		properties:{d:3}
	})
	var ClassC = Extend.Class({
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

	Testing.asDefined( a_all.a )
	Testing.asDefined( a_all.b )
	Testing.asDefined( a_all.c )
	Testing.value(  same_keys(a_all, a_own) )
	Testing.value(  same_keys(a_inh, {}) )

	Testing.value(new_a.a, 0)
	Testing.value(new_a.b, 1)
	Testing.value(new_a.c, 2)
	Testing.value(new_a.check, 2)

	var b_all = ClassB.listProperties()
	var b_own = ClassB.listProperties(true,false)
	var b_inh = ClassB.listProperties(false,true)

	Testing.asDefined( b_all.a )
	Testing.asDefined( b_all.b )
	Testing.asDefined( b_all.c )
	Testing.asDefined( b_all.d )

	Testing.asUndefined( b_own.a )
	Testing.asUndefined( b_own.b )
	Testing.asUndefined( b_own.c )
	Testing.asDefined(   b_own.d )

	Testing.asDefined(   b_inh.a )
	Testing.asDefined(   b_inh.b )
	Testing.asDefined(   b_inh.c )
	Testing.asUndefined( b_inh.d )

	Testing.value(new_b.a, 0)
	Testing.value(new_b.b, 1)
	Testing.value(new_b.c, 2)
	Testing.value(new_b.d, 3)
	Testing.value(new_b.check, 3)

	var c_all = ClassC.listProperties()
	var c_own = ClassC.listProperties(true,false)
	var c_inh = ClassC.listProperties(false,true)

	Testing.asDefined( c_all.a )
	Testing.asDefined( c_all.b )
	Testing.asDefined( c_all.c )
	Testing.asDefined( c_all.d )

	Testing.asUndefined( c_own.a )
	Testing.asUndefined( c_own.b )
	Testing.asUndefined( c_own.c )
	Testing.asUndefined( c_own.d )
	Testing.asDefined(   c_own.e )

	Testing.asDefined(   c_inh.a )
	Testing.asDefined(   c_inh.b )
	Testing.asDefined(   c_inh.c )
	Testing.asDefined(   c_inh.d )
	Testing.asUndefined( c_inh.e )

	Testing.value(new_c.a, 0)
	Testing.value(new_c.b, 1)
	Testing.value(new_c.c, 2)
	Testing.value(new_c.d, 3)
	Testing.value(new_c.e, 4)
	Testing.value(new_c.check, 3)

Testing.end()

// TEST 36
Testing.test("I: a.listMethods(A)")
	var ClassA = Extend.Class({
		name:"ClassA",
		initialize:function(){this.a="a"},
		shared:{A:0},
		methods:{ doA:function(){return this.a} },
		operations:{ DoA:function(){} }
	})
	var ClassB = Extend.Class({
		name:"ClassB",
		parent:ClassA,
		initialize:function(){this.b="b"},
		shared:{B:0},
		methods:{ doB:function(){this.b} },
		operations:{ DoB:function(){} }
	})
	var ClassC = Extend.Class({
		name:"ClassC",
		parent:ClassB,
		initialize:function(){this.c="c"},
		shared:{C:0},
		methods:{ doC:function(){this.c} },
		operations:{ DoC:function(){} }
	})

	var new_a = new ClassA();
	var new_a_doA = new_a.getMethod("doA")
	Testing.value(new_a.doA.apply({a:"not a"}, []), "not a")
	Testing.value(new_a_doA.apply({a:"not a"}, []), "a")

Testing.end()

// TEST 37
Testing.test("I: a.getClass(A)")
	var A     = Extend.Class({name:"A" })
	Testing.identical(A, Extend.getClass("A"))
	var a_A   = Extend.Class({name:"a.A" })
	Testing.identical(a_A, Extend.getClass("a.A"))
	var a_b_A = Extend.Class({name:"a.b.A" })
	Testing.identical(a_b_A, Extend.getClass("a.b.A"))
	//try {
	//	Extend.Class({name:"a.b.A" })
	//	Testing.fail("Exception should be raised when redefining class")
	//} catch (e) {
	//	Testing.succeed()
	//}
	Testing.identical(a_b_A, Extend.getClass("a.b.A"))
Testing.end()

// TEST 38
Testing.test("I: a.getChildrenOf(A)")
	var A = Extend.Class({name:"A" })
	var B = Extend.Class({name:"B", parent:A })
	var C = Extend.Class({name:"C", parent:B })
	var D = Extend.Class({name:"D", parent:C })
	var E = Extend.Class({name:"E", parent:D })
	Testing.asUndefined(Extend.getChildrenOf(A).A)
	Testing.identical(Extend.getChildrenOf(A).B, B)
	Testing.identical(Extend.getChildrenOf(A).C, C)
	Testing.identical(Extend.getChildrenOf(A).D, D)
	Testing.identical(Extend.getChildrenOf(A).E, E)

	Testing.asUndefined(Extend.getChildrenOf(B).A)
	Testing.asUndefined(Extend.getChildrenOf(B).B)
	Testing.identical(  Extend.getChildrenOf(B).C, C)
	Testing.identical(  Extend.getChildrenOf(B).D, D)
	Testing.identical(  Extend.getChildrenOf(B).E, E)

	Testing.asUndefined(Extend.getChildrenOf(C).A)
	Testing.asUndefined(Extend.getChildrenOf(C).B)
	Testing.asUndefined(Extend.getChildrenOf(C).C)
	Testing.identical(  Extend.getChildrenOf(C).D, D)
	Testing.identical(  Extend.getChildrenOf(C).E, E)

	Testing.asUndefined(Extend.getChildrenOf(D).A)
	Testing.asUndefined(Extend.getChildrenOf(D).B)
	Testing.asUndefined(Extend.getChildrenOf(D).C)
	Testing.asUndefined(Extend.getChildrenOf(D).D)
	Testing.identical(  Extend.getChildrenOf(D).E, E)

	Testing.asUndefined(Extend.getChildrenOf(E).A)
	Testing.asUndefined(Extend.getChildrenOf(E).B)
	Testing.asUndefined(Extend.getChildrenOf(E).C)
	Testing.asUndefined(Extend.getChildrenOf(E).D)
	Testing.asUndefined(Extend.getChildrenOf(E).E)

Testing.end()

// EOF
