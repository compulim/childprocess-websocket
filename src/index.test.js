import ChildProcess from 'child_process';
import { join } from 'path';

import ChildProcessWebSocket from '.';

let childProcess;

function waitForEvent(emitter, name) {
  return new Promise((resolve, reject) => {
    emitter.once(name, resolve);
  });
}

function sleep(interval) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, interval);
  });
}

beforeEach(() => {
  childProcess = ChildProcess.fork(join(__dirname, '__fixtures/echo.js'));
});

afterEach(() => {
  childProcess.kill();
});

test('send and receive text', async () => {
  const webSocket = new ChildProcessWebSocket(childProcess);

  webSocket.onmessage = jest.fn();
  webSocket.send('Hello, World!');

  await waitForEvent(webSocket, 'message');

  expect(webSocket.onmessage).toHaveBeenCalledTimes(1);
  expect(webSocket.onmessage.mock.calls[0][0]).toHaveProperty('data', 'Hello, World!');
  expect(webSocket.onmessage.mock.calls[0][0]).toHaveProperty('origin', `child-process://${ childProcess.pid }/`);
});

test('send and receive binary', async () => {
  const webSocket = new ChildProcessWebSocket(childProcess);

  webSocket.onmessage = jest.fn();
  webSocket.send(Buffer.from('Hello, World!'));

  await waitForEvent(webSocket, 'message');

  expect(webSocket.onmessage).toHaveBeenCalledTimes(1);
  expect(webSocket.onmessage.mock.calls[0][0]).toHaveProperty('data', Buffer.from('Hello, World!'));
  expect(webSocket.onmessage.mock.calls[0][0]).toHaveProperty('origin', `child-process://${ childProcess.pid }/`);
});

test('send after kill', async () => {
  const webSocket = new ChildProcessWebSocket(childProcess);

  childProcess.kill();

  await waitForEvent(childProcess, 'close');

  expect(() => {
    webSocket.send('Hello, World!');
  }).toThrow('not open');
});

test('send after disconnect', async () => {
  const webSocket = new ChildProcessWebSocket(childProcess);

  childProcess.disconnect();

  await waitForEvent(childProcess, 'disconnect');

  expect(() => {
    webSocket.send('Hello, World!');
  }).toThrow('not open');
});
