import React from 'react'
import styled from 'styled-components/native'
import Routes from 'src/constants/routes'
import { navigate } from 'src/helpers/navigationService'

const MainContainer = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.white};
`

const Container = styled.View`
  overflow: hidden;
  height: 180;
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading3};
  font-size: 20;
  color: ${({ theme }) => theme.palette.grey1};
`

const Button = styled.TouchableOpacity`
  flex-direction: row;
  margin-vertical: ${({ theme }) => theme.spacing(1)};
  align-self: flex-end;
`
const ButtonText = styled.Text`
  font-size: 12;
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1;
`

interface Props {
    EditorialReviews?: string
  }

const EditorialReviews = ({
    EditorialReviews,
}: Props) => {

  return (
    <MainContainer>
      <TitleText>Editorial Reviews</TitleText>
      <Container>
          {EditorialReviews}
      </Container>
      <Button>
        <ButtonText
          onPress={() => {
            navigate(Routes.PDP__OVERVIEW, {})
          }}
        >
          See more
        </ButtonText>
      </Button>
    </MainContainer>
  )
}

export default EditorialReviews
