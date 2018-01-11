[![Travis Build Status](https://travis-ci.org/Polymer/polymer-decorators.svg?branch=master)](https://travis-ci.org/Polymer/polymer-decorators)

# polymer-decorators

A library of [decorators](https://github.com/tc39/proposal-decorators) to help
you write [web
components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) with
[Polymer](https://www.polymer-project.org/) in
[TypeScript](https://www.typescriptlang.org/) in a type safe and convenient
way, like this:

```ts
@customElement('my-element')
class MyElement extends Polymer.Element {

  @property()
  myProperty: string = 'foo';
}
```

## Contents

- [Installation](#installation)
- [Decorator reference](#decorator-reference)
   - [@customElement](#customelementtagname-string)
   - [@property](#propertyoptions-propertyobjects)
   - [@computed](#computedtargets-string)
   - [@observe](#observetargets-string)
   - [@query](#queryselector-string)
   - [@queryAll](#queryallselector-string)
   - [@listen](#listeneventname-string-target-stringeventtarget)
- [Metadata Reflection API](#metadata-reflection-api)
- [FAQ](#faq)
   - [Do I need this library to use Polymer and Typescript?](#do-i-need-this-library-to-use-polymer-and-typescript)
   - [What are the performance costs?](#what-are-the-performance-costs)
   - [Does it work with Polymer 3.0?](#does-it-work-with-polymer-30)
   - [Does it work with Polymer 1.0 or 0.5?](#does-it-work-with-polymer-10-or-05)


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
   /// <reference path="./bower_components/polymer/types/polymer-element.d.ts" />
   /// <reference path="./bower_components/polymer-decorators/polymer-decorators.d.ts" />
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

5. Optionally [configure Metadata Reflection](#metadata-reflection-api) to
   define property types more concisely.


## Decorator reference

These decorator factory functions are defined on the `Polymer.decorators`
global namespace object. You can refer to them directly (e.g.
`@Polymer.decorators.customElement()`), or you may prefer to assign them to
shorter variables:

```ts
const {customElement, property} = Polymer.decorators;
```

### `@customElement(tagname?: string)`

Define a custom element.

`tagname` is the name to register this element with. If omitted, the static
`is` class property is used. Also sets the `is` property on the class if not
already set.

This decorator automatically calls
[`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define)
with your class, so you should not include your own call to that function.

```ts
@customElement('my-element')
class MyElement extends Polymer.Element {
  ...
}
```

### `@property(options?: PropertyObjects)`
Define a Polymer property.

`options` is a [Polymer property
options](https://www.polymer-project.org/2.0/docs/devguide/properties) object.
All standard options are supported, except for `value`; use a property
initializer instead.

If the [Metadata Reflection API](#metadata-reflection-api) is configured, the
`type` option (which determines how Polymer de-serializes Element attributes
for this property) will be inferred from the TypeScript type and can be
omitted.

```ts
@property({type: String, notify: true})
foo: string = 'hello';
```

### `@computed(...targets: string[])`

Define a [computed
property](https://www.polymer-project.org/2.0/docs/devguide/observers#computed-properties).

This decorator must be applied to a
[getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get),
and it must not have an associated setter.

Be sure to only read properties that you have declared as dependencies in the
computed property definition, otherwise the computed property will not update
as expected.

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

### `@observe(...targets: string[])`

Define a [complex property
observer](https://www.polymer-project.org/2.0/docs/devguide/observers#complex-observers).

`targets` can be a single dependency expression, or an array of them. All
observer dependency syntaxes are supported (property names, sub-properties,
splices, wildcards, etc.).

```ts
@observe('foo', 'bar')
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

### `@query(selector: string)`

Replace this property with a getter that calls
[`querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector)
on the shadow root with the given `selector`. Use this to get a typed handle to
a node in your template.

```ts
@query('my-widget')
widget: MyWidgetElement;
```

### `@queryAll(selector: string)`

Replace this property with a getter that calls
[`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll)
on the shadow root with the given `selector`. Use this to get a typed handle to
a set of nodes in your template.

```ts
@queryAll('my-widget')
widgets: NodeListOf<MyWidgetElement>
```

### `@listen(eventName: string, target: string|EventTarget)`

Add an event listener for `eventName` on `target`. `target` can be an object
reference, or the string id of an element in the shadow root.

Note that a `target` referenced by id must be defined statically in the
top-level element template (e.g. not in a `<dom-if>`), because the `$` id map
is used to find the target upon `ready()`.

To use `@listen`, your element must apply the
[`DeclarativeEventListeners`](https://github.com/Polymer/polymer-decorators/blob/master/mixins/declarative-event-listeners.html)
mixin, which is supplied with this package.

```ts
/// <reference path="./bower_components/polymer-decorators/mixins/declarative-event-listeners.d.ts" />

class MyElement extends Polymer.DeclarativeEventListeners(Polymer.Element) {

  @listen('scroll', document)
  protected onDocumentScroll(event: Event) {
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
  protected onTapRedButton(event: Event) {
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

Also note that the Metadata Reflection polyfill is **47 KB** (7 KB gzipped), so
be sure to consider strongly whether the cost of shipping this polyfill is
worth the convenience for your project.

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


## FAQ

### Do I need this library to use Polymer and TypeScript?
No, you can also use Polymer and TypeScript without additional client
libraries. As of Polymer 2.4, TypeScript type declarations are available in the
[`types/`](https://github.com/Polymer/polymer/tree/master/types) directory. The
advantage of using these decorators are additional type safety and convenience.
For simple elements and applications, it may be preferable to use the vanilla
Polymer API, like this:

```ts
/// <reference path="./bower_components/polymer/types/polymer-element.d.ts" />

class MyElement extends Polymer.Element {
  static is = 'my-element';

  static properties = {
    myProperty: {
      type: String
    }
  };

  myProperty: string = 'foo';
}

customElements.define(MyElement.is, MyElement);
```

### What are the performance costs?
The additional JavaScript served for this library is aproximately 8 KB (4 KB
gzipped). Benchmarks are not currently available, but we expect minor
performance costs. The library generally works by building standard Polymer
property definitions at element definition time, so performance costs should be
seen at application startup.

### Does it work with Polymer 3.0?
Not yet, but support is planned. See issue
[#10](https://github.com/Polymer/polymer-decorators/issues/10).

### Does it work with Polymer 1.0 or 0.5?
No, this library is not compatible with Polymer 1.0 or earlier, because it
depends on the ES6 class-based component definition style introduced in Polymer
2.0.  Community-maintained TypeScript decorator options for Polymer 1.0 include
[nippur72/PolymerTS](https://github.com/nippur72/PolymerTS) and
[Cu3PO42/polymer-decorators](https://github.com/Cu3PO42/polymer-decorators).
