⚠ **Experimental!** This repository is a work in progress and may not work as expected. ⚠

[![Travis Build Status](https://travis-ci.org/Polymer/polymer-decorators.svg?branch=master)](https://travis-ci.org/Polymer/polymer-decorators)

# polymer-decorators

TypeScript decorators for Polymer 2.0.

### Installation

- Install the decorators:
  ```sh
  bower install --save Polymer/polymer-decorators
  ```

- Import the decorator library in your component definitions:
  ```html
  <link rel="import" href="/bower_components/polymer-decorators/polymer-decorators.html">
  ```

- Include the decorator type declarations in one of the source files in your
  TypeScript project (be sure to update the reference below with the correct
  relative path):
  ```ts
  /// <reference path="../bower_components/polymer-decorators/global.d.ts" />
  ```

- Enable the
  [`experimentalDecorators`](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata)
  TypeScript compiler setting. Use the `--experimentalDecorators` flag, or
  update your `tsconfig.json` to include:
  ```js
  {
    "compilerOptions": {
      "experimentalDecorators": true
    }
  }
  ```

- Define a custom element:
  ```ts
  @Polymer.decorators.customElement('my-element')
  class MyElement extends Polymer.Element {

    @Polymer.decorators.property({type: String})
    myProperty: string = 'Hello';
  }
  ```

- Optional: [configure Metadata Reflection](#metadata-reflection-api) to define
  properties more concisely.

## Metadata Reflection API

To annotate your Polymer property types more concisely, you may configure
experimental support for the [Metadata Reflection
API](https://rbuckton.github.io/reflect-metadata/). Note that this API is [not
yet a formal ECMAScript
proposal](https://github.com/rbuckton/reflect-metadata/issues/9), but a
polyfill is available, and TypeScript has experimental support.

```ts
// Without Metadata Reflection, the type must be passed explicitly to the
// decorator factory, because type information is not available at runtime.
@property({type: String})
myProperty: string;

// With Metadata Reflection, the TypeScript type annotation is sufficient,
// because the compiler will emit type information automatically.
@property()
myProperty: string;
```

To enable Metadata Reflection:

- Enable the
  [`emitDecoratorMetadata`](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata)
  TypeScript compiler setting. Use the `--emitDecoratorMetadata` flag, or update your
  `tsconfig.json` to include:
  ```js
  {
    "compilerOptions": {
      "emitDecoratorMetadata": true
    }
  }
  ```

- Install the Metadata Reflection API runtime polyfill from
  [rbuckton/reflect-metadata](https://github.com/rbuckton/reflect-metadata):
  ```sh
  bower install --save rbuckton/reflect-metadata
  ```

- Load the polyfill at the top-level of your application, and in your tests:
  ```html
  <script src="/bower_components/reflect-metadata/Reflect.js"></script>
  ```

## Example

```typescript
import {customElement, property, query, queryAll, observe} from '../polymer-decorators/typescript/decorators.js';

// This sets the static `is` property and registers the element
@customElement('test-element')
class TestElement extends Polymer.Element {

  // @property replaces the static `property` getter.
  // The type is read from the type annotation, `notify` is the same as in
  // plain Polymer
  @property({notify: true})
  foo: number = 42;

  // @property replaces the static `property` getter.
  // The type is read from the type annotation, `reflectToAttribute` is the same as in
  // plain Polymer
  @property({reflectToAttribute: true})
  reflectFoo: string = 'opened';

  // @property replaces the static `property` getter.
  // The type is read from the type annotation, `readOnly` is the same as in
  // plain Polymer.  Read only properties must use a private generated
  // setter of the convention _setProperty(value). ex. _setReadOnlyBar(42)
  @property({readOnly: true})
  readOnlyBar: number;

  // This property doesn't fire bar-changed events
  @property()
  bar: string = 'yes';

  // @query replaces the property with a getter that querySelectors() in
  // the shadow root. Use this for type-safe access to internal nodes.
  @query('h1')
  header: HTMLHeadingElement;

  @queryAll('input')
  allInputs: HTMLInputElement[];

  // This method will be called when `foo` changes
  @observe('foo')
  private _fooChanged(newValue: number) {
    console.log(`foo is now: ${newValue}`);
  }

  // @observe can take an array of properties
  @observe(['foo', 'bar'])
  private _fooBarChanged(newFoo: number, newBar: string) {
    console.log(`foo is now: ${newFoo}, bar is now ${newBar}`);
  }

}
```

## <strike>Polymer 1.0</strike>

This library is not compatible with Polymer 1.0 or earlier, because it depends
on the ES6 class-based component definition style introduced in Polymer 2.0.
Community-maintained TypeScript decorator options for Polymer 1.0 include
[nippur72/PolymerTS](https://github.com/nippur72/PolymerTS) and
[Cu3PO42/polymer-decorators](https://github.com/Cu3PO42/polymer-decorators).
