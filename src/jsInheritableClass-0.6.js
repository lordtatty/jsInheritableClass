/**
 * jsInheritableClass v0.6
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


/**
 * First, extend the core Function object to make
 * inheritance much easier.
 * Thanks to http://phrogz.net/JS/classes/OOPinJS2.html for helping me tp understand how this works
 * 
 * @param {class} parentClass a defined class(object but does not need to be instantiated) to inherit from
 */
Function.prototype.inheritsFrom = function(parentClass) {
    newPrototype = {};
    for(x in parentClass.prototype){
        newPrototype[x] = parentClass.prototype[x];
    }
    this.prototype = newPrototype;
    this.prototype.constructor = this;
    this.prototype.parent = parentClass.prototype;
    return this;
};

/**
 * Define the Constructor
 */
var jsInheritableClass = {};

jsInheritableClass = function() {
    this.initObject();
};

/**
 * Get the called level stack
 */
jsInheritableClass.prototype.getCalledLevelStack = function() {
    return this.calledLevel;
};

/**
 * Set the called level stack
 * This should not be used externally unless you know what you are doing
 * 
 * @param {array} stack the new calledLevelStackObject
 */
jsInheritableClass.prototype.setCalledLevelStack = function(stack) {
    this.calledLevel = stack;
};

/**
 * Get the called level for .call calls
 */
jsInheritableClass.prototype.getCalledLevel = function() {
    if (this.calledLevel === undefined)
        this.calledLevel = [this];
    return this.calledLevel[this.calledLevel.length - 1];
};

/**
 * Set the called level for .call calls
 */
jsInheritableClass.prototype.addCalledLevel = function() {
    if (this.calledLevel === undefined)
        this.calledLevel = [this];
    var current = this.calledLevel[this.calledLevel.length - 1];
    if (current.parent === undefined)
        throw new jsInheritableClass.Errors.TopOfCallLevelStack();
    this.calledLevel.push(current.parent);
};

/**
 * Set the called level for .call calls
 */
jsInheritableClass.prototype.removeCalledLevel = function() {
    this.calledLevel.pop();
};

/**
 * Call a parent method based upon the current called level
 * 
 * @param {string} methodName the method name to call
 * @param {array} params (optional) any params to pass to the method in an array
 * @param {object} scope (optional) The object scope to call the method on.  Defaults to 'this'.
 */
jsInheritableClass.prototype.callParentMethod = function(methodName, params, scope) {
    if (scope === undefined)
        scope = this;
    if (params === undefined)
        params = {};
    this.addCalledLevel();
    if (typeof this.getCalledLevel()[methodName] !== 'function')
        throw new jsInheritableClass.Errors.CallLevelMethodDoesNotExist();
    var result = this.getCalledLevel()[methodName].apply(scope, params);
    this.removeCalledLevel();
    return result;
};

/**
 * Init
 */
jsInheritableClass.prototype.initObject = function() {
    this._inheritableData = {};
    this._inheritableData.className = this.constructor.name;
    this.assertAllNecessaryMethodsAreImplemented();
};

/**
 * Return required methods.  Override to add new methods
 */
jsInheritableClass.prototype.requiredMethods = function() {
    return [];
};

/**
 * Get required methods
 */
jsInheritableClass.prototype.getAllRequiredMethods = function() {
    var requiredMethods;
    try {
        requiredMethods = this.callParentMethod('getAllRequiredMethods', [], this.parent);
    }
    catch (err) {
        if (err.name !== 'TopOfCallLevelStack')
            throw err;
        else
            requiredMethods = [];
    }
    var localRequiredMethods = this.requiredMethods();
    for (var x in localRequiredMethods) {
        requiredMethods.push(localRequiredMethods[x]);
    }
    return requiredMethods;
};

/**
 * Call parent method with a fresh call stack
 * @param {function} passedFunction The function to call
 */
jsInheritableClass.prototype.runMethodWithFreshCallLevelStack = function(passedFunction) {
    var initialCallLevelStack = this.getCalledLevelStack();
    this.setCalledLevelStack([this]);
    var result = passedFunction.call(this);
    this.setCalledLevelStack(initialCallLevelStack);
    return result;
};

/**
 * Check all the necessary methods have been implemented.
 * This allows us to use this as an abstract class
 */
jsInheritableClass.prototype.assertAllNecessaryMethodsAreImplemented = function() {
    var requiredMethods = this.runMethodWithFreshCallLevelStack(this.getAllRequiredMethods);

    for (var x in requiredMethods) {
        var methodName = requiredMethods[x];
        if (this[methodName] === undefined) {
            throw new jsInheritableClass.Errors.MissingRequiredMethod(methodName, this._inheritableData.className);
        }
    }
};

/**
 * Define Errors
 */
jsInheritableClass.Errors = {};

/**
 * Thrown when the call level stack tries to call a parent which does not exist
 * @param {string} methodName the name of the missing method
 * @param {string} className the name of the missing class
 */
jsInheritableClass.Errors.MissingRequiredMethod = function(methodName, className) {
    this.name = "MissingRequiredMethod";
    this.message = 'The method ' + methodName + '() has not been defined for ' + className;
};
jsInheritableClass.Errors.MissingRequiredMethod.prototype = Error.prototype;

/**
 * Thrown when the call level stack tries to call a parent which does not exist
 */
jsInheritableClass.Errors.TopOfCallLevelStack = function() {
    this.name = "TopOfCallLevelStack";
    this.message = 'We have hit the top of the call level stack';
};
jsInheritableClass.Errors.TopOfCallLevelStack.prototype = Error.prototype;

/**
 * Thrown when the current call level stack does not contain the required method
 */
jsInheritableClass.Errors.CallLevelMethodDoesNotExist = function() {
    this.name = "CallLevelMethodDoesNotExist";
    this.message = 'Method does not seem to exist';
};
jsInheritableClass.Errors.CallLevelMethodDoesNotExist.prototype = Error.prototype;
