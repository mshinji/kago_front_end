import React, { useContext } from 'react';
import styled from 'styled-components';

import { Constants } from './Constants';
import { Context } from './Context';
import { Pai } from './Pai';

const {
  GameFieldWidth,
  GameFieldHeight,
  ResultFieldWidth,
  ResultFieldHeight,
  ResultPaiHeight,
} = Constants;

export const ResultField = () => {
  const { agariInfo } = useContext(Context);

  return agariInfo.yakus.length >= 1 ? (
    <Wrapper>
      <Row>
        <Dora>
          {agariInfo.doras.map((dora) => (
            <Pai no={dora} height={ResultPaiHeight} />
          ))}
        </Dora>
        <Dora>
          {agariInfo.uradoras.map((dora) => (
            <Pai no={dora} height={ResultPaiHeight} />
          ))}
        </Dora>
      </Row>
      <Yaku>
        {agariInfo.yakus.map((yaku) => (
          <div>
            {yaku.name}:{yaku.han}飜
          </div>
        ))}
      </Yaku>
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
  width: ${ResultFieldWidth}px;
  height: ${ResultFieldHeight}px;
  transform: translate(
    ${(GameFieldWidth - ResultFieldWidth) / 2}px,
    ${(GameFieldHeight - ResultFieldHeight) / 2}px
  );
  transform-origin: center center 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-around;
  width: ${ResultFieldWidth}px;
`;

const Dora = styled.div`
  display: flex;
  margin: 10px 0;
`;

const Yaku = styled.div`
  color: white;
  font-size: 24px;
  font-weight: bold;
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
