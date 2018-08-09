/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

import {DeclarativeEventListeners, DeclarativeEventListenersConstructor} from '../../declarative-event-listeners';
import {customElement, property} from '../../decorators';

@customElement('declarative-events-mixin-test-element')
export class DeclarativeEventsMixinTestElement extends DeclarativeEventListeners
(PolymerElement) {
  static get template() {
    return html`
      <div id="tapRegion"></div>
    `;
  }

  @property() tapWindowCounter: number = 0;

  constructor() {
    super();
    (this.constructor as DeclarativeEventListenersConstructor)
        ._addDeclarativeEventListener(window, 'tap', this.tapWindowHandler);
  }

  private tapWindowHandler(_e: Event) {
    this.tapWindowCounter++;
  }
}
