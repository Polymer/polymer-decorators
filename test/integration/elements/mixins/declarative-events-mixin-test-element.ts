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

/// <reference path="../../bower_components/polymer-decorators/global.d.ts" />

@customElement('declarative-events-mixin-test-element')
class DeclarativeEventsMixinTestElement extends
    Polymer.DeclarativeEventListeners
(Polymer.Element) {
  @property()
  tapWindowCounter: number = 0;

  constructor() {
    super();

    (this.constructor as any)
        ._addDeclarativeEventListener(window, 'tap', this.tapWindowHandler);
  }

  private tapWindowHandler(e: Event) {
    this.tapWindowCounter++;
  }
}
