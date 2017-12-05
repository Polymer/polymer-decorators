// TODO Complete this and distribute with Polymer itself.

declare namespace Polymer {
  class Element extends HTMLElement {
    ready(): void;
    _addDeclarativeEventListener(
        target: EventTarget|string,
        eventName: string,
        handler: any): void
  }

  /**TODO: Remove :any when Polymer typings are complete.
   *    https://github.com/Polymer/polymer-decorators/issues/9
   */
  function GestureEventListeners<T>(element: T): T;
  function DeclarativeEventListeners<T>(element: T): T;
}
