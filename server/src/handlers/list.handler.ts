import type { Socket } from "socket.io";

import { ListEvent } from "../../../common/enums";
import { List } from "../data/models/list";
import { SocketHandler } from "./socket.handler";

export class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    const lists = this.db.getData();
    const reorderedLists = this.reorderProxy.reorder(
      lists,
      sourceIndex,
      destinationIndex
    );
    this.db.setData(reorderedLists);
    this.updateLists();
  }

  private createList(name: string): void {
    const lists = this.db.getData();
    const newList = new List(name);
    this.db.setData(lists.concat(newList));
    this.updateLists();
  }

  private renameList(listId: string, name: string): void {
    if (name.trim() === "") {
      return;
    }

    const lists = this.db.getData();

    const searchedList = lists.find((list) => list.id === listId);

    searchedList.name = name;

    this.db.setData(lists);
    this.updateLists();
  }

  private deleteList(listId: string) {
    if (listId.trim() === "") {
      return;
    }
    const lists = this.db.getData();

    const updatedLists = lists.filter((list) => list.id !== listId);

    this.db.setData(updatedLists);
    this.updateLists();
  }
}
