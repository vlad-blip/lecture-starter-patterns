import { ChangeEvent, useState } from 'react';

import { useComponentVisible } from '../../hooks/useComponentVisible';
import { BasicText } from './styled/basic-text';
import { TextContainer } from './styled/text-container';
import { TextInput } from './styled/text-input';

type Props = {
  text: string;
  onChange: (value: string) => void;
};

export const Text = ({ onChange, text }: Props) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const [value, setValue] = useState(text);

  const onEdit = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <TextContainer ref={ref}>
      {isComponentVisible ? (
        <TextInput
          value={value}
          onChange={onEdit}
          onBlur={() => setIsComponentVisible(false)}
          autoFocus={isComponentVisible}
        />
      ) : (
        <BasicText onClick={() => setIsComponentVisible(true)}>
          {value}
        </BasicText>
      )}
    </TextContainer>
  );
};
