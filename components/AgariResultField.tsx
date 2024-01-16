import React, { useContext } from 'react'
import styled from 'styled-components'

import { Constants } from './Constants'
import { Context, HuroType } from './Context'
import { Pai } from './Pai'

const { GameFieldWidth, GameFieldHeight, AgariResultFieldWidth, AgariResultFieldHeight, ResultPaiHeight } = Constants

export const AgariResultField = () => {
  const { agariInfo, onClickNextKyoku } = useContext(Context)

  return agariInfo.yakus.length >= 1 ? (
    <Wrapper>
      <Row>
        <TehaiField>
          {agariInfo.tehai.map((pai) => (
            <Pai key={pai} no={pai} height={ResultPaiHeight} />
          ))}
        </TehaiField>
        {agariInfo.huro.length > 0 ? (
          <HuroField>
            {agariInfo.huro
              .slice(0)
              .reverse()
              .map((h, key) => (
                <HuroWrapper key={key}>
                  {h.type == 'ankan' && h.pais.map((pai) => <Pai key={pai} no={pai} height={ResultPaiHeight} />)}
                  {h.type == 'pon' && (
                    <>
                      {sortPais(h).map((pai) =>
                        pai == h.pai ? (
                          <Pai key={h.pai} no={h.pai} height={ResultPaiHeight} rotationType="down" />
                        ) : (
                          <Pai key={pai} no={pai} height={ResultPaiHeight} />
                        ),
                      )}
                    </>
                  )}
                  {h.type == 'chi' && (
                    <>
                      {sortPais(h).map((pai) =>
                        pai == h.pai ? (
                          <Pai key={h.pai} no={h.pai} height={ResultPaiHeight} rotationType="down" />
                        ) : (
                          <Pai key={pai} no={pai} height={ResultPaiHeight} />
                        ),
                      )}
                    </>
                  )}
                </HuroWrapper>
              ))}
          </HuroField>
        ) : (
          <></>
        )}
      </Row>
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
          {agariInfo.yakus.slice(0, Math.ceil(agariInfo.yakus.length / 2)).map((yaku) => (
            <Yaku key={yaku.name}>
              <YakuName>{yaku.name}</YakuName>
              <YakuHan>{yaku.han}飜</YakuHan>
            </Yaku>
          ))}
        </Col>
        <Col>
          {agariInfo.yakus.slice(Math.ceil(agariInfo.yakus.length / 2), agariInfo.yakus.length).map((yaku) => (
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
      <NextKyoku onClick={() => onClickNextKyoku()}>次</NextKyoku>
    </Wrapper>
  ) : (
    <></>
  )
}

const sortPais = (huro: HuroType): number[] => {
  const pais = huro.pais.filter((pai) => pai != huro.pai)
  pais.splice(3 - ((huro.fromWho - huro.who + 4) % 4), 0, huro.pai)
  return pais
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  width: ${AgariResultFieldWidth}px;
  height: ${AgariResultFieldHeight}px;
  transform: translate(
    ${(GameFieldWidth - AgariResultFieldWidth) / 2}px,
    ${(GameFieldHeight - AgariResultFieldHeight) / 2}px
  );
  transform-origin: center center 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
`

const Row = styled.div`
  display: flex;
  justify-content: space-around;
  width: ${AgariResultFieldWidth}px;
`

const Col = styled.div`
  display: flex;
  flex-direction: column;
  width: ${AgariResultFieldWidth / 2}px;
`

const TehaiField = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`

const HuroField = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 10px 0;
`

const HuroWrapper = styled.div`
  display: flex;
  margin-left: 12px;
`

const Dora = styled.div`
  display: flex;
  margin: 10px 0;
`

const YakuField = styled.div`
  display: flex;
  width: ${AgariResultFieldWidth}px;
`

const Yaku = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-left: 10px;
  color: white;
  font-size: 24px;
  font-weight: bold;
`

const YakuName = styled.div`
  width: ${(AgariResultFieldWidth * 2.5) / 8}px;
`

const YakuHan = styled.div`
  width: ${(AgariResultFieldWidth * 1) / 8}px;
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
  width: ${AgariResultFieldWidth / 2}px;
  font-size: 32px;
  font-weight: bold;
  margin-top: 20px;
  border-radius: 20px;
  background: white;
  color: black;
  text-align: center;
`
