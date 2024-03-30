import styled from 'styled-components'

export const Footer = () => {
  return (
    <Wrapper>
      <div>
        画像素材:
        <a href="https://majandofu.com/mahjong-images">麻雀豆腐</a>様
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
