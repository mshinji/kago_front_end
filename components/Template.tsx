import React from 'react'
import styled from 'styled-components'

import { Constants } from './Constants'
import { Footer } from './Footer'
import { GameField } from './GameField'
import { Header } from './Header'
import { ModeSelect } from './ModeSelect'

const { TemplateWidth } = Constants

export const Template = () => {
  return (
    <Wrapper>
      <Header />
      <ModeSelect />
      <GameField />
      <Footer />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: ${TemplateWidth}px;
  min-height: 100%;
  background: black;
`
