import React, { useEffect, useState } from 'react'
import { NavigationStackProp } from 'react-navigation-stack'
import TimeAgo from 'react-native-timeago'
import _Modal from 'react-native-modal'

import styled from 'styled-components/native'

import { icons } from 'assets/images'

import Button from 'src/controls/Button'
import Header from 'src/controls/navigation/Header'
import { navigate } from 'src/helpers/navigationService'
import Routes from 'src/constants/routes'

import RatingStars from 'src/components/Pdp/RatingStars'
import ReviewsFilters from 'src/components/Pdp/ReadReviews/ReviewsFilters'
import ReviewsChart from 'src/components/Pdp/ReadReviews/ReviewsChart'
import SortModal from 'src/components/Pdp/ReadReviews/SortModal'

const Container = styled.View`
  background-color: ${({ theme }) => theme.palette.white};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  flex: 1;
`
const ScrollContainer = styled.ScrollView``

const ItemContainer = styled.TouchableOpacity`
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const Modal = styled(_Modal)`
  background-color: white;
  margin-horizontal: 0;
  margin-bottom: 0;
  margin-top: 70%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding-bottom: ${({ theme }) => theme.spacing(4)};
`

const WriteReviewButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(1)}px;
  margin-vertical: ${({ theme }) => theme.spacing(3)};
  text-transform: uppercase;
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  font-size: 24;
  color: ${({ theme }) => theme.palette.grey1};
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`

const BookNameText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(1)};
  font-size: 16;
  letter-spacing: 0.4;
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.subtitle1};
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const FlexRowContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(1)};
  ${({ theme }) => theme.typography.body2};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const DefaultSortContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const IconClickable = styled.TouchableOpacity``

const TotalReviewsNumber = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: 33%;
`

const ReviewerText = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  flex: 1;
  text-align: left;
`

const TimeText = styled.Text`
  color: ${({ theme }) => theme.palette.grey3};
  align-self: flex-end;
`

const BodyText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  font-size: 14;
  letter-spacing: 0.4;
`

const HorizontalLine = styled.View`
  padding-top: ${({ theme }) => theme.spacing(1)};
  border-top-width: 0.5;
  border-top-color: ${({ theme }) => theme.palette.grey4};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

type Props = { navigation: NavigationStackProp }

