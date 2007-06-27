== Extend 2.0
== Developer Manual
-- Author: Sebastien Pierre <sebastien@ivy.fr>
-- Revision: 27-Jun-2007


Extend 2.0 is an evolution of the [Extend 1.0](http://www.ivy.fr/js/extend/1)
which implemented a flexible class-based OOP layer on top of the JavaScript
prototype object model.

Extend 2.0 allows you to write nice and clean classes in JavaScript, features
introspection and class meta-information, is mature and
[fully-tested](http://www.ivy.fr/js/extend/test.html), and used as a base for
our wonderful [Sugar language](http://www.ivy.fr/sugar) runtime.

The problem
===========

  JavaScript being a prototype-based object language, it does not offer (in
  standard) a ''class-based'' OOP layer. This can become a problem when you're
  writing medium to large system, where prototypes start to be cumbersome to
  manage.

  The famous JavaScript [Prototype library](http://www.prototypejs.com)
  provides a very basic way to create classes, but does not provide any
  inheritance between classes.  Extensions such as [ExtendClass][2] and
  [ExtendClassFurther][3] tried to add sub-classing, but fail to have a
  flexible and reliable `super`-equivalent, which makes advanced JavaScript
  application development difficult.

  Moreover, neither of these extensions allow meta-information specification
  to classes (such as class name, methods, parent class, etc), while this
  information is very useful for debugging and introspection.

  Additionally, common cases such as handing an object method to a callback
  that may alter the 'this' is not supported ([jQuery](http://www.jquery.com)
  callback do that).

Introducing Extend
==================

  Extend 2.0 is a simplified, cleaner version of the Extend 1.X library, with
  the same design goals:

  - Traditional class-based OOP layer for JavaScript
  - Notion of class attributes (attributes), methods and class methods (operations)
  - Introspection API to list attributes, methods, operations
  - Makes the difference between what is inherited and what is not inherited
  - Easy wrapping of object methods to be safely given as callbacks

  To start using 'Extend', simply add the following line to your HTML head
  section:

  >   <script type="text/javascript" src="http://www.ivy.fr/js/extend.js"></script>

  Once you've included the script, you can create classed by using the
  'Extend.Class' function:

  >   var A = Extend.Class({
  >     name:"A",
  >     methods:{
  >       helloWorld:function(){
  >         return "Hello, World !";
  >       }
  >     }
  >   });
  >   alert(new A().helloWorld());

  The 'Extend.Class' takes the following parameters, given in a dictionary:

  - 'name' (*required*): a string representing the class name. In case you want
    the class name to reflect a package hierarchy (like 'ui.widget.InputField'),
    you can use dots to join module names and class name.

  - 'parent': the parent class (if any) of this class.

  - 'init': the constructor function for this class.

  - 'methods': a dictionary mapping method names to functions implementing the
     methods, where the 'this' will refer to the current instance.

  - 'operations': a dictionary mapping class methods (operation) names to
     functions. The 'this' in these functions will refer to the class object, as
     returned by 'Extend.Class'.

  - 'attributes': a dictionary mapping class attributes names to values. Class
    attributes default values are inherited by sub-classes, and can be accessed
    directly (like 'A.foo' if 'foo' is a class attribute of 'A')

  In methods, you 'this' will (obviously) point to the current instance. If you
  want to access the method 'foo' defined in class 'A', when you are in class
  'B' subclass of 'A', you can do:

  >   this.getSuper(A).foo()

  or use the faster option:

  >   this.A_foo()

  where 'A' is the name you gave to the class 'A'.


Extend API
==========

  Extend offers a set of methods that can are available to Extend classes and
  instances created from Extend classes. These methods range from simple
  introspection (what is the class of an object, what is this class name, is
  this an object an instance of this class, etc) to more complex things
  (safely wrapping a method for callback, listing inherited methods, etc).

  Object API
  ----------

    'isClass'::
      Tells if the given object is class or not. This returns 'false'

    'getClass'::
      Returns the class object associated with this instance. You can use the
      class object to access class operations, class attributes, etc.

    'getMethod(name:String)'::
      In JavaScript, if you give a method as a callback by simply doing
      'object.method', then you may have problems when the caller changes the
      'this' argument of the method. Using 'getMethod' will ensure that the this
      is preserved. It's actually the equivalent of doing
      'this.getClass().bindMethod(this, name)'.

    'getSuper(c:Class)'::
      Returns a proxy that will use the current object as state, but where every
      operation defined in the proxy will use the implementation defined in the
      given class.

    'isInstance(c:Class)'::
      Returns 'true' if this instance is an instance of the given class, which
      must be either the class of this instance, or an ancestor of this instance
      class.

  Class API
  ---------

    'isClass'::
      Tells if the given object is class or not. This returns 'true'

    'getName'::
      Returns the class name, as given when creating the class.

    'getParent'::
      Returns the parent class for this class, or 'undefined'.

    'hasInstance(o:Object)'::
      Tells if the given object is an instance of this class. This also includes
      the parent classes.

    'isSubclassOf(c:Class)'::
      Tells if this class is a subclass of the given class.

    'listMethods(own:Boolean=True, inherited:Boolean=True)'::
      Returns a dictionary that maps methods names to unbound methods, including
      by default the 'own' methods and the 'inherited' methods. Settings these
      two parameters to either 'true' or 'false' will allow to return the
      desired subset.

    'listOperations(own:Boolean=True, inherited:Boolean=True)'::
      Same as 'listMethods', but with class operations.

    'listAttributes(own:Boolean=True, inherited:Boolean=True)'::
      Same as 'listMethods', but with class attributes.

    'getOperation(name:String)'::
      Returns the class operation with the given name wrapped so that the 'this'
      will be preserved even if you use 'operation.apply(other_object,
      arguments)' (pretty much like 'bindMethod').

    'bindMethod(o:Object, name:String)'::
      Returns the method named 'name' when it is bound to the given object. This
      method can be safely given as a callback, and even if the 'this' is
      changed in a 'method.apply(other_object, arguments)', it will be
      preserved.

    'proxyWithState(o:Object)'::
      Returns an object that will have the same operations and attributes
      defined in this class, but will use the given object as _state_ (as
      'this' or 'self'). Doing 'o getClass() getParent() proxyWithState(o)' is
      the equivalent of creating a 'super' keyword where you can invoke methods
      from the parent.

Examples
========

  Step 1: Create a new class

  >   var Shape = Extend.Class(
  >     name:"Shape",
  >     init:function(){
  >       this.points = [];
  >     }
  >     methods:{
  >       addPoint:function(p){
  >         this.points.push(p);
  >       }
  >       getPoints:function(){
  >         return this.points;
  >       }
  >     }
  >   });

  Step 2: Create an instance of your class, and do stuff

  >   my_shape = new Shape();
  >   my_shape.addPoint([0,0]);
  >   my_shape.addPoint([1,0]);
  >   console.log(my_shape.getPoints().toSource());

  Step 3: Create a subclass

  >   var Rectangle = Extend.Class(
  >     name:"Rectangle",
  >     parent:"Shape",
  >     init:function(){
  >       this.points = [];
  >     }
  >     methods:{
  >       addPoint:function(p){
  >         this.points.push(p);
  >       }
  >       getPoints:function(){
  >         return this.points;
  >       }
  >     }
  >   });

Note about 'super'
==================

  While the prototype-based object model is very flexible, it has some problems
  when you try to simulate class-based objects, particularly when you try to
  simulate the 'super' keyword.

  The operational semantics of the 'super' keyword are well defined in the [Java
  Language Specification][6]

      <<<Suppose that a field access expression 'super'*.name*
      appears within class 'C', and the immediate superclass of 'C' is class 'S'. Then
      super.name is treated exactly as if it had been the expression
      '((S)this).'*name*; thus, it refers to the field named name of the current
      object, but with the current object viewed as an instance of the
      superclass. Thus it can access the field named name that is visible in
      class 'S', even if that field is hidden by a declaration of a field named
      name in class 'C'.>>> (section 15.11.2)

  which defines the semantics for _field access_ (aka. object attributes or
  slots), but the semantics for method invocation (at least in Java) are a bit
  different:

      <<<The casts to types T1 and T2 do not change the method that is invoked,
      because the instance method to be invoked is chosen according to the
      run-time class of the object referred to be this. A cast does not change
      the class of an object; it only checks that the class is compatible with
      the specified type.>>> (section 15.12.4.9 of the JLS)

  In the case of JavaScript, we can consider the ''method invocation'' case as the
  generic case, as everything is decided at run-time. So if we rephrase this,
  what 'super.'*name* does is to select the method named *name* in the parent
  class, and execute it with the current object as target ('this').

  In JavaScript, you could define:

  >   this.getSuperMethod(SuperClass, "hello")

  that would return a function that would do

  >   function(){SuperClass["hello"].apply(o,arguments)}
  
  where 'o' is the object which was the target for 'getSuperMethod'. We could go
  further and define:

  >   this.getSuper().hello()

  where 'getSuper' would return an _object proxy_ that has slots that correspond
  to methods defined in the 'this' object parent class.

  So if you have something like:

  >   var A = Extend.Class({name:"A",
  >     methods:{hello:function(){return "A"}}
  >   })
  >   var B = Extend.Class({name:"B",parent:A,
  >       methods:{hello:function(){return this.getSuper().hello()+"B"}}
  >   })

  Then '(new A()).hello()' would be 'A' and '(new B()).hello())' would be 'B'.

  However, let's introduce C:

  >   var C = Extend.Class({name:"C",parent:C,
  >       methods:{hello:function(){return this.getSuper().hello()+"C"}}
  >   })

  Then when invoking '(new C()).hello()', 'this.getSuper()' will return a proxy
  to the 'hello' method of 'B'. However, when B is executed the statement
  'this.getSuper()' will return the same proxy, and the 'hello' method (defined
  in 'B') will be invoked recursively, making the program enter an infinite
  loop.

  The reason for that is that the 'getSuper' is a method belonging to 'this', so
  the 'this.getSuper().hello()' defined in 'B', when invoked from
  'this.getSuper().hello()' defined in 'C' will actually still resolve to the
  'hello' defined in 'B' and not the one defined in 'C'.

  If we could separate an object state from its operations, and particularly
  the resolution of fields and the resolution of methods, then we could solve
  this easily:

  - fields are always resolved in the target ('this')
  - operations are resolved in the context of the current class

  The workaround for this is to *explicitly state the parent class* when using
  'getSuper':

  >   var B = Extend.Class({name:"B",parent:A,
  >       methods:{hello:function(){return this.getSuper(A).hello()+"B"}}
  >   })
  >   var C = Extend.Class({name:"C",parent:C,
  >       methods:{hello:function(){return this.getSuper(B).hello()+"C"}}
  >   })

  In this case you have no ambiguity, but this makes the mechanism of using
  'super' a bit more verbose.

# --
 
 [0]: JavaScript Gotchas, Sébastien Pierre, June 2007
      [tech note](http://www.ivy.fr/notes/javascript-gotchas.html)

 [1]: Object-Oriented Programmming in JavaScript, Mike Moss, January 2006
      [article](http://mckoss.com/jscript/object.htm)

 [2]: Prototype-based Programming Wikipedia Article,
      [wikipedia](http://en.wikipedia.org/wiki/Prototype-based_programming)

 [3]: Java Reflection API
      [tutorial](http://java.sun.com/docs/books/tutorial/reflect/index.html)

 [4]: Extend Class, Prototype library extension to add subclassing
      [wiki page](http://wiki.script.aculo.us/scriptaculous/show/ExtendClass)

 [5]: Extend Class Further, adding Ruby-like OO features to Prototype
      [wiki page](http://wiki.script.aculo.us/scriptaculous/show/ExtendClassFurther)

 [6]: Java Language Specification, Third Edition,
      [section 15.11.2](http://tinyurl.com/2hggtq)


# EOF vim: syn=kiwi ts=2 sw=2 et
