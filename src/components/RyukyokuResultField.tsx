import { useContext } from 'react'
import styled from 'styled-components'

import { Constants } from './Constants'
import { Context } from './Context'

const { GameFieldWidth, GameFieldHeight, RyukyokuResultFieldWidth, RyukyokuResultFieldHeight } = Constants

export const RyukyokuResultField = () => {
  const { ryukyokuInfo, onClickNextKyoku } = useContext(Context)

  return ryukyokuInfo.scoreMovements.length === 4 ? (
    <Wrapper>
      <Title>流局</Title>
      <ScoreField>
        <Score>
          <ScoreMovement>
            {ryukyokuInfo.scoreMovements[2] > 0 ? '+' : ''}
            {ryukyokuInfo.scoreMovements[2]}
          </ScoreMovement>
          <CurrentScore>{ryukyokuInfo.scores[2]}</CurrentScore>
        </Score>
        <Row>
          <Score>
            <ScoreMovement>
              {ryukyokuInfo.scoreMovements[3] > 0 ? '+' : ''}
              {ryukyokuInfo.scoreMovements[3]}
            </ScoreMovement>
            <CurrentScore>{ryukyokuInfo.scores[3]}</CurrentScore>
          </Score>
          <Score>
            <ScoreMovement>
              {ryukyokuInfo.scoreMovements[1] > 0 ? '+' : ''}
              {ryukyokuInfo.scoreMovements[1]}
            </ScoreMovement>
            <CurrentScore>{ryukyokuInfo.scores[1]}</CurrentScore>
          </Score>
        </Row>
        <Score>
          <ScoreMovement>
            {ryukyokuInfo.scoreMovements[0] > 0 ? '+' : ''}
            {ryukyokuInfo.scoreMovements[0]}
          </ScoreMovement>
          <CurrentScore>{ryukyokuInfo.scores[0]}</CurrentScore>
        </Score>
      </ScoreField>
      <NextKyoku onClick={() => onClickNextKyoku()}>次</NextKyoku>
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

const ScoreMovement = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: red;
`

const NextKyoku = styled.div`
  width: ${RyukyokuResultFieldWidth / 2}px;
  font-size: 32px;
  font-weight: bold;
  margin-top: 20px;
  border-radius: 20px;
  background: white;
  color: black;
  text-align: center;
`
