import React from 'react';
import styled from 'styled-components';

import { GameField } from './GameField';
import { ModeSelect } from './ModeSelect';

// import { Header } from './Header';

export const Template = () => {
  return (
    <Wrapper>
      {/* <Header /> */}
      <Message>麻雀</Message>
      <ModeSelect />
      <GameField />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100%;
  background: black;
`;

const Message = styled.div`
  color: white;
  margin: 5px;
`;
