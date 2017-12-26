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

declare function fixture(id: string): HTMLElement;


suite('Polymer Mixins', function() {
  let declarativeEventsTestElement: DeclarativeEventsMixinTestElement;

  setup(function() {
    declarativeEventsTestElement =
        fixture('declarative-events-mixin-test-element-fixture') as
        DeclarativeEventsMixinTestElement;
  });

  suite('declarative events mixin', function() {
    test('listener registered on window', function() {
      // Arrange
      // Act
      window.dispatchEvent(new CustomEvent('tap', {bubbles: false}));

      // Assert
      chai.assert.equal(declarativeEventsTestElement.tapWindowCounter, 1);
    });
  });
});
