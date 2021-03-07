import React from 'react';
import styled from 'styled-components';

import { Constants } from './Constants';
import { Hyoji } from './Hyoji';
import { Kawa } from './Kawa';
import { Tehai } from './Tehai';

const { GameFieldHeight, GameFieldWidth } = Constants;

export const GameField = () => {
  return (
    <Wrapper>
      <Tehai who={0} />
      <Tehai who={1} />
      <Tehai who={2} />
      <Tehai who={3} />
      <Kawa who={0} />
      <Kawa who={1} />
      <Kawa who={2} />
      <Kawa who={3} />
      <Hyoji />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: ${GameFieldWidth}px;
  height: ${GameFieldHeight}px;
  background-color: darkslategray;
`;
