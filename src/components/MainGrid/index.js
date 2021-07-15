import styled from 'styled-components'


const MainGrid = styled.main `
  display: grid;
  grid-gap: 10px;
  padding: 16px;
  margin: 0 auto;

  @media(min-width: 860px) {
    grid-template-areas: "profileArea welcomeArea profileRelationArea";
    grid-template-columns: 160px 1fr 312px;
  }
`

export default MainGrid