import type { DraggableProvided } from "@hello-pangea/dnd";

import { checkIsEmpty } from "../../helpers/checkIsEmpty";

import type { Card } from "../../common/types";
import { CopyButton } from "../primitives/copy-button";
import { DeleteButton } from "../primitives/delete-button";
import { Splitter } from "../primitives/styled/splitter";
import { Text } from "../primitives/text";
import { Title } from "../primitives/title";
import { Container } from "./styled/container";
import { Content } from "./styled/content";
import { Footer } from "./styled/footer";
import { useContext } from "react";
import { SocketContext } from "../../context/socket";
import { CardEvent } from "../../../../common/enums";

type Props = {
  listId: string;
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
};

export const CardItem = ({ listId, card, isDragging, provided }: Props) => {
  const socket = useContext(SocketContext);

  const deleteCardHandler = () => {
    socket.emit(CardEvent.DELETE, listId, card.id);
  };

  const renameCardHandler = (name: string) => {
    if (checkIsEmpty(name)) {
      return;
    }

    socket.emit(CardEvent.RENAME, listId, card.id, name);
  };

  const changeDescriptionHandler = (description: string) => {
    if (checkIsEmpty(description)) {
      return;
    }

    socket.emit(CardEvent.CHANGE_DESCRIPTION, listId, card.id, description);
  };

  const copyCardHandler = () => {
    socket.emit(CardEvent.COPY, listId, card.id);
  };

  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title
          onChange={renameCardHandler}
          title={card.name}
          fontSize="large"
          isBold
        />
        <Text text={card.description} onChange={changeDescriptionHandler} />
        <Footer>
          <DeleteButton onClick={deleteCardHandler} />
          <Splitter />
          <CopyButton onClick={copyCardHandler} />
        </Footer>
      </Content>
    </Container>
  );
};
