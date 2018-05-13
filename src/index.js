import { deserialize, WebSocketBase, serialize } from 'websocket-util';

export default class ChildProcessWebSocket extends WebSocketBase {
  constructor(childProcess) {
    super(data => {
      childProcess.send(serialize(data));
    }, { opened: true });

    this.childProcess = childProcess;
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.handleMessage = this.handleMessage.bind(this);

    childProcess.once('disconnect', this.handleDisconnect);
    childProcess.on('message', this.handleMessage);
  }

  detach() {
    this.childProcess.removeListener('disconnect', this.handleDisconnect);
    this.childProcess.removeListener('message', this.handleDisconnect);
  }

  handleDisconnect() {
    this.end();
  }

  handleMessage(data) {
    this.emit('message', {
      data: deserialize(data),
      origin: `child-process://${ this.childProcess.pid }/`,
      source: this
    });
  }
}
