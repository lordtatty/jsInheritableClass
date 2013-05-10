/**
 * jsInheritableClassExamples.js
 * 
 * ©Copyright 2013 lordtatty
 * Distributed under the terms of the GNU Lesser General Public License (LGPL) v3.0
 * 
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 * 
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

jsInheritableClassExample = function() {

    /**
     * Define an Animal Class
     */
    function Animal(name) {
        this.callParentMethod('constructor');
        this.setName(name);
    };
    Animal.inheritsFrom(jsInheritableClass);

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

    Animal.prototype.requiredMethods = function() {
        return ['greetingText'];
    };

    /**
     * Define a dog
     */
    function Dog(name) {
        this.callParentMethod('constructor', [name]);
    };
    Dog.inheritsFrom(Animal);

    Dog.prototype.requiredMethods = function(){
        return ['getBone']
    };

    Dog.prototype.getBone = function(){
        alert('I GOT A BONE!!')
    };

    Dog.prototype.greetingText = function() {
        return 'Woof!';
    };

    /**
     * Define a cat
     */
    function Cat(name) {
        this.callParentMethod('constructor', [name]);
    };
    Cat.inheritsFrom(Animal);

    Cat.prototype.greetingText = function() {
        return 'Meow!';
    };

    /**
     * Define a Bulldog(subClass of Dog)
     */
    function Bulldog(name) {
        this.callParentMethod('constructor', [name]);
    };
    Bulldog.inheritsFrom(Dog);

    Bulldog.prototype.greetingText = function() {
        return this.getName() + ' ' + this.callParentMethod('greetingText');
    };

    /**
     * Let's make some objects
     */
    var dogObject = new Dog('Bert');
    var catObject = new Cat('Reginald');
    var bulldogObject = new Bulldog('Winston');
    dogObject.speak();
    catObject.speak();
    bulldogObject.speak();

};
