import React, { useContext } from 'react'
import styled from 'styled-components'

import { Constants } from './Constants'
import { Context } from './Context'
import { Pai } from './Pai'

const { GameFieldWidth, GameFieldHeight, TehaiWidth, TehaiHeight, TehaiPaiHeight } = Constants

interface TehaiProps {
  who: number
}

export const Tehai = (props: TehaiProps) => {
  const { gameInfo, richiDeclareNotices, onClickDahai } = useContext(Context)

  return (
    <Wrapper who={props.who}>
      {gameInfo.tehais[props.who].map((pai) => (
        <Pai
          key={pai}
          no={pai}
          height={TehaiPaiHeight}
          isDisabled={
            props.who == 0 &&
            richiDeclareNotices.length > 0 &&
            !richiDeclareNotices.map((notice) => notice.pai).includes(pai)
          }
          onClick={() => onClickDahai(pai)}
        />
      ))}
    </Wrapper>
  )
}

const calcTranslateX = (who: number) =>
  [
    (GameFieldWidth - TehaiWidth + TehaiHeight) / 2,
    GameFieldWidth - (TehaiWidth + TehaiHeight) / 2,
    (GameFieldWidth - TehaiWidth - TehaiHeight) / 2,
    (TehaiHeight - TehaiWidth) / 2,
  ][who]

const calcTranslateY = (who: number) =>
  [
    GameFieldHeight - TehaiHeight,
    GameFieldHeight - TehaiWidth / 2 - TehaiHeight * 1.5,
    0,
    (TehaiWidth + TehaiHeight) / 2,
  ][who]

const calcRotateDegree = (who: number) => who * -90

const Wrapper = styled.div.attrs((props: TehaiProps) => ({
  who: props.who,
}))`
  display: flex;
  align-items: center;
  position: absolute;
  width: ${TehaiWidth}px;
  height: ${TehaiHeight}px;
  transform: translate(${(props) => calcTranslateX(props.who)}px, ${(props) => calcTranslateY(props.who)}px)
    rotate(${(props) => calcRotateDegree(props.who)}deg);
  transform-origin: center center 0;
`
