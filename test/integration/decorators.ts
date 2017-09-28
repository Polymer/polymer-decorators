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

declare function fixture(id: string): HTMLElement;

suite('TypeScript Decorators', function() {
  let testElement: TestElement;
  let listenerTestElement: ListenerTestElement;

  setup(function() {
    testElement = fixture('test-element-fixture') as TestElement;
    listenerTestElement =
        fixture('listener-test-element-fixture') as any;  // TODO FIX THIS
  });

  suite('@customElement', function() {
    test('defines an element', function() {
      chai.assert.instanceOf(testElement, TestElement);
    });

  });

  suite('@property', function() {

    test('defines a property', function() {
      testElement.aNum = 999;
      const numDiv = testElement.shadowRoot.querySelector('#num');
      const numText = numDiv.textContent;
      chai.assert.equal(numText, '999');
    });

    test(
        'reflectToAttribute property should be reflected as an attribute',
        function() {
          testElement.reflectedString = 'nice';
          const attributeText = testElement.getAttribute('reflected-string');
          chai.assert.equal(attributeText, 'nice');
        });

    test('readonly property should not be changeable', function() {
      testElement.readOnlyString = 'new value';
      const propValue = testElement.readOnlyString;
      chai.assert.equal(propValue, 'initial value');
    });

  });

  suite('@observe', function() {

    test('calls a method when a single observed property changes', function() {
      testElement.aNum = 999;
      chai.assert.equal(testElement.lastNumChange, 999);
    });

    test('calls a method when multiple observed properties change', function() {
      testElement.aNum = 999;
      chai.assert.equal(testElement.lastMultiChange[0], 999);
      testElement.aString = 'yahoo';
      chai.assert.equal(testElement.lastMultiChange[1], 'yahoo');
    });


  });

  suite('@query', function() {

    test('queries the shadow root', function() {
      const numDiv = testElement.numDiv;
      chai.assert.equal(numDiv.id, 'num');
    });

  });

  suite('@queryAll', function() {

    test('queries the shadow root', function() {
      const divs = testElement.divs;
      chai.assert.equal(divs.length, 2);
    });

  });


  suite('@listen', function() {

    test('triggers imperative listener on a element', function() {
      // Arrange
      const tapRegion =
          listenerTestElement.shadowRoot.querySelector('#tapRegion');
      chai.assert.equal(listenerTestElement.elementClickCounter, 0);

      // Act
      tapRegion.dispatchEvent(
          new CustomEvent('element-event', {bubbles: false}));

      // Assert
      chai.assert.equal(listenerTestElement.elementClickCounter, 1);
    });

    test('triggers imperative listener on a document', function() {
      // Arrange
      chai.assert.equal(listenerTestElement.documentClickCounter, 0);

      // Act
      document.dispatchEvent(
          new CustomEvent('document-event', {bubbles: false}));

      // Assert
      chai.assert.equal(listenerTestElement.documentClickCounter, 1);
    });

    test('triggers imperative listener on a window', function() {
      // Arrange
      chai.assert.equal(listenerTestElement.windowClickCounter, 0);

      // Act
      window.dispatchEvent(new CustomEvent('window-event', {bubbles: false}));

      // Assert
      chai.assert.equal(listenerTestElement.windowClickCounter, 1);
    });

  });

  suite('@gestureEventListener', function() {

    test('triggers gesture listener on a element', function() {
      // Arrange
      const gestureRegion =
          listenerTestElement.shadowRoot.querySelector('#gestureRegion');
      chai.assert.equal(listenerTestElement.elementGestureClickCounter, 0);

      // Act
      gestureRegion.dispatchEvent(new CustomEvent('click', {bubbles: true}));

      // Assert
      chai.assert.equal(listenerTestElement.elementGestureClickCounter, 1);
    });

    test('triggers gesture listener on a document', function() {
      // Arrange
      chai.assert.equal(listenerTestElement.documentGestureClickCounter, 0);

      // Act
      document.dispatchEvent(new CustomEvent('click', {bubbles: true}));

      // Assert
      chai.assert.equal(listenerTestElement.documentGestureClickCounter, 1);
    });

    test('triggers gesture listener on a window', function() {
      // Arrange
      chai.assert.equal(listenerTestElement.windowGestureClickCounter, 0);

      // Act
      window.dispatchEvent(new CustomEvent('click', {bubbles: true}));

      // Assert
      chai.assert.equal(listenerTestElement.windowGestureClickCounter, 1);
    });

  });
});
