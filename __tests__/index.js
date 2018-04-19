const contextVars = require('../index.js');

describe('contextVars', () => {
  const ctx = contextVars({ foo: 123 });

  it('has the initial value', () => {
    expect(ctx.foo).toEqual(123);
  });

  describe('in a nested scope', () => {
    ctx.assign({ foo: 456, baz: 'baz' });

    it('can override the outer value', () => {
      expect(ctx.foo).toEqual(456);
    });

    it('can add new variables', () => {
      expect(ctx.baz).toEqual('baz');
    });

    describe('in a deeply nested scope', () => {
      ctx.assign({ foo: 890 });
      it('overrides again', () => {
        expect(ctx.foo).toEqual(890);
      });
    });
  });

  it('removes variables that were added in a nested scope', () => {
    expect(() => ctx.baz).toThrow();
  });

  it('reverts back to the original settings in tests defined later', () => {
    expect(ctx.foo).toEqual(123);
  });

  describe("accessing a property that hasn't been set", () => {
    it("throws", () => {
      expect(() => ctx.bar).toThrow();
    });
  });

  describe('accessing a property inherited from Object.prototype', () => {
    it('throws', () => {
      expect(() => ctx.hasOwnProperty('foo')).toThrow();
    });
  });

});

describe('using contextvars in a beforeEach hook', () => {
  const ctx = contextVars({ a: 1, b: 2 });

  let object;
  beforeEach(() => {
    object = { a: ctx.a, b: ctx.b };
  });

  it('gets the initial values', () => {
    expect(object).toEqual({ a: 1, b: 2 });
  });

  describe('when overridden in a nested scope', () => {
    ctx.assign({ a: 3 });
    it('gets the overridden values', () => {
      expect(object).toEqual({ a: 3, b: 2 });
    });
  });
});
