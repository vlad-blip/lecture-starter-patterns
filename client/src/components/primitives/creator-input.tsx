import React, { useState } from 'react';

import { AddIcon } from '../icons/add-icon';
import { Button } from './styled/button';
import { Input } from './styled/input';

type Props = {
  onSubmit: (value: string) => void;
};

const CreatorInput = ({ onSubmit }: Props) => {
  const [name, setName] = useState('');

  const onClick = () => {
    setName('');
    onSubmit(name);
  };

  return (
    <React.Fragment>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        fontSize="medium"
        width={250}
      />
      <Button onClick={onClick}>
        <AddIcon />
      </Button>
    </React.Fragment>
  );
};

export { CreatorInput };
