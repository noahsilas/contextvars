# contextvars
rspec inspired context variables for Jest

## Scoped assignment to context variables

```js
const contextVars = require('@nks/contextvars');
const EmailSender = ... // fake unit under test

describe('EmailSender#send', () => {

  // sets up overridable context variables
  const ctx = contextVars({
    to: 'me@noahsilas.com',
    from: 'alice@example.com',
    subject: 'Hey check it out',
  });

  // You can use them in a beforeEach block to set up complex objects.
  // This object will be instantiated with the context set up at each
  // scoping level the way you expect it to be
  let sender;
  beforeEach(() => {
    sender = new EmailSender({
      to: ctx.to,
      from: ctx.from,
      subject: ctx.subject,
    });
  });

  it('sends an email', () => {
    return expect(sender.send()).resolves.to({ sent: true });
  });

  describe('when the subject is blank', () => {

    // You can override variables within a nested scope
    ctx.assign({ subject: '' });

    // Or add entirely new ones
    ctx.assign({ cc: 'bob@example.com' });

    it('throws', () => {
      return expect(() => sender.send()).rejects.toThrow(/empty subject/);
    });
  });
});
```

## Caveats

This library uses Proxy objects (originally defined in ECMAScript 2015), which
don't have universal support.

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Browser_compatibility

## Related Projects

*[Given2](https://github.com/tatyshev/given2):* A more mature project using a
similar beforeAll/beforeEach approach, but requires that variables be defined
with functions. It also has broader test runner support, but uses some tricker
tools to make the raw property access syntax work.
