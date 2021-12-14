# Contributing

## Setting Up

1. Ensure that you have Node.js 14 or later installed.
2. Clone this Git repository.
3. Run *npm install*.

## Coding

This project uses:

- [ESLint](https://eslint.org/) for code analysis
- [Husky](https://typicode.github.io/husky) for pre-commit hooks

## Testing

The *npm test* command runs ESLint and the test suite:

    npm test

Once you run *npm install* or *npm ci*, Husky adds a pre-commit hook. This hook automatically runs *npm test* before each Git commit.

This project uses [Mocha](https://mochajs.org/) for testing.

### Tests with HTTP

This project uses [nock](https://www.npmjs.com/package/nock) for mocking HTTP services. The expected responses from the services are stored as fixtures, which are JSON files.

By default, nock runs in *dryrun* mode. In this mode, nock uses recorded fixtures. If a fixture does not exist, nock will call the storage service directly, but will not save the response as a fixture.

To refresh a fixture file for nock: 

1. Delete the existing fixture file
2. Run the tests with nock in *record* mode.

    NOCK_BACK_MODE=record npm test

The nock tests will make the HTTP call to the remote service and recreate the fixture file.

3. Commit the new fixture file into source control.

## Continuous Integration

To ensure that tests are repeatable:

1. Use *npm ci* to install dependencies
2. Set the NOCK_BACK_MODE environment variable to run nock in *lockdown* mode:

    NOCK_BACK_MODE=lockdown
    npm test
