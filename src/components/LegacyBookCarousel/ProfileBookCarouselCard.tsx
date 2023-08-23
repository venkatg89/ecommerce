import React from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import BookCarousel from 'src/components/LegacyBookCarousel'

import { BookOrEan, Ean } from 'src/models/BookModel'

import countLabelText from 'src/helpers/countLabelText'

import { booksOrEanListSelector } from 'src/redux/selectors/booksListSelector'
import { icons } from 'assets/images'


const Container = styled.View`
  background-color: ${({ theme }) => theme.palette.white};
  border-radius: 3;
  border-width: 0.5;
  border-style: solid;
  border-color: ${({ theme }) => theme.border.color};
  shadow-offset: 0px 1px;
  shadow-color: black;
  shadow-radius: 5px;
  shadow-opacity: 0.18;
  overflow: visible;
  elevation: 5;
`

const Title = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.heading2}
  align-self: center;
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`

const Button = styled.TouchableOpacity`
  color: ${({ theme }) => theme.palette.linkGreen};
  ${({ theme }) => theme.typography.button.small}
  padding-top: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const SeeFullList = styled.Text`
  align-self: center;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.linkGreen};
  ${({ theme }) => theme.typography.button.regular}
`

const PrivateContainer = styled.View`
  flex:1;
  flex-direction:row;
  justify-content:center;
  align-items: center;
  margin-bottom:${({ theme }) => theme.spacing(4)};
`

const PrivateText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color:${({ theme }) => theme.palette.grey1};
  margin-left:${({ theme }) => theme.spacing(0.5)};
`

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(2)};
  width: ${({ theme }) => theme.spacing(2)};
`
interface OwnProps {
  title: string
  // eslint-disable-next-line react/no-unused-prop-types
  eans: Ean[]
  style?: any
  bookMaxHeight?: number
  bookMaxWidth?: number
  onSeeFullList?: () => void
  isPrivate?: boolean
}

interface StateProps {
  bookOrEanList: BookOrEan[]
}

const selector = createStructuredSelector({
  bookOrEanList: (state, ownProps) => {
    const { ean } = ownProps
    return booksOrEanListSelector(state, { ean })
  },
})


const connector = connect<StateProps, OwnProps>(selector)

type Props = OwnProps & StateProps

const BookCarouselCard = ({ title, bookOrEanList, style, bookMaxHeight, bookMaxWidth, onSeeFullList, isPrivate }: Props) => (
  <Container
    style={ style }
  >
    <Title>
      { title }
    </Title>
    {isPrivate && (
    <PrivateContainer>
      <Icon source={ icons.lockClosed } />
      <PrivateText>Private</PrivateText>
    </PrivateContainer>
    )}
    <BookCarousel
      accessible={ false }
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      bookOrEanList={ bookOrEanList }
      bookMaxHeight={ bookMaxHeight || 104 }
      bookMaxWidth={ bookMaxWidth || 74 }
      leftPadTypeMobile="content-padding"
      rightPadTypeMobile="book-width"
      leftPadTypeTablet={ 2 }
      rightPadTypeTablet={ 2 }
    />
    <Button onPress={ onSeeFullList }>
      <SeeFullList>
        {`See All ${countLabelText(bookOrEanList.length, 'book', 'books')}`}
      </SeeFullList>
    </Button>
  </Container>
)


export default connector(BookCarouselCard)
