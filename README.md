jsInheritableClass
==================

jsInheritableClass adds class-like inheritance for Javascript

Note: Currently jQuery is required due to the use of $.extend(), but I plan to patch out this dependency fairly soon.

Basic Functionality
-------------------

* Include either jsInheritableClass-[version].js or jsInheritableClass-[version]-min.js in your project
* Begin class definition by creating a function (this will be your constructor)
* Inherit from jInheritanceClass with .inheritsFrom(jsInheritableClass);
* Add all functions as prototypes

* Use this.callParentMethod(methodName) to call a method in the parent class
* Override .requiredMethods() and return an array of strings to require methods be defined (Abstract-like)

* Required Methods are enforced by .assertAllNecessaryMethodsAreImplemented();
* If every constructor calls it's parent then this will be called by the jsInheritableClass constructor
* Otherwise it can be called manually at any point

Simple Inheritance
------------------
First let us define a base class to inherit from.  This should inherit functionality from jsInheritableClass.
```
/**
 * Define an Animal Class
 */
function Animal(name) {
    // This is the constructor
    this.callParentMethod('constructor');
    this.setName(name);
};
Animal.inheritsFrom(jsInheritableClass); // Extend From jsInheritableClass

Animal.prototype.setName = function(name) {
    this.name = name;
};

Animal.prototype.getName = function() {
    if (this.name === undefined)
        this.name = '';
    return this.name;
};

Animal.prototype.speak = function() {
    alert(this.getName() + ' says ' + this.greetingText());
};
```

Now let's Define a Dog Class which extends from Animal

```
/**
 * Define a Dog Class
 */
function Dog(name) {
    this.callParentMethod('constructor', [name]);
};
Dog.inheritsFrom(Animal); // Extend from Animal

Dog.prototype.getBone = function(){
    alert('I GOT A BONE!!')
};

Dog.prototype.greetingText = function() {
    return 'Woof!';
};
```

Finally let's extend Dog to create a Bulldog Class

```
/**
 * Define a Bulldog Class
 */
function Bulldog(name) {
    this.callParentMethod('constructor', [name]);
};
Bulldog.inheritsFrom(Dog); // Extend from Dog

Bulldog.prototype.greetingText = function() {
    return this.getName() + ' ' + this.callParentMethod('greetingText');
};
```
Required Methods
----------------
To provide abstract-like methods, each class can override .requiredMethods() and return an array of method names.
So, to enforce greetingText() in subclasses of Animal we simply need to add:
```
Animal.prototype.requiredMethods = function() {
    return ['greetingText'];
};
```
The actual enforcement is provided by .assertAllNecessaryMethodsAreImplemented().  
This is called in the constructor for jsInheritableClass, so if all constructos contain a call to parent then this will run without any further intervention.
If the chain of constructor parent calls is broken then the method can simply be run at any time to enforce methods.
