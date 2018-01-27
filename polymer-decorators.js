this.Polymer = this.Polymer || {};
this.Polymer.decorators = (function (exports) {
'use strict';

/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */
/// <reference types="reflect-metadata" />
/**
 * A TypeScript class decorator factory that defines a custom element with name
 * `tagname` and the decorated class. If `tagname` is not provided, the static
 * `is` property of the class is used.
 */
function customElement(tagname) {
    // TODO Investigate narrowing down the type of clazz.
    return (clazz) => {
        // TODO(justinfagnani): we could also use the kebab-cased class name
        if (clazz.is) {
            tagname = clazz.is;
        }
        else {
            clazz.is = tagname;
        }
        window.customElements.define(tagname, clazz);
    };
}
function createProperty(proto, name, options) {
    const notify = options && options.notify || false;
    const reflectToAttribute = options && options.reflectToAttribute || false;
    const readOnly = options && options.readOnly || false;
    const computed = options && options.computed || '';
    const observer = options && options.observer || '';
    let type;
    if (options && options.hasOwnProperty('type')) {
        type = options.type;
    }
    else if (window.Reflect && Reflect.hasMetadata && Reflect.getMetadata &&
        Reflect.hasMetadata('design:type', proto, name)) {
        type = Reflect.getMetadata('design:type', proto, name);
    }
    else {
        console.error(`A type could not be found for ${name}. ` +
            'Set a type or configure Metadata Reflection API support.');
    }
    if (!proto.constructor.hasOwnProperty('properties')) {
        Object.defineProperty(proto.constructor, 'properties', { value: {} });
    }
    const finalOpts = { type, notify, reflectToAttribute, readOnly, computed, observer };
    proto.constructor.properties[name] = finalOpts;
}
/**
 * A TypeScript property decorator factory that defines this as a Polymer
 * property.
 *
 * This function must be invoked to return a decorator.
 */
function property(options) {
    return (proto, propName) => {
        createProperty(proto, propName, options);
    };
}
/**
 * A TypeScript property decorator factory that causes the decorated method to
 * be called when a property changes.
 *
 * This function must be invoked to return a decorator.
 */
function observe(...targets) {
    return (proto, propName) => {
        if (!proto.constructor.hasOwnProperty('observers')) {
            proto.constructor.observers = [];
        }
        proto.constructor.observers.push(`${propName}(${targets.join(',')})`);
    };
}
/**
 * A TypeScript accessor decorator factory that causes the decorated getter to
 * be called when a set of dependencies change. The arguments of this decorator
 * should be paths of the data dependencies as described
 * [here](https://www.polymer-project.org/2.0/docs/devguide/observers#define-a-computed-property)
 * The decorated getter should not have an associated setter.
 *
 * This function must be invoked to return a decorator.
 */
function computed(...targets) {
    return (proto, propName, descriptor) => {
        const fnName = `__compute${propName}`;
        Object.defineProperty(proto, fnName, { value: descriptor.get });
        descriptor.get = undefined;
        createProperty(proto, propName, { computed: `${fnName}(${targets.join(',')})` });
    };
}
/**
 * A TypeScript property decorator factory that converts a class property into
 * a getter that executes a querySelector on the element's shadow root.
 *
 * By annotating the property with the correct type, element's can have
 * type-checked access to internal elements.
 *
 * This function must be invoked to return a decorator.
 */
const query = _query((target, selector) => target.querySelector(selector));
/**
 * A TypeScript property decorator factory that converts a class property into
 * a getter that executes a querySelectorAll on the element's shadow root.
 *
 * By annotating the property with the correct type, element's can have
 * type-checked access to internal elements. The type should be NodeList
 * with the correct type argument.
 *
 * This function must be invoked to return a decorator.
 */
const queryAll = _query((target, selector) => target.querySelectorAll(selector));
/**
 * Creates a decorator function that accepts a selector, and replaces a
 * property with a getter than executes the selector with the given queryFn
 *
 * @param queryFn A function that executes a query with a selector
 */
function _query(queryFn) {
    return (selector) => (proto, propName) => {
        Object.defineProperty(proto, propName, {
            get() {
                return queryFn(this.shadowRoot, selector);
            },
            enumerable: true,
            configurable: true,
        });
    };
}
/**
 * A TypeScript property decorator factory that causes the decorated method to
 * be called when a imperative event is fired on the targeted element. `target`
 * can be either a single element by id or element.
 *
 * You must apply the supplied DeclarativeEventListeners mixin to your element
 * class for this decorator to function.
 *
 * https://www.polymer-project.org/2.0/docs/devguide/events#imperative-listeners
 *
 * @param eventName A string representing the event type to listen for
 * @param target A single element by id or EventTarget to target
 */
const listen = (eventName, target) => (proto, methodName) => {
    proto.constructor._addDeclarativeEventListener(target, eventName, proto[methodName]);
};

exports.customElement = customElement;
exports.property = property;
exports.observe = observe;
exports.computed = computed;
exports.query = query;
exports.queryAll = queryAll;
exports.listen = listen;

return exports;

}({}));
