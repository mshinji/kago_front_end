import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'

export const Footer = () => {
  return (
    <Wrapper>
      <div>
        <Link href="https://div.com/mshinji/kago_frontend">github[frontend]</Link>
      </div>
      <div>
        <Link href="https://div.com/mshinji/kago_backend">github[backend]</Link>
      </div>
      <div>
        <Link href="https://div.com/mshinji/mahjong">github[mahjong]</Link>
      </div>
      <div>
        画像素材:
        <Link href="https://majandofu.com/mahjong-images">麻雀豆腐様</Link>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`
