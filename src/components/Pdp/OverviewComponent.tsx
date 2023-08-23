import React from 'react'
import styled from 'styled-components/native'
import BooksellerComponent from 'src/components/Pdp/BooksellerComponent'
import { navigate, Routes } from 'src/helpers/navigationService'

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

const ContentText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  font-size: 16;
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

interface Props {
  booksellerContent?: string
  overviewText: string
  contentType?: string
}

export const VIEW_OVERVIEW = 'Overview'
export const VIEW_EDITORIAL_REVIEWS = 'EditorialReviews'

const OverViewComponent = ({ booksellerContent, overviewText, contentType }: Props) => {
  return (
    <MainContainer>
      <TitleText>{contentType === VIEW_OVERVIEW ? 'Overview' : 'Editorial Reviews'}</TitleText>
      <Container>
        {booksellerContent && (
          <BooksellerComponent
            booksellerContent={booksellerContent}
            numberOfLines={6}
            contentType={contentType}
          />
        )}
        <ContentText numberOfLines={11} elipsizeMode="tail">
          {overviewText}
        </ContentText>
      </Container>

      <Button>
        <ButtonText
          onPress={() => {
            navigate(Routes.PDP__OVERVIEW, {
              booksellerContent: booksellerContent,
              overviewText: overviewText,
              contentType: contentType,
            })
          }}
        >
          See more
        </ButtonText>
      </Button>
    </MainContainer>
  )
}

export default OverViewComponent
