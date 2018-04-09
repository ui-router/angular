import { equals } from '@uirouter/core';
declare var testablePromise;

beforeEach(function() {
  jasmine.addMatchers(<any>{
    toEqualData: function() {
      return {
        compare: function(actual, expected) {
          return { pass: equals(actual, expected) };
        },
      };
    },

    toEqualValues: function() {
      return {
        compare: function(actual, expected) {
          const pass = Object.keys(expected).reduce((acc, key) => acc && equals(actual[key], expected[key]), true);
          return { pass };
        },
      };
    },

    toBeResolved: () => ({
      compare: actual => ({
        pass: !!testablePromise(actual).$$resolved,
      }),
    }),

    toHaveClass: function() {
      return {
        compare: function(actual, clazz) {
          const classes = Array.prototype.slice.call(actual[0].classList);
          const pass = classes.indexOf(clazz) !== -1;
          const message = pass ? undefined : "Expected '" + actual + "' to have class '" + clazz + "'.";

          return { pass: pass, message: message };
        },
      };
    },
  });
});
