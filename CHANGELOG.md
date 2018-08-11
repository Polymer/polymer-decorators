# Change Log

<!-- ## [Unreleased] -->

## [3.0.0] - 2018-08-10
- Updated for Polymer 3.0.
- Now distributed on NPM as
  [`@polymer/decorators`](https://www.npmjs.com/packages/@polymer/decorators).
  Bower is no longer supported.
- [BREAKING] Dropped support for Polymer 2.0. See the
  [`2.x`](https://github.com/Polymer/polymer-decorators/tree/2.x) branch for the
  previous version, which can still be installed from Bower.
- [BREAKING] Now distributed as ES modules, like Polymer itself. HTML imports
  and the `Polymer.decorators` global are no longer available.
- [BREAKING] Dropped support for the Metadata Reflection API. All properties
  must now explicitly set a `type`.

## [2.1.0] - 2018-06-21
- Add @ExportDecoratedItems annotations to decorators, for use by tsickle.

## [2.0.1] - 2018-05-16
- A warning is no longer emitted when a computed property does not have
  a property `type` set.
- The missing `type` warning is now a `console.warn` instead of a
  `console.error`.

## [2.0.0] - 2018-02-28
- [BREAKING] It is now always a compilation error to pass an argument to the
  `@computed` decorator factory that is not a property of the element class.
  Previously this check only applied when the class was explicitly passed as a
  generic parameter. Users must no longer pass the class as a generic parameter.
- [BREAKING] It is now a compilation to apply the `@customElement` decorator to
  a class which does not extend `Polymer.Element`. Polymer >= 2.4 (which
  provides this type) is now a Bower dependency of this package.
- [BREAKING] It is now a compilation error to apply the `@listen` decorator to a
  method that is not compatible with the signature `(e: EventTarget) => void`,
  or that has `private` or `protected` visibility.
- [BREAKING] It is now a compilation error to pass zero targets to the
  `@computed` decorator factory.

## [1.2.0] - 2018-02-21
- An exception is now thrown if both the `tagname` parameter to `@customElement`
  is provided, and the static `is` class property is set (except in the case
  that the `is` property is not an own-property of the class). Previously the
  `is` property would always silently win over the `tagname` when both were set.
- An exception is now thrown if the `@listen` decorator is applied to an element
  that does not have the `DeclarativeEventListeners` mixin applied.
- Decorators now have more constrained type signatures.

## [1.1.1] - 2018-02-16
- Remove npm dependency on `reflect-metadata` package.

## [1.1.0] - 2018-02-14
- Allow `@property` to be used together with `@computed` so that its `type` can
  be set.
- Fix bug where `@observe` could not be used with `Polymer.mixinBehaviors`.

## [1.0.2] - 2018-01-26
- Fix missing generated files from `1.0.1` release.

## [1.0.1] - 2018-01-26
- Fix malformed warning about missing type.

## [1.0.0] - 2018-01-10
- Generated typings for the `DeclarativeEventListeners` mixin are now available
  at `mixins/declarative-event-listeners.d.ts`.
- [BREAKING] The `@observe` decorator now takes its dependencies as a rest
  parameter instead of an array (e.g. `@observe('foo', 'bar')` instead of
  `@observe(['foo', 'bar'])`).
- [BREAKING] Decorators are now located at `polymer-decorators.js` instead of
  `global.js` (same for corresponding `.d.ts` file).

## [0.1.2] - 2018-01-04
- Added `observer` and `computed` properties to the `@property` decorator
  options.
- Added `@listen` decorator and `DeclarativeEventListeners` mixin.
- Fixed bug where use of `Polymer.mixinBehaviors` with `@property` or
  `@computed` would throw an exception relating to the definition of the
  element's "properties" property.

## [0.1.1] - 2017-09-28
- Metadata Reflection polyfill is no longer a bower dependency.

## [0.1.0] - 2017-09-27
- Initial release.
