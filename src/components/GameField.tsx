import styled from 'styled-components';
import { AgariResultField } from './AgariResultField';
import { Constants } from './Constants';
import { Huro } from './Huro';
import { Hyoji } from './Hyoji';
import { Kawa } from './Kawa';
import { NoticeField } from './NoticeField';
import { RyukyokuResultField } from './RyukyokuResultField';
import { SyukyokuResultField } from './SyukyokuResultField';
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
      <Huro who={0} />
      <Huro who={1} />
      <Huro who={2} />
      <Huro who={3} />
      <Hyoji />
      <NoticeField />
      <AgariResultField />
      <RyukyokuResultField />
      <SyukyokuResultField />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: ${GameFieldWidth}px;
  height: ${GameFieldHeight}px;
  z-index: 0;
  background-color: darkslategray;
  margin-bottom: 10px;
`;
