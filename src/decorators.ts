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
export function customElement(tagname?: string) {
  // TODO Investigate narrowing down the type of clazz.
  return (clazz: any) => {
    // TODO(justinfagnani): we could also use the kebab-cased class name
    tagname = clazz.is = clazz.is || tagname;
    window.customElements.define(tagname!, clazz);
  }
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
}

/**
 * A TypeScript property decorator factory that defines this as a Polymer
 * property.
 *
 * This function must be invoked to return a decorator.
 */
export function property(options?: PropertyOptions) {
  return (proto: any, propName: string): any => {
    const notify: boolean = options && options.notify || false;
    const reflectToAttribute: boolean =
        options && options.reflectToAttribute || false;
    const readOnly: boolean = options && options.readOnly || false;

    let type;
    if (options && options.hasOwnProperty('type')) {
      type = options.type;
    } else if (
        (window as any).Reflect && Reflect.hasMetadata && Reflect.getMetadata &&
        Reflect.hasMetadata('design:type', proto, propName)) {
      type = Reflect.getMetadata('design:type', proto, propName);
    } else {
      console.error(
          'A type could not be found for ${propName}. ' +
          'Set a type or configure Metadata Reflection API support.');
    }

    if (!proto.constructor.hasOwnProperty('properties')) {
      proto.constructor.properties = {};
    }
    proto.constructor.properties[propName] = {
      type,
      notify,
      reflectToAttribute,
      readOnly,
    };
  }
}

/**
 * A TypeScript property decorator factory that causes the decorated method to
 * be called when a property changes. `targets` is either a single property
 * name, or a list of property names.
 *
 * This function must be invoked to return a decorator.
 */
export function observe(targets: string|string[]) {
  return (proto: any, propName: string): any => {
    const targetString =
        typeof targets === 'string' ? targets : targets.join(',');
    if (!proto.constructor.hasOwnProperty('observers')) {
      proto.constructor.observers = [];
    }
    proto.constructor.observers.push(`${propName}(${targetString})`);
  }
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
export const query = _query(
    (target: NodeSelector, selector: string) => target.querySelector(selector));

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
  return (selector: string) => (proto: any, propName: string): any => {
    Object.defineProperty(proto, propName, {
      get(this: HTMLElement) {
        return queryFn(this.shadowRoot!, selector);
      },
      enumerable: true,
      configurable: true,
    });
  };
}
