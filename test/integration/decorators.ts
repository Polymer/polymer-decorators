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
  let declarativeListenerTestElement: DeclarativeListenerTestElement;
  let gestureListenerTestElement: GestureListenerTestElement;

  setup(function() {
    testElement = fixture('test-element-fixture') as TestElement;
    gestureListenerTestElement =
        fixture('gesture-listener-test-element-fixture') as
        GestureListenerTestElement;
    declarativeListenerTestElement =
        fixture('declarative-listener-test-element-fixture') as
        DeclarativeListenerTestElement;
  });

  suite('@customElement', function() {
    test('defines an element', function() {
      chai.assert.instanceOf(testElement, TestElement);
    });

    test('defines an element with an "is" getter', function() {
      const el = fixture('element-with-is') as ElementWithIs;
      chai.assert.instanceOf(el, ElementWithIs);
    });

    test('defines an element with a mixin behavior', function() {
      const el = fixture('mixin-behaviors-test-element-fixture') as MixinBehaviorsTestElement;
      chai.assert.instanceOf(el, MixinBehaviorsTestElement);
      chai.assert.equal(el.elementProperty, 'elementPropertyValue');
      chai.assert.equal((el as any).behaviorProperty, 'behaviorPropertyValue');
    });
  });

  suite('@property', function() {
    test('defines a property', function() {
      testElement.aNum = 999;
      const numDiv = testElement.shadowRoot.querySelector('#num');
      const numText = numDiv.textContent;
      chai.assert.equal(numText, '999');
    });

    test('notify property should fire events', function() {
      let fired = false;
      const fn = function() {
        fired = true;
      };

      testElement.addEventListener('a-num-changed', fn);
      testElement.aNum = 999;
      chai.assert.equal(fired, true);
      testElement.removeEventListener('a-num-changed', fn);
    });

    test('notify should default to false', function() {
      let fired = false;
      const fn = function() {
        fired = true;
      };

      testElement.addEventListener('doesnt-notify-changed', fn);
      testElement.doesntNotify = false;
      chai.assert.equal(fired, false);
      testElement.removeEventListener('doesnt-notify-changed', fn);
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
    
    test('computed property should return computed value', function() {
      testElement.computedString = "new value";
      const propValue = testElement.computedString;
      chai.assert.equal(propValue, 'computed yahoo');
    });
    
    test('observer property function should be invoked', function() {
      testElement.observedString = "new value";
      const propValue = testElement.lastChange;
      chai.assert.equal(propValue, 'new value');
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

  suite('@computed', function() {

    test('defines a computed property', function() {
      testElement.dependencyOne = 'foo';

      const compDiv = testElement.shadowRoot.querySelector('#computed');
      chai.assert.equal(compDiv.textContent, 'foo');
      chai.assert.equal(testElement.computedOne, 'foo');
    });

    test('defines a computed property with multiple arguments', function() {
      testElement.dependencyOne = 'foo';

      const compDiv = testElement.shadowRoot.querySelector('#computedTwo');

      chai.assert.equal(compDiv.textContent, 'foo');
      chai.assert.equal(testElement.computedTwo, 'foo');

      testElement.dependencyTwo = 'bar';

      chai.assert.equal(compDiv.textContent, 'foobar');
      chai.assert.equal(testElement.computedTwo, 'foobar');
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
      chai.assert.equal(divs.length, 4);
    });
  });


  suite('@listen - declarative listeners', function() {
    test('triggers declarative listener on a element', function() {
      // Arrange
      const tapRegion =
          declarativeListenerTestElement.shadowRoot.querySelector('#tapRegion');
      chai.assert.equal(declarativeListenerTestElement.elementClickCounter, 0);

      // Act
      tapRegion.dispatchEvent(
          new CustomEvent('element-event', {bubbles: false}));

      // Assert
      chai.assert.equal(declarativeListenerTestElement.elementClickCounter, 1);
    });

    test('triggers declarative listener on a document', function() {
      // Arrange
      chai.assert.equal(declarativeListenerTestElement.documentClickCounter, 0);

      // Act
      document.dispatchEvent(
          new CustomEvent('document-event', {bubbles: false}));

      // Assert
      chai.assert.equal(declarativeListenerTestElement.documentClickCounter, 1);
    });

    test('triggers declarative listener on a window', function() {
      // Arrange
      chai.assert.equal(declarativeListenerTestElement.windowClickCounter, 0);

      // Act
      window.dispatchEvent(new CustomEvent('window-event', {bubbles: false}));

      // Assert
      chai.assert.equal(declarativeListenerTestElement.windowClickCounter, 1);
    });
  });

  suite('@listen - gesture listeners', function() {
    test('triggers gesture listener on a element', function() {
      // Arrange
      const tapRegion =
          gestureListenerTestElement.shadowRoot.querySelector('#tapRegion');
      chai.assert.equal(gestureListenerTestElement.elementClickCounter, 0);

      // Act
      tapRegion.dispatchEvent(new CustomEvent('click', {bubbles: true}));

      // Assert
      chai.assert.equal(gestureListenerTestElement.elementClickCounter, 1);
    });

    test('triggers gesture listener on a document', function() {
      // Arrange
      chai.assert.equal(gestureListenerTestElement.documentClickCounter, 0);

      // Act
      document.dispatchEvent(new CustomEvent('click', {bubbles: true}));

      // Assert
      chai.assert.equal(gestureListenerTestElement.documentClickCounter, 1);
    });

    test('triggers gesture listener on a window', function() {
      // Arrange
      chai.assert.equal(gestureListenerTestElement.windowClickCounter, 0);

      // Act
      window.dispatchEvent(new CustomEvent('click', {bubbles: true}));

      // Assert
      chai.assert.equal(gestureListenerTestElement.windowClickCounter, 1);
    });

    test(
        'triggers non-gesture event on a class extending gesture listeners',
        function() {
          // Arrange
          const tapRegion =
              gestureListenerTestElement.shadowRoot.querySelector('#tapRegion');
          chai.assert.equal(
              gestureListenerTestElement.nonGestureElementClickCounter, 0);

          // Act
          tapRegion.dispatchEvent(
              new CustomEvent('element-event', {bubbles: false}));

          // Assert
          chai.assert.equal(
              gestureListenerTestElement.nonGestureElementClickCounter, 1);
        });
  });
});
