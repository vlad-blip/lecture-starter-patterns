import type { DraggableLocation } from '@hello-pangea/dnd';

import { Card, List } from '../common/types';

export const reorderService = {
  reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    const result = [...items];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  },

  reorderCards(
    lists: List[],
    source: DraggableLocation,
    destination: DraggableLocation,
  ): List[] {
    const current: Card[] =
      lists.find((list) => list.id === source.droppableId)?.cards || [];
    const next: Card[] =
      lists.find((list) => list.id === destination.droppableId)?.cards || [];
    const target: Card = current[source.index];

    const isMovingInSameList = source.droppableId === destination.droppableId;

    if (isMovingInSameList) {
      const reordered: Card[] = this.reorder(
        current,
        source.index,
        destination.index,
      );

      return lists.map((list) =>
        list.id === source.droppableId ? { ...list, cards: reordered } : list,
      );
    }

    const newLists = lists.map((list) => {
      if (list.id === source.droppableId) {
        return {
          ...list,
          cards: this.removeCardFromList(current, source.index),
        };
      }

      if (list.id === destination.droppableId) {
        return {
          ...list,
          cards: this.addCardToList(next, destination.index, target),
        };
      }

      return list;
    });

    return newLists;
  },

  removeCardFromList(cards: Card[], index: number): Card[] {
    return cards.slice(0, index).concat(cards.slice(index + 1));
  },

  addCardToList(cards: Card[], index: number, card: Card): Card[] {
    return cards.slice(0, index).concat(card).concat(cards.slice(index));
  },
};
