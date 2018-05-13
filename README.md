# childprocess-websocket

[![npm version](https://badge.fury.io/js/childprocess-websocket.svg)](https://badge.fury.io/js/childprocess-websocket) [![Build Status](https://travis-ci.org/compulim/childprocess-websocket.svg?branch=master)](https://travis-ci.org/compulim/childprocess-websocket)

Turns [`ChildProcess`](https://nodejs.org/api/child_process.html) IPC into Web Socket.

# Background

Instead of learning/using different API for different communication channels, we should unite them into a single interface pattern, either [MessagePort](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort) or [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

# How to use

```js
const childProcess = ChildProcess.fork('echo.js');
const webSocket = new ChildProcessWebSocket(childProcess);

webSocket.onmessage = event => {
  // Could be either a string or Buffer
  console.log(event.data);
};

webSocket.send('Hello, World!');
```

> Instead of subscribing to `onmessage`, you can also subscribe using `on('message', handler)`.

Note that when `ChildProcessWebSocket` is constructed, the IPC channel is already established. So we assume Web Socket is already opened, thus, no `open` event will be emitted.

# Contributions

Like us? [Star](https://github.com/compulim/childprocess-websocket/stargazers) us.

Want to make it better? [File](https://github.com/compulim/childprocess-websocket/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/childprocess-websocket/pulls) a pull request.
