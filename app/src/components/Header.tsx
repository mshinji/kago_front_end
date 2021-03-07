// import React from 'react';
import styled from 'styled-components';

export const Header = () => (
  <Wrapper>
    <Logo>
      <Tile color={'white'}></Tile>
      <Tile color={'green'}>發</Tile>
      <Tile color={'red'}>中</Tile>
    </Logo>
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 10%;
  background-color: black;
`;

const Logo = styled.div`
  width: 200px;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

const Tile = styled.div.attrs((props) => ({
  color: props.color,
}))`
  width: 45px;
  height: 63px;
  border-radius: 10px;
  background-color: white;
  color: ${(props) => props.color};
  font-weight: bold;
  font-size: 38px;
  line-height: 63px;
  text-align: center;
`;
