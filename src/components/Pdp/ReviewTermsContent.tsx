import React from 'react'
import styled from 'styled-components/native'
import { icons } from 'assets/images'
import { TouchableOpacity } from 'react-native'
import { submitReviewTerms } from 'src/constants/termsAndConditions'

const Container = styled.View`
  flex: 1;
  margin-top: ${({ theme }) => theme.spacing(3)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`
const TextContainer = styled.ScrollView``

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
`

const SubTitle = styled.Text`
  ${({ theme }) => theme.typography.subTitle2}
  margin-vertical:${({ theme }) => theme.spacing(2)};
`

const TermsText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  font-size: 16;
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`

const IconClose = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`
const CloseContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-end;
`
interface Props {
  onPress: () => void
}

const ReviewTermsContent = ({ onPress }: Props) => {
  return (
    <Container>
      <CloseContainer onPress={onPress}>
        <IconClose source={icons.actionClose} />
      </CloseContainer>
      <TitleText>Terms and Conditions </TitleText>
      <SubTitle>
        CUSTOMER RATINGS AND REVIEWS AND QUESTIONS AND ANSWERS TERMS OF USE
      </SubTitle>
      <TextContainer>
        <TouchableOpacity>
          <TermsText>{submitReviewTerms}</TermsText>
        </TouchableOpacity>
      </TextContainer>
    </Container>
  )
}

export default ReviewTermsContent
