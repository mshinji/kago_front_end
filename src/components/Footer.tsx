import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

export const Footer = () => {
  return (
    <Wrapper>
      <div>
        画像素材:
        <Link href="https://majandofu.com/mahjong-images">麻雀豆腐様</Link>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;
