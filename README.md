[![NPM version](http://img.shields.io/npm/v/@polymer/decorators.svg)](https://www.npmjs.com/package/@polymer/decorators)
[![Travis Build Status](https://travis-ci.org/Polymer/polymer-decorators.svg?branch=master)](https://travis-ci.org/Polymer/polymer-decorators/branches)

# polymer-decorators

A library of [decorators](https://github.com/tc39/proposal-decorators) to help
you write [web
components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) with
[Polymer](https://www.polymer-project.org/) in
[TypeScript](https://www.typescriptlang.org/) in a type safe and convenient
way, like this:

```ts
import {PolymerElement} from '@polymer/polymer';
import {customElement, property} from '@polymer/decorators';

@customElement('my-element')
class MyElement extends PolymerElement {

  @property({type: String})
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
- [FAQ](#faq)
   - [Do I need this library to use Polymer and Typescript?](#do-i-need-this-library-to-use-polymer-and-typescript)
   - [What are the performance costs?](#what-are-the-performance-costs)
   - [Does it work with previous versions of Polymer?](#does-it-work-with-previous-versions-of-polymer)
   - [What happened to Metadata Reflection support?](#what-happened-to-metadata-reflection-support)


## Installation

1. Install the decorators with NPM.

   ```sh
   npm install --save @polymer/decorators
   ```

2. Import decorators in your component definitions:

   ```js
   import {customElement, property} from '@polymer/decorators';
   ```

3. Enable the
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

## Decorator reference

### `@customElement(tagname?: string)`

Define a custom element.

If `tagname` is provided, it will be used as the custom element name, and will
be assigned to the class static `is` property. If `tagname` is omitted, the
static `is` property of the class will be used instead. If neither exist, or if
both exist but have different values (except in the case that the `is` property
is not an own-property of the class), an exception is thrown.

This decorator automatically calls
[`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define)
with your class, so you should not include your own call to that function.

```ts
@customElement('my-element')
class MyElement extends PolymerElement {
  ...
}
```

### `@property(options?: PropertyObjects)`
Define a Polymer property.

`options` is a [Polymer property
options](https://www.polymer-project.org/3.0/docs/devguide/properties) object.
All standard options are supported, except for `value`; use a property
initializer instead. `type` is required, and must be one of the Polymer property
constructor types (`String`, `Object`, etc.).

```ts
@property({type: String, notify: true})
foo: string = 'hello';
```

### `@computed(...targets: string[])`

Define a [computed
property](https://www.polymer-project.org/3.0/docs/devguide/observers#computed-properties).

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

To define a computed property with more complex dependency expressions for
which you may want to receive change values as arguments (e.g. sub-properties,
splices, wildcards, etc.), or to set additional property options, define a
standard property and set its `computed` option.

```ts
@property({computed: 'computeBaz(foo.*)', reflectToAttribute: true, type: String})
baz: string;

private computeBaz(fooChangeRecord: object) {
  ...
}
```

### `@observe(...targets: string[])`

Define a [complex property
observer](https://www.polymer-project.org/3.0/docs/devguide/observers#complex-observers).

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
observer](https://www.polymer-project.org/3.0/docs/devguide/observers#simple-observers),
which receives both the old and new values, set the `observer` option on the
property you want to observe to the observer name or (preferably) function
reference.

```ts
@property({observer: MyElement.prototype.bazChanged, type: String})
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
reference, or the string id of an element in the shadow root. The method must
match the signature `(e: Event) => void`, and must have `public` visibility.

Note that a `target` referenced by id must be defined statically in the
top-level element template (e.g. not in a `<dom-if>`), because the `$` id map
is used to find the target upon `ready()`.

To use `@listen`, your element must apply the
[`DeclarativeEventListeners`](https://github.com/Polymer/polymer-decorators/blob/master/src/declarative-event-listeners.js)
mixin, which is supplied with this package.

```ts
import {DeclarativeEventListeners} from '@polymer/decorators/lib/declarative-event-listeners.js';

class MyElement extends DeclarativeEventListeners(PolymerElement) {
  @listen('scroll', document)
  onDocumentScroll(event: Event) {
    this.scratchChalkboard();
  }
}
```

Note that to listen for Polymer [gesture
events](https://www.polymer-project.org/3.0/docs/devguide/gesture-events) such
as `tap` and `track`, your element must also apply the
[`GestureEventListeners`](https://github.com/Polymer/polymer/blob/master/lib/mixins/gesture-event-listeners.js)
mixin, which is supplied with Polymer.

```ts
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import {DeclarativeEventListeners} from '@polymer/decorators/lib/declarative-event-listeners.js';

class MyElement extends
    GestureEventListeners(
    DeclarativeEventListeners(
    PolymerElement)) {

  @listen('tap', 'red-button')
  onTapRedButton(event: Event) {
    this.launchMissile();
  }
}
```

## FAQ

### Do I need this library to use Polymer and TypeScript?
No, you can also use Polymer and TypeScript without any additional libraries.
Polymer 3.0 ships with declarations to let you use the API with TypeScript
directly.  The advantage of using these decorators are additional type safety
and convenience. For simple elements and applications, it may be preferable to
use the vanilla Polymer API, like this:

```ts
import {PolymerElement, html} from '@polymer/polymer';

class MyElement extends PolymerElement {
  static get properties() {
    myProperty: String
  };

  static get template() {
    return html`<p>Hello World</p>`;
  }

  myProperty: string = 'foo';
}

customElements.define('my-element', MyElement);
```

### What are the performance costs?
The additional JavaScript served for this library is approximately 2KB gzipped
(0.6KB minified + gzipped). Benchmarks are not currently available, but we
expect minor performance costs. The library generally works by building standard
Polymer property definitions at element definition time, so performance costs
should be seen at application startup.

### Does it work with previous versions of Polymer?
An earlier version of this library can be used with Polymer 2.0, and installed
with Bower. See the
[`2.x`](https://github.com/Polymer/polymer-decorators/tree/2.x) branch.

This library is not compatible with Polymer 1.0 or earlier, because it depends
on the ES6 class-based component definition style introduced in Polymer 2.0.
Community-maintained TypeScript decorator options for Polymer 1.0 include
[nippur72/PolymerTS](https://github.com/nippur72/PolymerTS) and
[Cu3PO42/polymer-decorators](https://github.com/Cu3PO42/polymer-decorators).

### What happened to Metadata Reflection support?
Support for the [Metadata Reflection
API](https://rbuckton.github.io/reflect-metadata/) was removed in version
`3.0.0`. This was done primarily because the type metadata emitted by TypeScript
is often incorrect for our purpose (e.g. `string|undefined` produces `Object`
instead of `String`), leading to unexpected bugs. Additionally, the required
polyfill is fairly large (7KB gzipped), and standardization of the proposal does
not currently appear to be progressing.
