import React from 'react';
import styled from 'styled-components';

import { Constants } from './Constants';
import { GameField } from './GameField';
import { ModeSelect } from './ModeSelect';

// import { Header } from './Header';

const { TemplateWidth } = Constants;

export const Template = () => {
  return (
    <Wrapper>
      {/* <Header /> */}
      <Message>麻雀</Message>
      <ModeSelect />
      <GameField />
      <ApologizedMessage>
        {
          '大明槓・加槓は未実装！！ダブロンも未実装！！多分バグもたくさん！！すみません！！！'
        }
      </ApologizedMessage>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: ${TemplateWidth}px;
  min-height: 100%;
  background: black;
`;

const Message = styled.div`
  color: white;
  margin: 5px;
`;

const ApologizedMessage = styled.div``;
