== Extend 2.0
== Developer Manual

Class API
=========

  Features

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

  'getName'
  'getParent'
  'getOperation'

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
  
  'getSuperMethod(name:String)'::
    Returns a method borrowed from the parent class (which must be defined or an
    exception will be fired) and returns it so that it will be executed with
    this instance.

  'isInstance(c:Class)'::
    Returns 'true' if this instance is an instance of the given class, which
    must be either the class of this instance, or an ancestor of this instance
    class.



# vim: syn=kiwi ts=2 sw=2 et
