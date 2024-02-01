import { Card } from "../data/models/card";
import { List } from "../data/models/list";

import { Observer, type IObserver } from "./observer.service";

const observer = new Observer();

export class ReorderService {
  public reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    const card = items[startIndex];
    const listWithRemoved = this.remove(items, startIndex);
    const result = this.insert(listWithRemoved, endIndex, card);

    return result;
  }

  public reorderCards({
    lists,
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    lists: List[];
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): List[] {
    const target: Card = lists.find((list) => list.id === sourceListId)
      ?.cards?.[sourceIndex];

    if (!target) {
      return lists;
    }

    const newLists = lists.map((list) => {
      if (list.id === sourceListId) {
        list.setCards(this.remove(list.cards, sourceIndex));
      }

      if (list.id === destinationListId) {
        list.setCards(this.insert(list.cards, destinationIndex, target));
      }

      return list;
    });

    return newLists;
  }

  private remove<T>(items: T[], index: number): T[] {
    return [...items.slice(0, index), ...items.slice(index + 1)];
  }

  private insert<T>(items: T[], index: number, value: T): T[] {
    return [...items.slice(0, index), value, ...items.slice(index)];
  }
}

// PATTERN: Proxy pattern

export class ReorderProxy {
  private reorderService: ReorderService;

  private observers: IObserver[] = [];

  constructor(reorderService: ReorderService) {
    this.reorderService = reorderService;
  }

  // PATTERN: Observer
  public attach(observer: IObserver): void {
    const isExisting = this.observers.includes(observer);

    if (!isExisting) {
      this.observers.push(observer);
    }
  }

  public detach(observer: IObserver): void {
    const observerIndex = this.observers.indexOf(observer);

    if (observerIndex !== -1) {
      this.observers.splice(observerIndex, 1);
    }
  }

  private log(data: any): void {
    this.observers.forEach((observer) => observer.update(data));
  }

  public reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    this.attach(observer);

    this.log(
      `REORDER items: ${JSON.stringify(
        items
      )}, startIndex: ${startIndex}, endIndex: ${endIndex}`
    );

    return this.reorderService.reorder(items, startIndex, endIndex);
  }

  public reorderCards({
    lists,
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    lists: List[];
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): List[] {
    this.attach(observer);

    this.log(
      `REORDER lists: ${JSON.stringify(
        lists
      )}, sourceIndex: ${sourceIndex}, destinationIndex: ${destinationIndex}, sourceListId: ${sourceListId}, destinationListId: ${destinationListId}`
    );

    return this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
  }
}
