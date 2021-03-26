import React, { useContext } from 'react';
import styled from 'styled-components';

import { Constants } from './Constants';
import { Context } from './Context';
import { Pai } from './Pai';

const {
  GameFieldWidth,
  GameFieldHeight,
  KyokuResultFieldWidth,
  KyokuResultFieldHeight,
  ResultPaiHeight,
} = Constants;

export const KyokuResultField = () => {
  const { agariInfo } = useContext(Context);

  return agariInfo.yakus.length >= 1 ? (
    <Wrapper>
      <Row>
        <Dora>
          {agariInfo.doras.map((dora) => (
            <Pai no={dora} key={dora} height={ResultPaiHeight} />
          ))}
        </Dora>
        <Dora>
          {agariInfo.uradoras.map((dora) => (
            <Pai no={dora} key={dora} height={ResultPaiHeight} />
          ))}
        </Dora>
      </Row>
      <YakuField>
        <Col>
          {agariInfo.yakus
            .slice(0, Math.ceil(agariInfo.yakus.length / 2))
            .map((yaku) => (
              <Yaku key={yaku.name}>
                <YakuName>{yaku.name}</YakuName>
                <YakuHan>{yaku.han}飜</YakuHan>
              </Yaku>
            ))}
        </Col>
        <Col>
          {agariInfo.yakus
            .slice(
              Math.ceil(agariInfo.yakus.length / 2),
              agariInfo.yakus.length
            )
            .map((yaku) => (
              <Yaku key={yaku.name}>
                <YakuName>{yaku.name}</YakuName>
                <YakuHan>{yaku.han}飜</YakuHan>
              </Yaku>
            ))}
        </Col>
      </YakuField>
      <ScoreField>
        <Score>
          <ScoreMovement>
            {agariInfo.scoreMovements[2] > 0 ? '+' : ''}
            {agariInfo.scoreMovements[2]}
          </ScoreMovement>
          <CurrentScore>{agariInfo.scores[2]}</CurrentScore>
        </Score>
        <Row>
          <Score>
            <ScoreMovement>
              {agariInfo.scoreMovements[3] > 0 ? '+' : ''}
              {agariInfo.scoreMovements[3]}
            </ScoreMovement>
            <CurrentScore>{agariInfo.scores[3]}</CurrentScore>
          </Score>
          <Score>
            <ScoreMovement>
              {agariInfo.scoreMovements[1] > 0 ? '+' : ''}
              {agariInfo.scoreMovements[1]}
            </ScoreMovement>
            <CurrentScore>{agariInfo.scores[1]}</CurrentScore>
          </Score>
        </Row>
        <Score>
          <ScoreMovement>
            {agariInfo.scoreMovements[0] > 0 ? '+' : ''}
            {agariInfo.scoreMovements[0]}
          </ScoreMovement>
          <CurrentScore>{agariInfo.scores[0]}</CurrentScore>
        </Score>
      </ScoreField>
    </Wrapper>
  ) : (
    <></>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  width: ${KyokuResultFieldWidth}px;
  height: ${KyokuResultFieldHeight}px;
  transform: translate(
    ${(GameFieldWidth - KyokuResultFieldWidth) / 2}px,
    ${(GameFieldHeight - KyokuResultFieldHeight) / 2}px
  );
  transform-origin: center center 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-around;
  width: ${KyokuResultFieldWidth}px;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  width: ${KyokuResultFieldWidth / 2}px;
`;

const Dora = styled.div`
  display: flex;
  margin: 10px 0;
`;

const YakuField = styled.div`
  display: flex;
  width: ${KyokuResultFieldWidth}px;
`;

const Yaku = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-left: 10px;
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const YakuName = styled.div`
  width: ${(KyokuResultFieldWidth * 2.5) / 8}px;
`;

const YakuHan = styled.div`
  width: ${(KyokuResultFieldWidth * 1) / 8}px;
`;

const ScoreField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const Score = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 10px;
  background: tan;
  border-radius: 10px;
`;

const CurrentScore = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

const ScoreMovement = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: red;
`;
