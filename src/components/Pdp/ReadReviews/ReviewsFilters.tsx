import React, { useState } from 'react'
import styled from 'styled-components/native'
import { icons } from 'assets/images'
import ReviewsFilterItem from 'src/components/Pdp/ReadReviews/ReviewsFiltersItem'
import _Modal from 'react-native-modal'
import ReviewsModal from './ReviewsModal'
import ReviewsAllFiltersModal from './ReviewsAllFiltersModal'

const Container = styled.View`
  background-color: ${({ theme }) => theme.palette.white};
`

const IconFilter = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  margin-right: ${({ theme }) => theme.spacing(1)};
`

const IconClickable = styled.TouchableOpacity``

const FiltersContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`

const Modal = styled(_Modal)`
  background-color: white;
  margin-horizontal: 0;
  margin-bottom: 0;
  margin-top: 98%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding-bottom: ${({ theme }) => theme.spacing(4)};
`

const AllFiltersModal = styled(Modal)`
  margin-top: 25%;
`

const CategoriesNumber = styled.View`
  position: absolute;
  margin-left: 12px;
  background-color: ${({ theme }) => theme.palette.primaryGreen};
  height: 16px;
  width: 16px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`
const CategoriesNumberText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.white}
  font-size: 11
  margin-left: 2px;
