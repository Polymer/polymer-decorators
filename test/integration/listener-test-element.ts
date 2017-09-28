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

@customElement('listener-test-element')
class ListenerTestElement extends Polymer.GestureEventListeners
(Polymer.Element) {
  @property()
  elementClickCounter: number = 0;

  @property()
  documentClickCounter: number = 0;

  @property()
  windowClickCounter: number = 0;

  @property()
  invalidElementClickCounter: number = 0;

  @property()
  elementGestureClickCounter: number = 0;

  @property()
  documentGestureClickCounter: number = 0;

  @property()
  windowGestureClickCounter: number = 0;

  @listen('element-event', 'tapRegion')
  private _elementTapped() {
    this.elementClickCounter++;
  }

  @listen('document-event', document)
  private _documentTapped() {
    this.documentClickCounter++;
  }

  @listen('window-event', window)
  private _windowTapped() {
    this.windowClickCounter++;
  }

  @gestureEventListener(
      Polymer.decorators.GestureEventType.tap, 'gestureRegion')
  private _elementGestureEventTapped() {
    this.elementGestureClickCounter++;
  }

  @gestureEventListener(Polymer.decorators.GestureEventType.tap, document)
  private _documentGestureEventTapped() {
    this.documentGestureClickCounter++;
  }

  @gestureEventListener(Polymer.decorators.GestureEventType.tap, window)
  private _windowGestureEventTapped() {
    this.windowGestureClickCounter++;
  }
}
