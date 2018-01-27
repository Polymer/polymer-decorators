# Change Log

<!-- ## [Unreleased] -->

## [1.0.2] - 2018-01-26
- Fix missing generated files from `1.0.1` release.

## [1.0.1] - 2018-01-26
- Fix malformed warning about missing type.

## [1.0.0] - 2018-01-10
- Generated typings for the `DeclarativeEventListeners` mixin are now available at `mixins/declarative-event-listeners.d.ts`.
- [BREAKING] The `@observe` decorator now takes its dependencies as a rest parameter instead of an array (e.g. `@observe('foo', 'bar')` instead of `@observe(['foo', 'bar'])`).
- [BREAKING] Decorators are now located at `polymer-decorators.js` instead of `global.js` (same for corresponding `.d.ts` file).

## [0.1.2] - 2018-01-04
- Added `observer` and `computed` properties to the `@property` decorator options.
- Added `@listen` decorator and `DeclarativeEventListeners` mixin.
- Fixed bug where use of `Polymer.mixinBehaviors` with `@property` or `@computed` would throw an exception relating to the definition of the element's "properties" property.

## [0.1.1] - 2017-09-28
- Metadata Reflection polyfill is no longer a bower dependency.

## [0.1.0] - 2017-09-27
- Initial release.
