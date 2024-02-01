import type { Socket } from "socket.io";

import { CardEvent } from "../../../common/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";
import { Observer } from "../services/observer.service";

const observer = new Observer();

export class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeDescription.bind(this));
    socket.on(CardEvent.COPY, this.copyCard.bind(this));
  }

  public createCard(listId: string, cardName: string): void {
    this.attach(observer);

    const newCard = new Card(cardName, "");
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
    );

    this.db.setData(updatedLists);
    this.updateLists();

    this.log(JSON.stringify(newCard));
  }

  public deleteCard(listId: string, cardId: string): void {
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId
        ? list.setCards(list.cards.filter((card) => card.id !== cardId))
        : list
    );

    this.db.setData(updatedLists);
    this.updateLists();
  }

  public renameCard(listId: string, cardId: string, name: string): void {
    const lists = this.db.getData();

    const list = lists.find((list) => list.id === listId);

    const card = list.cards.find((card) => card.id === cardId);

    card.name = name;

    this.db.setData(lists);
    this.updateLists();
  }

  public changeDescription(
    listId: string,
    cardId: string,
    description: string
  ): void {
    const lists = this.db.getData();

    const list = lists.find((list) => list.id === listId);

    const card = list.cards.find((card) => card.id === cardId);

    card.description = description;

    this.db.setData(lists);
    this.updateLists();
  }

  public copyCard(listId: string, cardId: string): void {
    const lists = this.db.getData();

    const list = lists.find((list) => list.id === listId);

    const card = list.cards.find((card) => card.id === cardId);

    const copyOfCard = card.clone();

    list.cards.push(copyOfCard);

    this.db.setData(lists);
    this.updateLists();
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    const lists = this.db.getData();
    const reordered = this.reorderProxy.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
    this.db.setData(reordered);
    this.updateLists();
  }
}
