import type { DraggableLocation } from "@hello-pangea/dnd";

import { Card, List } from "../common/types";

const getCardsFromList = (lists: List[], source: DraggableLocation) => {
  return lists.find((list) => list.id === source.droppableId)?.cards || [];
};

export const reorderLists = (
  items: List[],
  startIndex: number,
  endIndex: number
): List[] => {
  const [removed] = items.splice(startIndex, 1);
  items.splice(endIndex, 0, removed);

  return items;
};

const removeCardFromList = (cards: Card[], index: number): Card[] => {
  return cards.slice(0, index).concat(cards.slice(index + 1));
};

const addCardToList = (cards: Card[], index: number, card: Card): Card[] => {
  return cards.slice(0, index).concat(card).concat(cards.slice(index));
};

export const reorderCards = (
  lists: List[],
  source: DraggableLocation,
  destination: DraggableLocation
): List[] => {
  const current: Card[] = getCardsFromList(lists, source);

  const next: Card[] = getCardsFromList(lists, destination);

  const target: Card = current[source.index];

  const isMovingInSameList = source.droppableId === destination.droppableId;

  if (isMovingInSameList) {
    const [removed] = current.splice(source.index, 1);
    current.splice(destination.index, 0, removed);
    const reordered: Card[] = current;

    return lists.map((list) =>
      list.id === source.droppableId ? { ...list, cards: reordered } : list
    );
  }

  const newLists = lists.map((list) => {
    if (list.id === source.droppableId) {
      return {
        ...list,
        cards: removeCardFromList(current, source.index),
      };
    }

    if (list.id === destination.droppableId) {
      return {
        ...list,
        cards: addCardToList(next, destination.index, target),
      };
    }

    return list;
  });

  return newLists;
};
