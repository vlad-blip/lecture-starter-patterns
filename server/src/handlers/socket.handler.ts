import { Server, Socket } from "socket.io";

import { ListEvent } from "../../../common/enums";
import { Database } from "../data/database";
import { ReorderService, ReorderProxy } from "../services/reorder.service";

import type { IObserver } from "../services/observer.service";

abstract class SocketHandler {
  protected db: Database;

  protected reorderService: ReorderService;
  protected reorderProxy: ReorderProxy;

  protected io: Server;

  protected observers: IObserver[] = [];

  public constructor(
    io: Server,
    db: Database,
    reorderService: ReorderService,
    reorderProxy: ReorderProxy
  ) {
    this.io = io;
    this.db = db;
    this.reorderService = reorderService;
    this.reorderProxy = reorderProxy;
  }

  public abstract handleConnection(socket: Socket): void;

  protected updateLists(): void {
    this.io.emit(ListEvent.UPDATE, this.db.getData());
  }

  // PATTERN: Observer

  protected attach(observer: IObserver): void {
    const isExisting = this.observers.includes(observer);

    if (!isExisting) {
      this.observers.push(observer);
    }
  }

  protected detach(observer: IObserver): void {
    const observerIndex = this.observers.indexOf(observer);

    if (observerIndex !== -1) {
      this.observers.splice(observerIndex, 1);
    }
  }

  protected log(data: any): void {
    this.observers.forEach((observer) => observer.update(data));
  }
}

export { SocketHandler };
