import React from 'react';
import styled from 'styled-components';
import { Constants } from './Constants';
import { KyokuInfo } from './KyokuInfo';
import { PlayerInfo } from './PlayerInfo';

const { GameFieldWidth, GameFieldHeight, HyojiWidth, HyojiHeight } = Constants;

export const Hyoji = () => {
  return (
    <Wrapper>
      <KyokuInfo />
      <PlayerInfo who={0} />
      <PlayerInfo who={1} />
      <PlayerInfo who={2} />
      <PlayerInfo who={3} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  width: ${HyojiWidth}px;
  height: ${HyojiHeight}px;
  background: navy;
  transform: translate(
    ${(GameFieldWidth - HyojiWidth) / 2}px,
    ${(GameFieldHeight - HyojiHeight) / 2}px
  );
  transform-origin: center center 0;
`;
