/**
 * TODO Remove this file when official typings are released with Polymer 2.4.
 */

declare namespace Polymer {
  class Element extends HTMLElement {
    ready(): void;
    static _addDeclarativeEventListener(
        target: EventTarget|string,
        eventName: string,
        handler: any): void
  }

  function GestureEventListeners<T>(element: T): T;
  function DeclarativeEventListeners<T>(element: T): T;

  function mixinBehaviors<T>(
      behaviors: object | object[], klass: {new (): T}): {new (): T};
}
