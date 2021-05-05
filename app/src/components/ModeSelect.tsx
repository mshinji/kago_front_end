import React, { useContext } from 'react';
import styled from 'styled-components';

import { Constants } from './Constants';
import { Context } from './Context';

export const ModeSelect = () => {
  const { onReady } = useContext(Context);
  const { NormalMode, VisibleMode, AutoMode, GameFieldWidth } = Constants;
  return (
    <Wrapper width={GameFieldWidth}>
      <Mode onClick={() => onReady(NormalMode)}>通常モード</Mode>
      <Mode onClick={() => onReady(VisibleMode)}>可視化モード</Mode>
      <Mode onClick={() => onReady(AutoMode)}>自動対戦モード</Mode>
    </Wrapper>
  );
};

const Wrapper = styled.div.attrs((props: { width: number }) => ({
  width: props.width,
}))`
  display: flex;
  justify-content: space-around;
  width: ${(props) => props.width}px;
  /* background: gray; */
`;

const Mode = styled.div`
  color: white;
  &:hover {
    cursor: pointer;
  }
`;
