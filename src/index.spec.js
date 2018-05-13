import { deserialize, serialize } from 'websocket-util';
import { EventEmitter } from 'events';

import ChildProcessWebSocket from '.';

function setupMock() {
  const childProcess = new EventEmitter();

  childProcess.pid = 1234;
  childProcess.send = jest.fn();

  return {
    childProcess
  };
}

test('send text', () => {
  const { childProcess } = setupMock();
  const webSocket = new ChildProcessWebSocket(childProcess);

  webSocket.send('Hello, World!');

  expect(childProcess.send).toHaveBeenCalledTimes(1);
  expect(childProcess.send).toHaveBeenCalledWith(serialize('Hello, World!'));
});

test('send binary', () => {
  const { childProcess } = setupMock();
  const webSocket = new ChildProcessWebSocket(childProcess);

  webSocket.send(Buffer.from('Hello, World!'));

  expect(childProcess.send).toHaveBeenCalledTimes(1);
  expect(childProcess.send).toHaveBeenCalledWith(serialize(Buffer.from('Hello, World!')));
});

test('receive text', () => {
  const { childProcess } = setupMock();
  const webSocket = new ChildProcessWebSocket(childProcess);

  webSocket.onmessage = jest.fn();

  childProcess.emit('message', serialize('Hello, World!'));

  expect(webSocket.onmessage).toHaveBeenCalledTimes(1);
  expect(webSocket.onmessage.mock.calls[0][0]).toHaveProperty('data', 'Hello, World!');
  expect(webSocket.onmessage.mock.calls[0][0]).toHaveProperty('origin', 'child-process://1234/');
  expect(webSocket.onmessage.mock.calls[0][0]).toHaveProperty('source', webSocket);
});

test('receive buffer', () => {
  const { childProcess } = setupMock();
  const webSocket = new ChildProcessWebSocket(childProcess);

  webSocket.onmessage = jest.fn();

  childProcess.emit('message', serialize(Buffer.from('Hello, World!')));

  expect(webSocket.onmessage).toHaveBeenCalledTimes(1);
  expect(webSocket.onmessage.mock.calls[0][0]).toHaveProperty('data', Buffer.from('Hello, World!'));
  expect(webSocket.onmessage.mock.calls[0][0]).toHaveProperty('origin', 'child-process://1234/');
  expect(webSocket.onmessage.mock.calls[0][0]).toHaveProperty('source', webSocket);
});

test('on "disconnect"', () => {
  const { childProcess } = setupMock();
  const webSocket = new ChildProcessWebSocket(childProcess);

  webSocket.onclose = jest.fn();

  childProcess.emit('disconnect');

  expect(webSocket.onclose).toHaveBeenCalledTimes(1);
});

test('throw after "disconnect"', () => {
  const { childProcess } = setupMock();
  const webSocket = new ChildProcessWebSocket(childProcess);

  webSocket.onclose = jest.fn();
  childProcess.emit('disconnect');

  expect(() => {
    webSocket.send('Hello, World!');
  }).toThrowError('not open');
});
