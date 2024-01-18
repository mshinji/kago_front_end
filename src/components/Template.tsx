import styled from 'styled-components'

import { Footer } from './Footer'
import { GameField } from './GameField'
import { Header } from './Header'
import { ModeSelect } from './ModeSelect'

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
  min-width: 100%;
  min-height: 100vh;
  background: black;
`
