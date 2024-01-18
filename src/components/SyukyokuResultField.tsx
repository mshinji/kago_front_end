import React, { useContext } from 'react'
import styled from 'styled-components'

import { Constants } from './Constants'
import { Context } from './Context'

const { GameFieldWidth, GameFieldHeight, RyukyokuResultFieldWidth, RyukyokuResultFieldHeight } = Constants

export const SyukyokuResultField = () => {
  const { syukyokuInfo } = useContext(Context)

  return syukyokuInfo.scores.length === 4 ? (
    <Wrapper>
      <Title>終局</Title>
      <ScoreField>
        <Score>
          <Rank>{syukyokuInfo.ranks[2]}位</Rank>
          <CurrentScore>{syukyokuInfo.scores[2]}</CurrentScore>
        </Score>
        <Row>
          <Score>
            <Rank>{syukyokuInfo.ranks[3]}位</Rank>
            <CurrentScore>{syukyokuInfo.scores[3]}</CurrentScore>
          </Score>
          <Score>
            <Rank>{syukyokuInfo.ranks[1]}位</Rank>
            <CurrentScore>{syukyokuInfo.scores[1]}</CurrentScore>
          </Score>
        </Row>
        <Score>
          <Rank>{syukyokuInfo.ranks[0]}位</Rank>
          <CurrentScore>{syukyokuInfo.scores[0]}</CurrentScore>
        </Score>
      </ScoreField>
    </Wrapper>
  ) : (
    <></>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  width: ${RyukyokuResultFieldWidth}px;
  height: ${RyukyokuResultFieldHeight}px;
  transform: translate(
    ${(GameFieldWidth - RyukyokuResultFieldWidth) / 2}px,
    ${(GameFieldHeight - RyukyokuResultFieldHeight) / 2}px
  );
  transform-origin: center center 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
`

const Title = styled.div`
  font-size: 32px;
`

const Row = styled.div`
  display: flex;
  justify-content: space-around;
  width: ${RyukyokuResultFieldWidth}px;
`

const ScoreField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`

const Score = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 10px;
  background: tan;
  border-radius: 10px;
`

const CurrentScore = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: white;
`

const Rank = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: red;
`
