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

export interface ElementConstructor extends Function {
  is?: string;
  properties?: {[prop: string]: PropertyOptions};
  observers?: string[];
  _addDeclarativeEventListener?:
      (target: string|EventTarget,
       eventName: string,
       handler: (ev: Event) => void) => void;
}

export interface ElementPrototype extends Polymer.Element {
  constructor: ElementConstructor;
}

/**
 * A TypeScript class decorator factory that registers the class as a custom
 * element.
 *
 * If `tagname` is provided, it will be used as the custom element name, and
 * will be assigned to the class static `is` property. If `tagname` is omitted,
 * the static `is` property of the class will be used instead. If neither exist,
 * or if both exist but have different values (except in the case that the `is`
 * property is not an own-property of the class), an exception is thrown.
 */
export function customElement(tagname?: string) {
  return (class_: {new (): Polymer.Element}&ElementConstructor) => {
    if (tagname) {
      // Only check that tag names match when `is` is our own property. It might
      // be inherited from a superclass, in which case it's ok if they're
      // different, and we'll override it with our own property below.
      if (class_.hasOwnProperty('is')) {
        if (tagname !== class_.is) {
          throw new Error(
              `custom element tag names do not match: ` +
              `(${tagname} !== ${class_.is})`);
        }
      } else {
        Object.defineProperty(class_, 'is', {value: tagname});
      }
    }
    // Throws if tag name is missing or invalid.
    window.customElements.define(class_.is!, class_);
  };
}

/**
 * Options for the @property decorator.
 * See https://www.polymer-project.org/2.0/docs/devguide/properties.
 */
export interface PropertyOptions {
  /**
   * This field can be omitted if the Metadata Reflection API is configured.
   */
  type?: BooleanConstructor|DateConstructor|NumberConstructor|StringConstructor|
      ArrayConstructor|ObjectConstructor;
  notify?: boolean;
  reflectToAttribute?: boolean;
  readOnly?: boolean;
  computed?: string;
  observer?: string|((val: {}, old: {}) => void);
}

interface Reflect {
  hasMetadata?:
      (metadataKey: string, proto: object, targetKey: string) => boolean;
  getMetadata?: (metadataKey: string, proto: object, targetKey: string) =>
      object | undefined;
}

function createProperty(
    proto: ElementPrototype, name: string, options?: PropertyOptions): void {
  if (!proto.constructor.hasOwnProperty('properties')) {
    Object.defineProperty(proto.constructor, 'properties', {value: {}});
  }

  const finalOpts: PropertyOptions = {
    ...proto.constructor.properties![name],
    ...options,
  };

  if (!finalOpts.type) {
    const reflect = (window as {Reflect?: Reflect}).Reflect;
    if (reflect && reflect.hasMetadata && reflect.getMetadata &&
        reflect.hasMetadata('design:type', proto, name)) {
      finalOpts.type = reflect.getMetadata('design:type', proto, name) as
          PropertyOptions['type'];
    } else {
      console.error(
          `A type could not be found for ${name}. ` +
          'Set a type or configure Metadata Reflection API support.');
    }
  }

  proto.constructor.properties![name] = finalOpts;
}

/**
 * A TypeScript property decorator factory that defines this as a Polymer
 * property.
 *
 * This function must be invoked to return a decorator.
 */
export function property(options?: PropertyOptions) {
  return (proto: ElementPrototype, propName: string) => {
    createProperty(proto, propName, options);
  };
}

/**
 * A TypeScript property decorator factory that causes the decorated method to
 * be called when a property changes.
 *
 * This function must be invoked to return a decorator.
 */
export function observe(...targets: string[]) {
  return (proto: ElementPrototype, propName: string) => {
    if (!proto.constructor.hasOwnProperty('observers')) {
      Object.defineProperty(proto.constructor, 'observers', {value: []});
    }
    proto.constructor.observers!.push(`${propName}(${targets.join(',')})`);
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
export function computed<P extends string, El extends ElementPrototype&
                         {[K in P]: {} | null | undefined}>(
    firstTarget: P, ...moreTargets: P[]) {
  return (proto: El,
          propName: string,
          descriptor: PropertyDescriptor): void => {
    const fnName = `__compute${propName}`;

    Object.defineProperty(proto, fnName, {value: descriptor.get});

    descriptor.get = undefined;

    const targets = [firstTarget, ...moreTargets].join(',');
    createProperty(proto, propName, {computed: `${fnName}(${targets})`});
  };
}

/**
 * A TypeScript property decorator factory that converts a class property into
 * a getter that executes a querySelector on the element's shadow root.
 *
 * By annotating the property with the correct type, elements can have
 * type-checked access to internal elements.
 *
 * This function must be invoked to return a decorator.
 */
export const query = _query(
    (target: NodeSelector, selector: string) => target.querySelector(selector));

/**
 * A TypeScript property decorator factory that converts a class property into
 * a getter that executes a querySelectorAll on the element's shadow root.
 *
 * By annotating the property with the correct type, elements can have
 * type-checked access to internal elements. The type should be NodeList
 * with the correct type argument.
 *
 * This function must be invoked to return a decorator.
 */
export const queryAll = _query(
    (target: NodeSelector, selector: string) =>
        target.querySelectorAll(selector));

/**
 * Creates a decorator function that accepts a selector, and replaces a
 * property with a getter than executes the selector with the given queryFn
 *
 * @param queryFn A function that executes a query with a selector
 */
function _query(
    queryFn: (target: NodeSelector, selector: string) =>
        Element | NodeList | null) {
  return (selector: string) => (proto: ElementPrototype, propName: string) => {
    Object.defineProperty(proto, propName, {
      get(this: HTMLElement) {
        return queryFn(this.shadowRoot!, selector);
      },
      enumerable: true,
      configurable: true,
    });
  };
}

export type HasEventListener<P extends string> = {
  [K in P]: (e: Event) => void
};

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
export function listen(eventName: string, target: string|EventTarget) {
  return <P extends string, El extends ElementPrototype&HasEventListener<P>>(
             proto: El, methodName: P) => {
    if (!proto.constructor._addDeclarativeEventListener) {
      throw new Error(
          `Cannot add listener for ${eventName} because ` +
          `DeclarativeEventListeners mixin was not applied to element.`);
    }
    proto.constructor._addDeclarativeEventListener(
        target, eventName, (proto as HasEventListener<P>)[methodName]);
  };
}
