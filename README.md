# [topset-movie-api]

# Start the application

## Start The application in Development Mode

- Clone the Application
- Install the dependencies `npm install`
- Start the application `npm start`

## Start The application in Production Mode

- Install the dependencies `npm install`
- Create the build `npm run build`
- Start the application `npm run start:production`
- Before starting make sure to creat prod environment `.env.prod` file

## Encryption

Set the `APPLY_ENCRYPTION` environment variable to `true` to enable encryption.

## Global Environment Object

You can directly access the environment attributes in any component/file using global environment object. For more details please check file `src/global.ts`.

_Example_

To access the `applyEncryption` attribute from `Envionment` class to Response Handler, write `environment.applyEncryption`;

## Default System Health Status API

- `${host}/api/status/system` - Return the system information in response
- `${host}/api/status/time` - Return the current time in response
- `${host}/api/status/usage` - Return the process and system memory usage in response
- `${host}/api/status/process` - Return the process details in response
- `${host}/api/status/error` - Return the error generated object in response

## Notes

### 1. Why is my git pre-commit hook not executable by default?

- Because files are not executable by default; they must be set to be executable.

```
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```
