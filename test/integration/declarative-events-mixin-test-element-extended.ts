/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */

/// <reference path="bower_components/polymer-decorators/global.d.ts" />

class BaseElement extends Polymer.DeclarativeEventListeners
(Polymer.Element) {
  @property()
  tapWindowCounter: number = 0;

  @property()
  tapElementByIdCounter: number = 0;

  static get listeners() {
    return [
      {handler: 'tapWindowHandler', node: window, eventName: 'tap'},
      {handler: 'tapElementByIdHandler', node: 'tapRegion', eventName: 'tap'}
    ]
  }

  private tapWindowHandler(e: Event) {
    this.tapWindowCounter++;
  }

  private tapElementByIdHandler(e: Event) {
    this.tapElementByIdCounter++;
  }
}

@customElement('declarative-events-mixin-test-element-extended')
class DeclarativeEventsMixinTestElementExtended extends BaseElement {
  @property()
  extendedRegionTapCounter: number = 0;

  static get listeners() {
    return super.listeners.concat([{
      handler: 'extendedRegionTapHandler',
      node: 'tapRegionExtended',
      eventName: 'tap'
    }]);
  }

  private extendedRegionTapHandler(e: Event) {
    this.extendedRegionTapCounter++;
  }
}