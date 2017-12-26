<!--
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
-->
<link rel="import" href="../../polymer/lib/utils/boot.html">
<link rel="import" href="../../polymer/lib/utils/mixin.html">

<script>
  (function () {
    'use strict';
    /**
    * @const {Polymer.DeclarativeEventListeners}
    */
    const declarativeListeners = Polymer.DeclarativeEventListeners;
    /**
    * Element class mixin that provides API for adding declarative event
    * listeners nodes.
    *
    * The API is designed to be compatible with override points implemented
    * in `Polymer.TemplateStamp` such that declarative event listeners in
    * templates will support gesture events when this mixin is applied along with
    * `Polymer.TemplateStamp`.
    *
    * @mixinFunction
    * @polymer
    * @memberof Polymer
    * @summary Element class mixin that provides API for adding declarative event
    * listeners nodes
    */
    Polymer.DeclarativeEventListeners = Polymer.dedupingMixin(superClass => {

      /**
      * @polymer
      * @mixinClass
      * @implements {Polymer_DeclarativeEventListeners}
      * @property listeners {object} Stores the declared event listeners to be subscribed to 
      * durning ready().
      */
      class DeclarativeEventListeners extends superClass {

        ready() {
          super.ready();
          if (!this.constructor.hasOwnProperty('listeners')) {
            this.constructor.listeners = [];
          }

          this.constructor.listeners.forEach(listener => {
            const targetElement = typeof listener.target === 'string' ? this.$[listener.target] : listener.target;
            this._addEventListenerToNode(targetElement, listener.eventName, listener.handler.bind(this));
          });
        }

        /**
        * Adds to stored listeners to subscribe to on ready() 
        *
        * @param {string|!Object} target Element/node for listener to target.
        * @param {string} eventName Name of event to listen for.
        * @param {function} handler Function which receives the notification.
        * @return {void}
        * @private
        */
        static _addDeclarativeEventListener(target, eventName, handler) {
          if (!this.hasOwnProperty('listeners')) {
            this.listeners = [];
          }

          this.listeners.push({ target, eventName, handler });
        }
      }

      return DeclarativeEventListeners;
    });
  })();
</script>