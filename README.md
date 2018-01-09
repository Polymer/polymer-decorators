[![Travis Build Status](https://travis-ci.org/Polymer/polymer-decorators.svg?branch=master)](https://travis-ci.org/Polymer/polymer-decorators)

# polymer-decorators

TypeScript decorators for Polymer 2.0.

## Contents

- [Installation](#installation)
- [Decorator reference](#decorator-reference)
   - [@customElement](#customelement)
   - [@property](#property)
   - [@computed](#computed)
   - [@observe](#observe)
   - [@query](#query)
   - [@queryAll](#queryall)
   - [@listen](#listen)
- [Metadata Reflection API](#metadata-reflection-api)
- [Polymer 1.0](#polymer-10)


## Installation

1. Install the decorators with Bower (NPM support coming with Polymer 3.0):

   ```sh
   bower install --save Polymer/polymer-decorators
   ```

2. Import the decorator library in your component definitions:

   ```html
   <link rel="import" href="/bower_components/polymer-decorators/polymer-decorators.html">
   ```

3. Include type declarations for Polymer (available as of version 2.4) and the
   Polymer decorators in one your TypeScript source files. You can also add
   them as sources in your `tsconfig.json` with `include` or `files`.

   ```ts
   /// <reference path="../bower_components/polymer/types/polymer-element.d.ts" />
   /// <reference path="../bower_components/polymer-decorators/global.d.ts" />
   ```

4. Enable the
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

5. Optionally [configure Metadata Reflection](#metadata-reflection-api) to define
   properties more concisely.


## Decorator reference

The decorator functions are defined on the `Polymer.decorators` global
namespace object. You can refer to them directly (e.g.
`@Polymer.decorators.customElement()`), or you may prefer to assign them to
shorter variables:

```ts
const {customElement, property} = Polymer.decorators;
```

### `@customElement`

Define a custom element.

`tagname` is the name to register this element with. If omitted, the static
`is` class property is used. Also sets the `is` property on the class if not
already set.

```ts
@customElement('my-element')
class MyElement extends Polymer.Element {
  ...
}
```

### `@property`
Define a Polymer property.

`options` is a [Polymer property
options](https://www.polymer-project.org/2.0/docs/devguide/properties) object.
All standard options are supported, except for `value`; use a property
initializer instead. If the [Metadata Reflection API](#metadata-reflection-api)
is configured, the `type` option will be inferred from the TypeScript type and
can be omitted.

```ts
@property({type: String, notify: true})
foo: string = 'hello';
```

### `@computed`

Define a [computed
property](https://www.polymer-project.org/2.0/docs/devguide/observers#computed-properties).

This decorator must be applied to a
[getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get),
and it must not have an associated setter.

```ts
@computed('foo', 'bar')
get fooBar() {
  return this.foo + this.bar;
}
```

For optional additional type saftey, pass your custom element class as a
generic parameter. This allows TypeScript to check that all of your
dependencies are valid properties.

```ts
@computed<MyElement>('foo', 'bar')
get fooBar() {
  return this.foo + this.bar;
}
```

To define a computed property with more complex dependency expressions for
which you may want to receive change values as arguments (e.g. sub-properties,
splices, wildcards, etc.), or to set additional property options, define a
standard property and set its `computed` option.

```ts
@property({computed: 'computeBaz(foo.*)', reflectToAttribute: true})
baz: string;

private computeBaz(fooChangeRecord: object) {
  ...
}
```

### `@observe`

Define a [complex property
observer](https://www.polymer-project.org/2.0/docs/devguide/observers#complex-observers).

`targets` can be a single dependency expression, or an array of them. All
observer dependency syntaxes are supported (property names, sub-properties,
splices, wildcards, etc.).

```ts
@observe('foo')
private fooChanged(newFoo: string) {
  console.log(`foo is now: ${newFoo}`);
}

@observe(['foo', 'bar'])
private fooBarChanged(newFoo: string, newBar: string) {
  console.log(`foo is now: ${newFoo}, bar is now: ${newBar}`);
}

@observe('baz.*')
private bazChanged(changeRecord: object) {
  console.log('baz changed deeply');
}
```

To define a [simple property
observer](https://www.polymer-project.org/2.0/docs/devguide/observers#simple-observers),
which receives both the old and new values, set the `observer` option on the
property you want to observe to the observer name or (preferably) function
reference.

```ts
@property({observer: MyElement.prototype.bazChanged})
baz: string;

private bazChanged(oldValue: string, newValue: string) {
  console.log(`baz was: ${oldValue}, and is now: ${newValue}`);
}
```

### `@query`

Define a getter that calls
[`querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector)
on the shadow root with the given `selector`.

```ts
@query('my-widget')
widget: MyWidgetElement;
```

### `@queryAll`

Define a getter that calls
[`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll)
on the shadow root with the given `selector`.

```ts
@queryAll('my-widget')
widgets: NodeListOf<MyWidgetElement>
```

### `@listen`

Add an event listener for `eventName` on `target`. `target` can be an object
reference, or the string id of an element in the shadow root.

Note that a `target` referenced by id must be defined statically in the
top-level element template (e.g. not in a `<dom-if>`), because the `$` id map
is used to find the target upon `ready()`.

To use `@listen`, your element must apply the
[`DeclarativeEventListeners`](https://github.com/Polymer/polymer-decorators/blob/master/mixins/declarative-event-listeners.html)
mixin, which is supplied with this package.

```ts
class MyElement extends Polymer.DeclarativeEventListeners(Polymer.Element) {

  @listen('scroll', document)
  private onDocumentScroll(ev: Event) {
    this.scratchChalkboard();
  }
}
```

Note that to listen for Polymer [gesture
events](https://www.polymer-project.org/2.0/docs/devguide/gesture-events) such
as `tap` and `track`, your element must also apply the
[`GestureEventListeners`](https://github.com/Polymer/polymer/blob/master/lib/mixins/gesture-event-listeners.html)
mixin, which is supplied with Polymer.

```ts
class MyElement extends
    Polymer.GestureEventListeners(
    Polymer.DeclarativeEventListeners(
    Polymer.Element)) {

  @listen('tap', 'red-button')
  private onTapRedButton(ev: Event) {
    this.launchMissile();
  }
}
```


## Metadata Reflection API

To annotate your Polymer property types more concisely, you may configure
experimental support for the [Metadata Reflection
API](https://rbuckton.github.io/reflect-metadata/). Note that this API is [not
yet a formal ECMAScript
proposal](https://github.com/rbuckton/reflect-metadata/issues/9), but a
polyfill is available, and TypeScript has experimental support.

Without Metadata Reflection, the Polymer property type must be passed
explicitly to the decorator factory, because type information is not otherwise
available at runtime:

```ts
@property({type: String})
myProperty: string;
```

With Metadata Reflection, the TypeScript type annotation alone is sufficient,
because the compiler will emit type information that the decorator can use to
automatically set the Polymer property type:

```ts
@property()
myProperty: string;
```

To enable Metadata Reflection:

1. Enable the
   [`emitDecoratorMetadata`](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata)
   TypeScript compiler setting. Use the `--emitDecoratorMetadata` flag, or
   update your `tsconfig.json` to include:

   ```js
   {
     "compilerOptions": {
       "emitDecoratorMetadata": true
     }
   }
   ```

2. Install the Metadata Reflection API runtime polyfill from
   [rbuckton/reflect-metadata](https://github.com/rbuckton/reflect-metadata):

   ```sh
   bower install --save rbuckton/reflect-metadata
   ```

3. Load the polyfill at the top-level of your application, and in your tests:

   ```html
   <script src="/bower_components/reflect-metadata/Reflect.js"></script>
   ```


## Polymer 1.0

This library is not compatible with Polymer 1.0 or earlier, because it depends
on the ES6 class-based component definition style introduced in Polymer 2.0.
Community-maintained TypeScript decorator options for Polymer 1.0 include
[nippur72/PolymerTS](https://github.com/nippur72/PolymerTS) and
[Cu3PO42/polymer-decorators](https://github.com/Cu3PO42/polymer-decorators).
