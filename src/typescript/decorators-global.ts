/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

 declare namespace Polymer {

  export namespace decorators {

    export namespace typescript {

      export function customElement(tagname?: string): (clazz: any) => void;

      export interface PropertyOptions {
        notify?: boolean;
      }

      export function property(options?: PropertyOptions): (proto: any, propName: string) => void;

      export function observe(targets: string|string[]): (proto: any, propName: string) => void;

      export function query(selector: string): (proto: any, propName: string) => void;

      export function queryAll(selector: string): (proto: any, propName: string) => void;

    }

  }
  
}
