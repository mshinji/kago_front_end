import React, { useContext } from 'react'
import styled from 'styled-components'

import { Constants } from './Constants'
import { Context } from './Context'
import { Pai } from './Pai'

const { HyojiWidth, HyojiHeight, KyokuInfoWidth, KyokuInfoHeight, HyojiPaiHeight } = Constants

const calcKyoku = (no: number) => {
  const bakaze = ['東', '南', '西', '北'][Math.floor(no / 4)]
  const kyoku = ['一', '二', '三', '四'][no % 4]
  return bakaze + kyoku
}

export const KyokuInfo = () => {
  const { gameInfo } = useContext(Context)

  return (
    <Wrapper>
      <Kyoku>{calcKyoku(gameInfo.kyoku)}</Kyoku>
      <Dora>
        {gameInfo.dora.map((pai) => (
          <Pai key={pai} no={pai} height={HyojiPaiHeight} />
        ))}
      </Dora>
      <Kyotaku>
        <img src="/images/bou0.png" width={Math.floor(KyokuInfoWidth * 0.6)} style={{ paddingRight: '5px' }} />
        {'× ' + gameInfo.kyotaku}
      </Kyotaku>
      <Tsumibou>
        <img src="/images/bou1.png" width={Math.floor(KyokuInfoWidth * 0.6)} style={{ paddingRight: '5px' }} />
        {'× ' + gameInfo.honba}
      </Tsumibou>
      <Rest>残り {gameInfo.rest}</Rest>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  width: ${KyokuInfoWidth}px;
  height: ${KyokuInfoHeight}px;
  background: darkcyan;
  transform: translate(${(HyojiWidth - KyokuInfoWidth) / 2}px, ${(HyojiHeight - KyokuInfoHeight) / 2}px);
  transform-origin: center center 0;
`

const Kyoku = styled.div`
  font-size: 25px;
  font-weight: bold;
  line-height: 25px;
  color: white;
`

const Dora = styled.div`
  display: flex;
`

const Kyotaku = styled.div`
  height: 14px;
  font-size: 14px;
  font-weight: bold;
  line-height: 14px;
  display: flex;
  align-items: center;
  color: white;
`

const Tsumibou = styled.div`
  height: 14px;
  font-size: 14px;
  font-weight: bold;
  line-height: 14px;
  display: flex;
  align-items: center;
  color: white;
`

const Rest = styled.div`
  height: 14px;
  font-size: 14px;
  font-weight: bold;
  line-height: 14px;
  text-align: center;
  color: white;
`
