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

@customElement('gesture-listener-test-element')
class GestureListenerTestElement extends Polymer.DeclarativeEventListeners
(Polymer.GestureEventListeners(Polymer.Element)) {
  @property()
  elementClickCounter: number = 0;

  @property()
  nonGestureElementClickCounter: number = 0;

  @property()
  documentClickCounter: number = 0;

  @property()
  windowClickCounter: number = 0;

  @listen('tap', 'tapRegion')
  private elementTapEventHandler(e: Event) {
    this.elementClickCounter++;
  }

  @listen('tap', document)
  private documentTapEventHandler(e: Event) {
    this.documentClickCounter++;
  }

  @listen('tap', window)
  private windowTapEventHandler(e: Event) {
    this.windowClickCounter++;
  }

  @listen('element-event', 'tapRegion')
  private elementEventHandler(e: Event) {
    this.nonGestureElementClickCounter++;
  }
}
