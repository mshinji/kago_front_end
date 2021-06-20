import React, { useContext } from 'react';
import styled from 'styled-components';

import { Constants } from './Constants';
import { Context } from './Context';

const { NormalMode, VisibleMode, AutoMode, GameFieldWidth } = Constants;

export const ModeSelect = () => {
  const { startGame } = useContext(Context);
  return (
    <Wrapper>
      <Mode onClick={() => startGame(NormalMode)}>通常モード</Mode>
      <Mode onClick={() => startGame(VisibleMode)}>可視化モード</Mode>
      <Mode onClick={() => startGame(AutoMode)}>自動対戦モード</Mode>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: ${GameFieldWidth}px;
  margin: 10px 0;
`;

const Mode = styled.div`
  color: white;
  &:hover {
    cursor: pointer;
  }
`;