const ReadListReviews = ({ navigation }: Props) => {
  useEffect(() => {
    setInitialList(listReviews)
  }, [])
  const product = navigation.getParam('product')
  const reviews = navigation.getParam('reviews')
  const productDetails = navigation.getParam('productDetails')

  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [listReviews, setListReviews] = useState(
    reviews[product.ean].reviewsResults,
  )
  const [initialList, setInitialList] = useState<any[]>([])
  const statistic = reviews[product.ean].reviewStatistics

  const sortValue: string[] = [
    'Most Relevant',
    'Most Helpful',
    'Highest to Lowest Rating',
    'Lowest to Highest Rating',
    'Featured',
    'Most Recent',
  ]

  const modalCloseHandler = (value) => {
    setModalIsVisible(!modalIsVisible)
    const updatedList = [...listReviews]

    if (value === 'Most Relevant') {
      updatedList.sort(
        (a, b) =>
          new Date(b.SubmissionTime).valueOf() -
            new Date(a.SubmissionTime).valueOf() ||
          new Date(b.LastModeratedTime).valueOf() -
            new Date(a.LastModeratedTime).valueOf() ||
          new Date(b.LastModificationTime).valueOf() -
            new Date(a.LastModificationTime).valueOf(),
      )
      setListReviews(updatedList)
    } else if (value === 'Most Helpful') {
      updatedList.sort((a, b) => b.Helpfulness - a.Helpfulness)
      setListReviews(updatedList)
    } else if (value === 'Highest to Lowest Rating') {
      updatedList.sort((a, b) => b.Rating - a.Rating)
      setListReviews(updatedList)
    } else if (value === 'Lowest to Highest Rating') {
      updatedList.sort((a, b) => a.Rating - b.Rating)
      setListReviews(updatedList)
    } else if (value === 'Featured') {
      updatedList.sort(
        (a, b) =>
          b.Helpfulness - a.Helpfulness &&
          b.ReviewText?.length - a.ReviewText?.length,
      )
      setListReviews(updatedList)
    } else if (value === 'Most Recent') {
      updatedList.sort(
        (a, b) =>
          new Date(b.SubmissionTime).valueOf() -
          new Date(a.SubmissionTime).valueOf(),
      )
      setListReviews(updatedList)
    } else if (value === 'reset') {
      updatedList.sort(
        (a, b) =>
          new Date(b.SubmissionTime).valueOf() -
          new Date(a.SubmissionTime).valueOf(),
      )
      setListReviews(updatedList)
    } else {
      updatedList.sort(
        (a, b) =>
          new Date(b.SubmissionTime).valueOf() -
          new Date(a.SubmissionTime).valueOf(),
      )
      setListReviews(updatedList)
    }
  }

  const modalOpenHandler = () => {
    setModalIsVisible(!modalIsVisible)
  }

  const cutString = (initialString) => {
    return initialString.slice(0, 238)
  }

  const reviewsNumbersCounter = (rating) => {
    for (let i = 0; i < statistic.length; i++) {
      if (statistic[i].RatingValue === rating) {
        return statistic[i].Count
      }
    }
    return 0
  }

  const ratingLevelPercentage = (rating) => {
    if (rating === 0) {
      return '0%'
    }
    let count: number = 0
    for (let i = 0; i < statistic.length; i++) {
      count = count + statistic[i].Count
    }
    return (rating / count) * 100 + '%'
  }

  const allFiltersSorting = (ratings, reader, spoiler) => {
    let updatedRatings: any[] = []
    let updatedReader: any[] = []
    let updatedSpoiler: any[] = []

    if (ratings.length === 0 && reader.length === 0 && spoiler.length === 0) {
      return setListReviews(initialList)
    } else {
      if (ratings.length !== 0) {
        for (let i = 0; i < initialList.length; i++) {
          for (let j = 0; j < ratings.length; j++) {
            if (initialList[i].Rating === +ratings[j][0]) {
              updatedRatings.push(initialList[i])
            }
          }
        }
      }

      if (reader.length !== 0) {
        for (let i = 0; i < initialList.length; i++) {
          for (let j = 0; j < reader.length; j++) {
            if (
              initialList[i].ContextDataValues.hasOwnProperty('ReaderType') &&
              initialList[i].ContextDataValues.ReaderType.ValueLabel ===
                reader[j]
            ) {
              updatedReader.push(initialList[i])
            }
          }
        }
      }

      if (spoiler.length !== 0) {
        for (let i = 0; i < initialList.length; i++) {
          for (let j = 0; j < spoiler.length; j++) {
            if (
              initialList[i].ContextDataValues.hasOwnProperty('Spoilers_2') &&
              initialList[i].ContextDataValues.Spoilers_2.Value === spoiler[j]
            ) {
              updatedSpoiler.push(initialList[i])
            }
          }
        }
      }
      let resulted = [...updatedRatings, ...updatedReader, ...updatedSpoiler]
      let uniq = (resulted) => [...new Set(resulted)]
      setListReviews(uniq(resulted))
    }
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
        <SortModal modalClose={modalCloseHandler} content={sortValue} />
      </Modal>

      <TitleText>Customer Reviews</TitleText>
      <ReviewsChart
        ratingLevel={5}
        size={20}
        start="10%"
        end={ratingLevelPercentage(reviewsNumbersCounter(5))}
        reviewsNumber={reviewsNumbersCounter(5)}
      />
      <ReviewsChart
        ratingLevel={4}
        size={20}
        start="10%"
        end={ratingLevelPercentage(reviewsNumbersCounter(4))}
        reviewsNumber={reviewsNumbersCounter(4)}
      />
      <ReviewsChart
        ratingLevel={3}
        size={20}
        start="10%"
        end={ratingLevelPercentage(reviewsNumbersCounter(3))}
        reviewsNumber={reviewsNumbersCounter(3)}
      />
      <ReviewsChart
        ratingLevel={2}
        size={20}
        start="10%"
        end={ratingLevelPercentage(reviewsNumbersCounter(2))}
        reviewsNumber={reviewsNumbersCounter(2)}
      />
      <ReviewsChart
        ratingLevel={1}
        size={20}
        start="10%"
        end={ratingLevelPercentage(reviewsNumbersCounter(1))}
        reviewsNumber={reviewsNumbersCounter(1)}
      />

      <WriteReviewButton
        onPress={() =>
          navigation.navigate(Routes.PDP__WRITE_REVIEW, {
            product: product,
            publisher: productDetails?.bookTabs?.productDetails?.publisher,
          })
        }
        variant="outlined"
        center
        maxWidth
        linkGreen
      >
        Write a review
      </WriteReviewButton>
      <DefaultSortContainer>
        <IconClickable onPress={modalOpenHandler}>
          <Icon source={icons.sortDefault} />
        </IconClickable>
        <TotalReviewsNumber>{listReviews.length} Reviews</TotalReviewsNumber>
      </DefaultSortContainer>
      <ReviewsFilters filtersStack={allFiltersSorting} />
      <ScrollContainer>
        {listReviews?.map((el, index) => {
          return (
            <ItemContainer
              onPress={() =>
                navigate(Routes.PDP__READ_ITEM_REVIEW, {
                  title: el.Title,
                  rating: el.Rating,
                  nickName: el.UserNickname,
                  text: el.ReviewText,
                  time: el.SubmissionTime,
                })
              }
              key={index}
            >
              <RatingStars ratingLevel={el.Rating} size={20} isLeft={true} />
              <FlexRowContainer>
                <ReviewerText>{el.UserNickname}</ReviewerText>
                <TimeText>
                  <TimeAgo time={el.SubmissionTime} />
                </TimeText>
              </FlexRowContainer>
              <BookNameText>{el.Title}</BookNameText>
              <BodyText>
                {el.ReviewText?.length > 238
                  ? cutString(el.ReviewText)
                  : el.ReviewText}
              </BodyText>
              <HorizontalLine />
            </ItemContainer>
          )
        })}
      </ScrollContainer>
    </Container>
  )
}

ReadListReviews.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
  title: 'Customer Reviews',
})

export default ReadListReviews
