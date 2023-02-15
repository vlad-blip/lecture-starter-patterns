import { CreatorInput } from '../../primitives/creator-input';
import { ColumnCreatorContainer } from '../styled/column-creator-container';

type Props = {
  onCreateList: (name: string) => void;
};

export const ColumnCreatorInput = ({ onCreateList }: Props) => {
  return (
    <ColumnCreatorContainer>
      <CreatorInput onSubmit={onCreateList} />
    </ColumnCreatorContainer>
  );
};
