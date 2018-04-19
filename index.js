function contextVars(initialValue) {

  const contextStack =  [initialValue];

  const container = { };

  beforeEach(function () {
    // merge any initial context into the container
    Object.assign(container, ...contextStack);
  });

  afterEach(function () {
    // empty out the container so the next test starts fresh
    Object.keys(container).forEach(key => delete container[key]);
  });

  return new Proxy(container, {
    get(target, property, receiver) {
      if (property === 'assign') {
        return function (newValues) {
          beforeAll(function () {
            contextStack.push(newValues);
          });
          afterAll(function () {
            contextStack.pop()
          });
        }
      }

      if (container.hasOwnProperty(property)) {
        return container[property];
      }
      throw new Error(`Context doesn't have '${property}' assigned'`);
    }
  });
}

module.exports = contextVars;
