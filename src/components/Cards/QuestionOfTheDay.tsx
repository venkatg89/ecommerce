import React from 'react'
import styled from 'styled-components/native'
import _Button from 'src/controls/Button'
import BookCarousel from 'src/components//LegacyBookCarousel'
import { BookOrEan } from 'src/models/BookModel'
import { QuestionModel } from 'src/models/Communities/QuestionModel'
import { CommunitiesInterestsModel } from 'src/models/Communities/InterestModel'
import { push, Routes } from 'src/helpers/navigationService'
import countLabelText from 'src/helpers/countLabelText'

interface WrapperProps {
  borderColor: HexColor
}

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  padding-top: ${({ theme }) => theme.spacing(3)}px;
  padding-bottom: ${({ theme }) => theme.spacing(1)}px;
  ${({ theme }) => theme.innerBoxShadow.container};
`

const Text = styled.Text`
  text-align: center;
  ${({ theme }) => theme.typography.specialHeading};
  color:${({ theme }) => theme.palette.grey3};
  padding-bottom: ${({ theme }) => theme.spacing(4)};
`

const Wrapper = styled.TouchableOpacity<WrapperProps>`
  align-self: center;
  border-bottom-width: 2;
  border-bottom-color: ${({ borderColor }) => borderColor};
`

const CategoryText = styled.Text`
  margin-bottom: 1;
  text-transform: uppercase;
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey1};
`

const Question = styled.Text`
  text-align:center;
  ${({ theme }) => theme.typography.heading3}
  color: ${({ theme }) => theme.palette.grey1};
  margin-top:${({ theme }) => theme.spacing(3)};
  padding-horizontal: ${({ theme }) => theme.spacing(4)};
`

const ButtonContainer = styled.View`
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(1)}px ${({ theme }) => theme.spacing(2)}px;
`

const CarouselWrapper = styled(BookCarousel)`
  align-self: center;
`

const AnswersFromReaders = styled.Text`
  text-align:center;
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-top:${({ theme }) => theme.spacing(3)};

`

const SeeFullList = styled.Text`
  align-self: center;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.linkGreen};
  ${({ theme }) => theme.typography.button.regular}
`

interface Props {
  question: QuestionModel,
  community: CommunitiesInterestsModel,
  books: BookOrEan[],
}
export default ({ question, community, books }: Props) => (
  <Container>
    <Text>Question of the Day</Text>
    <Wrapper
      onPress={ () => { push(Routes.COMMUNITY__QUESTIONS_CATEGORIES, { categoryId: community.id }) } }
      borderColor="#74c2e9"
    >
      <CategoryText>{community.name}</CategoryText>
    </Wrapper>
    <Question>{question.title}</Question>
    <ButtonContainer>
      <Button
        variant="contained"
        size="small"
        onPress={ () => push(Routes.COMMUNITY__ANSWER, { questionId: question.id, title: question.title }) }
        center
      >
        Add your Recommendation
      </Button>
    </ButtonContainer>
    <CarouselWrapper
      bookOrEanList={ books }
      bookMaxHeight={ 104 }
      bookMaxWidth={ 74 }
    />
    <AnswersFromReaders>
      {`${countLabelText(question.answerCount, 'answer', 'answers')} from readers`}
    </AnswersFromReaders>
    <ButtonContainer>
      <Button onPress={ () => push(Routes.COMMUNITY__QUESTION, { questionId: question.id }) } center size="small">
        <SeeFullList>See all answers</SeeFullList>
      </Button>
    </ButtonContainer>
  </Container>
)