`

const ScrollHorizontal = styled.ScrollView``

interface Props {
  filtersStack: ([], [], []) => void
}

const ReviewsFilters = ({ filtersStack }: Props) => {
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [modalIsAllFiltersVisible, setModalIsAllFiltersVisible] = useState(
    false,
  )
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState([])

  const [ratingStack, setRatingStack] = useState([])
  const [readerStack, setReaderStack] = useState([])
  const [spoilerStack, setSpoilerStack] = useState([])

  const ratingValue: string[] = [
    '1 star ',
    '2 stars',
    '3 stars',
    '4 stars',
    '5 stars',
  ]
  const readerValue: string[] = [
    'Casual Reader',
    'Series Addict',
    'On-Trend Reader',
    'Film Fanatic',
    'Crime & Murder Obsessed',
  ]
  const spoilerValue: string[] = ['Yes', 'No']

  const ratingTitle: string = 'Rating'
  const readerTitle: string = 'Reader Type'
  const spoilerTitle: string = 'Contains Spoiler'

  const modalOpenHandler = (title, content) => {
    setModalIsVisible(!modalIsAllFiltersVisible)
    setModalTitle(title)
    setModalContent(content)
  }

  const modalOpenAllFiltersHandler = () => {
    setModalIsAllFiltersVisible(!modalIsVisible)
  }

  const modalCloseHandler = (title, value) => {
    setModalIsVisible(!modalIsVisible)
    if (title === 'Rating') {
      setRatingStack(value)
      filtersStack(value, readerStack, spoilerStack)
    } else if (title === 'Reader Type') {
      setReaderStack(value)
      filtersStack(ratingStack, value, spoilerStack)
    } else if (title === 'Contains Spoiler') {
      setSpoilerStack(value)
      filtersStack(ratingStack, readerStack, value)
    }
  }
  const modalCloseAllfiltersHandler = (
    ratingSelected,
    readerSelected,
    spoilerSelected,
  ) => {
    setModalIsAllFiltersVisible(!modalIsAllFiltersVisible)
    setRatingStack(ratingSelected)
    setReaderStack(readerSelected)
    setSpoilerStack(spoilerSelected)
    filtersStack(ratingSelected, readerSelected, spoilerSelected)
  }

  const removeItemHandler = (index, type) => {
    if (type === 'rating') {
      const updatedArray = [...ratingStack]
      updatedArray.splice(index, 1)
      setRatingStack(updatedArray)
      filtersStack(updatedArray, readerStack, spoilerStack)
    } else if (type === 'reader') {
      const updatedArray = [...readerStack]
      updatedArray.splice(index, 1)
      setReaderStack(updatedArray)
      filtersStack(ratingStack, updatedArray, spoilerStack)
    } else if (type === 'spoiler') {
      const updatedArray = [...spoilerStack]
      updatedArray.splice(index, 1)
      setSpoilerStack(updatedArray)
      filtersStack(ratingStack, readerStack, updatedArray)
    }
  }

  const selectedCategories = () => {
    let num: number = 0
    const ratingNotEmpty = ratingStack.length !== 0
    const readerNotEmpty = readerStack.length !== 0
    const spoilerNotEmpty = spoilerStack.length !== 0
    if (ratingNotEmpty && readerNotEmpty && spoilerNotEmpty) {
      num = 3
    } else if (
      (ratingNotEmpty && readerNotEmpty) ||
      (readerNotEmpty && spoilerNotEmpty) ||
      (ratingNotEmpty && spoilerNotEmpty)
    ) {
      num = 2
    } else if (ratingNotEmpty || readerNotEmpty || spoilerNotEmpty) {
      num = 1
    } else {
      num = 0
    }
    return num
  }

  return (
    <Container>
      <Modal
        animationType="fade"
        isVisible={modalIsVisible}
        backdropOpacity={0.4}
        useNativeDriver={false}
        swipeDirection={['down']}
        onSwipeComplete={modalCloseHandler}
      >
        <ReviewsModal
          modalClose={modalCloseHandler}
          title={modalTitle}
          content={modalContent}
        />
      </Modal>
      <AllFiltersModal
        animationType="fade"
        isVisible={modalIsAllFiltersVisible}
        backdropOpacity={0.4}
        useNativeDriver={false}
        swipeDirection={['down']}
        onSwipeComplete={modalCloseAllfiltersHandler}
      >
        <ReviewsAllFiltersModal
          modalClose={modalCloseAllfiltersHandler}
          ratingTitle={ratingTitle}
          ratingContent={ratingValue}
          ratingStack={ratingStack}
          readerTitle={readerTitle}
          readerStack={readerStack}
          readerContent={readerValue}
          spoilerTitle={spoilerTitle}
          spoilerStack={spoilerStack}
          spoilerContent={spoilerValue}
        />
      </AllFiltersModal>
      <FiltersContainer>
        <IconClickable onPress={modalOpenAllFiltersHandler}>
          <IconFilter source={icons.filter} />
          {selectedCategories() !== 0 ? (
            <CategoriesNumber>
              <CategoriesNumberText>
                {selectedCategories()}
              </CategoriesNumberText>
            </CategoriesNumber>
          ) : null}
        </IconClickable>
        <ScrollHorizontal horizontal={true} showsHorizontalScrollIndicator={false}>
          {ratingStack.length === 0 ? (
            <IconClickable
              onPress={() => modalOpenHandler(ratingTitle, ratingValue)}
            >
              <ReviewsFilterItem text={'Rating'} />
            </IconClickable>
          ) : (
            ratingStack.map((el, index) => (
              <IconClickable
                key={index}
                onPress={() => removeItemHandler(index, 'rating')}
              >
                <ReviewsFilterItem text={el} isSelected={true} />
              </IconClickable>
            ))
          )}
          {readerStack.length === 0 ? (
            <IconClickable
              onPress={() => modalOpenHandler(readerTitle, readerValue)}
            >
              <ReviewsFilterItem text={'Reader Type'} />
            </IconClickable>
          ) : (
            readerStack.map((el, index) => (
              <IconClickable
                key={index}
                onPress={() => removeItemHandler(index, 'reader')}
              >
                <ReviewsFilterItem text={el} isSelected={true} />
              </IconClickable>
            ))
          )}
          {spoilerStack.length === 0 ? (
            <IconClickable
              onPress={() => modalOpenHandler(spoilerTitle, spoilerValue)}
            >
              <ReviewsFilterItem text={'Contains Spoilers'} />
            </IconClickable>
          ) : (
            spoilerStack.map((el, index) => (
              <IconClickable
                key={index}
                onPress={() => removeItemHandler(index, 'spoiler')}
              >
                <ReviewsFilterItem text={el} isSelected={true} />
              </IconClickable>
            ))
          )}
        </ScrollHorizontal>
      </FiltersContainer>
    </Container>
  )
}

export default ReviewsFilters
