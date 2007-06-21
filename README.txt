== Extend 2.0
== Developer Manual


The problem
===========

  There are a couple of OOP layers existing for JavaScript, 

  - When giving methods to callbacks


The solution
============


  - Traditional OOP layer
  - Difference between method and bound method
  - Reflection to list attributes, methods, operations
  - Make the difference between inherited and non-inherited methods

Class API
=========

  Features:

  - Attributes are inherited from parent classes, but they are not shared among
    classes.
    |
    >   var A=Extend.create({attributes:{A:10})
    >   var B=Extend.create({parent:A})
    >   console.log("A.A == B.A" + (A.A == B.A))
    >   A.A = 20
    >   console.log("A.A != B.A" + (A.A != B.A))
    |
    In this example, you can see that even if you change 'A.A', 'B.A' won't be
    affected, but they share the same default value.

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
    by default the 'own' methods and the 'inherited' methods. Settings these two
    parameters to either 'true' or 'false' will allow to return the desired
    subset.

  'listOperations(own:Boolean=True, inherited:Boolean=True)'::
    Same as 'listMethods', but with class operations.

  'listAttributes(own:Boolean=True, inherited:Boolean=True)'::
    Same as 'listMethods', but with class attributes.

  'bindMethod(o:Object, name:String)'::
    Returns the method named 'name' when it is bound to the given object. This
    method can be safely given as a callback, and even if the 'this' is changed
    in a 'method.apply(other_object, arguments)', it will be preserved.

Instance API
============

  'getClass'::
    Returns the class object associated with this instance. You can use the
    class object to access class operations, class attributes, etc.

  'getMethod(name:String)'::
    In JavaScript, if you give a method as a callback by simply doing
    'object.method', then you may have problems when the caller changes the
    'this' argument of the method. Using 'getMethod' will ensure that the this
    is preserved.

  'getSuperConstructor(parent:Class)'::
    Returns the constructor from this instance parent class.

  'getSuperMethod(parent:Class, name:String)'::
    Returns a method borrowed from the parent class (which must be defined or an
    exception will be fired) and returns it so that it will be executed with
    this instance.

  'isInstance(c:Class)'::
    Returns 'true' if this instance is an instance of the given class, which
    must be either the class of this instance, or an ancestor of this instance
    class.

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
  >   };

  >   )

--
 
 [0] JavaScript Traps, Sébastien Pierre, June 2007
     <http://www.ivy.fr/notes/javascript-traps.html>

 [1] Object-Oriented Programmming in JavaScript, Mike Moss, January 2006
     <http://mckoss.com/jscript/object.htm>

 [2] Prototype-based Programming Wikipedia Article,
     <http://en.wikipedia.org/wiki/Prototype-based_programming>

 [3] Java Reflection API
     <http://java.sun.com/docs/books/tutorial/reflect/index.html>


# EOF vim: syn=kiwi ts=2 sw=2 et
