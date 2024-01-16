import React from 'react'
import styled from 'styled-components'

import { Constants } from './Constants'

interface PaiProps {
  no: number
  height: number
  isDisabled?: boolean
  rotationType?: 'up' | 'down'
  onClick?: () => void
}

export const Pai = (props: PaiProps) => {
  const { OriginalPaiHeight, OriginalPaiWidth } = Constants
  const height = props.height
  const width = (OriginalPaiWidth * height) / OriginalPaiHeight

  let no
  if (props.no >= 136) {
    no = 38
  } else if (props.no == 16) {
    no = 35
  } else if (props.no == 52) {
    no = 36
  } else if (props.no == 88) {
    no = 37
  } else {
    no = Math.floor(props.no / 4)
  }

  let transformStyle = ''
  if (props.rotationType == 'up') {
    transformStyle = `rotate(270deg)
    translate(${(height - width) / 2}px, ${(height - width) / 2}px)`
  }
  if (props.rotationType == 'down') {
    transformStyle = `rotate(270deg)
    translate(${-(height - width) / 2}px, ${(height - width) / 2}px)`
  }

  const customStyle = {
    opacity: props.isDisabled ? 0.7 : 1.0,
    transform: transformStyle,
  }

  return (
    <Wrapper {...props} width={props.rotationType ? height : width}>
      <img src={`/static/images/pai${no}.png`} width={width} height={props.height} style={customStyle} />
    </Wrapper>
  )
}

const Wrapper = styled.div.attrs(({ width, height }: { width: number; height: number }) => ({
  width: width,
  height: height,
}))`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  &:hover {
    cursor: pointer;
  }
`
