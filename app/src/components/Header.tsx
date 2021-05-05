import styled from 'styled-components';

export const Header = () => (
  <Wrapper>
    <Title>麻雀AI KAGO</Title>
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 10%;
  background-color: gray;
  padding: 5px 0;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 18px;
  font-weight: bold;
`;
