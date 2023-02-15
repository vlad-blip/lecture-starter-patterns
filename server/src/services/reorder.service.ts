import { Card } from '../data/models/card';
import { List } from '../data/models/list';

export class ReorderService {
  public reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    const result = [...items];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

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
    const current: Card[] =
      lists.find((list) => list.id === sourceListId)?.cards || [];
    const next: Card[] =
      lists.find((list) => list.id === destinationListId)?.cards || [];
    const target: Card = current[sourceIndex];

    const newLists = lists.map((list) => {
      if (list.id === sourceListId) {
        return {
          ...list,
          cards: this.removeCardFromList(current, sourceIndex),
        };
      }

      if (list.id === destinationListId) {
        return {
          ...list,
          cards: this.addCardToList(next, destinationIndex, target),
        };
      }

      return list;
    });

    return newLists;
  }

  private removeCardFromList(cards: Card[], index: number): Card[] {
    return cards.slice(0, index).concat(cards.slice(index + 1));
  }

  private addCardToList(cards: Card[], index: number, card: Card): Card[] {
    return cards.slice(0, index).concat(card).concat(cards.slice(index));
  }
}
