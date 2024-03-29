import { useContext } from 'react';
import styled from 'styled-components';
import { Constants } from './Constants';
import { Context } from './Context';

interface PlayerInfoProps {
  who: number;
}

export const PlayerInfo = (props: PlayerInfoProps) => {
  const { gameInfo } = useContext(Context);
  return (
    <Wrapper who={props.who}>
      <Row>
        <Kaze>{gameInfo.kazes[props.who]}</Kaze>
        <Score>{gameInfo.scores[props.who]}</Score>
      </Row>
      {gameInfo.richis[props.who] ? (
        <Reach>
          <img src={`./images/bou0.png`} />
        </Reach>
      ) : (
        <></>
      )}
    </Wrapper>
  );
};

const {
  HyojiWidth,
  HyojiHeight,
  PlayerInfoWidth,
  PlayerInfoHeight,
  KyokuInfoWidth,
  KyokuInfoHeight,
} = Constants;

const calcTranslateX = (who: number) =>
  [
    (HyojiWidth - KyokuInfoWidth) / 2,
    (HyojiWidth + KyokuInfoWidth - (PlayerInfoWidth - PlayerInfoHeight)) / 2,
    (HyojiWidth - KyokuInfoWidth) / 2,
    (HyojiWidth - KyokuInfoWidth - (PlayerInfoWidth - PlayerInfoHeight)) / 2 -
      PlayerInfoHeight,
  ][who];

const calcTranslateY = (who: number) =>
  [
    (HyojiHeight + KyokuInfoHeight) / 2,
    (HyojiHeight - KyokuInfoHeight + (PlayerInfoWidth - PlayerInfoHeight)) / 2,
    (HyojiHeight - KyokuInfoHeight) / 2 - PlayerInfoHeight,
    (HyojiHeight - KyokuInfoHeight + (PlayerInfoWidth - PlayerInfoHeight)) / 2,
  ][who];

const calcRotateDegree = (who: number) => who * -90;

const Wrapper = styled.div.attrs<PlayerInfoProps>((props) => ({
  who: props.who,
}))`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  width: ${PlayerInfoWidth}px;
  height: ${PlayerInfoHeight}px;
  /* background: gray; */
  transform: translate(
      ${(props) => calcTranslateX(props.who)}px,
      ${(props) => calcTranslateY(props.who)}px
    )
    rotate(${(props) => calcRotateDegree(props.who)}deg);
  transform-origin: center center 0;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 4px;
`;

const Kaze = styled.div`
  height: 20px;
  line-height: 20px;
  padding: 2px;
  margin-right: 5px;
  background-color: orange;
  border-radius: 5px;
`;

const Score = styled.div`
  height: 24px;
  line-height: 24px;
  color: white;
  font-weight: bold;
`;

const Reach = styled.div`
  width: 100%;
  height: 12px;
  line-height: 12px;
  text-align: center;
`;
