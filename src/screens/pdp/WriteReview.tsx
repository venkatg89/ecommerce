import React, { useState, useEffect } from 'react'
import Header from 'src/controls/navigation/Header'
import styled from 'styled-components/native'
import { NavigationStackProp } from 'react-navigation-stack'
import TextField from 'src/controls/form/TextField'
import RatingStars from 'src/components/Pdp/RatingStars'
import TagLabel from 'src/components/Pdp/TagLabel'
import TitledSwitch from 'src/controls/TitledSwitch'
import Button from 'src/controls/Button'
import Select from 'src/controls/form/Select'
import TermsAndConditions from 'src/components/TermsAndConditions'
import _Modal from 'react-native-modal'
import { Platform } from 'react-native'
import ReviewTermsContent from 'src/components/Pdp/ReviewTermsContent'
import { submitReviewAction } from 'src/redux/actions/pdp/bazaarvoice'
import { connect } from 'react-redux'
import { ReviewsStateModel } from 'src/models/PdpModel'
import { createStructuredSelector } from 'reselect'
import { reviewsSelector } from 'src/redux/selectors/pdpSelector'
import { REVIEW_FORM } from 'src/constants/formErrors'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'
import { FormErrors } from 'src/models/FormModel'
import {
  addEventAction,
  LL_REVIEW_SUBMITTED,
} from 'src/redux/actions/localytics'

const Container = styled.ScrollView`
  background-color: ${({ theme }) => theme.palette.white};
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

const PostReviewButton = styled(Button)`
  padding-horizontal: ${({ theme }) => theme.spacing(4)};
  padding-vertical: ${({ theme }) => theme.spacing(2)};
  flex: 1;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(4)};
`
const SubTitle = styled.Text`
  font-size: 14;
  letter-spacing: 0.4;
  color: ${({ theme }) => theme.palette.grey2};
`
const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  font-size: 24;
  color: ${({ theme }) => theme.palette.grey1};
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`

const HeaderText = styled.View`
  flex-direction: column;
  max-width: 215;
`

const StyledImage = styled.Image`
  width: 112;
  height: 160;
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`
const CharLength = styled.Text`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.grey2};
  padding-right: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(1) / 2};
  align-self: flex-end;
`

const TagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`

const SecondaryTitle = styled.Text`
  font-size: 16;
  letter-spacing: 0.4;
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.subtitle1};
  font-weight: bold;
  margin-top: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`
const InfoText = styled.Text`
  font-size: 12;
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(0.5)};
  margin-left: ${({ theme }) => theme.spacing(1.5)};
`
const Modal = styled(_Modal)`
  background-color: white;
  margin-horizontal: 0;
  margin-bottom: 0;
  ${Platform.OS === 'android'
    ? `
      margin-top: 15%
    `
    : 'margin-top: 25%'}

  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding-bottom: ${({ theme }) => theme.spacing(4)};
`
interface StateProps {
  reviewState: ReviewsStateModel
  formError: FormErrors
}

const selector = createStructuredSelector({
  reviewState: reviewsSelector,
  formError: formErrorsSelector,
})

interface DispatchProps {
  submitReview: (params) => void
  addEvent: (name, attributes) => void
}

const dispatcher = (dispatch) => ({
  submitReview: (params) => dispatch(submitReviewAction(params)),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})
const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = DispatchProps & StateProps & { navigation: NavigationStackProp }

const WriteReviewScreen = ({
  navigation,
  submitReview,
  reviewState,
  formError,
  addEvent,
}: Props) => {
  const product = navigation.getParam('product')
  const publisher = navigation.getParam('publisher')
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [review, setReview] = useState({
    ProductId: product.ean,
    Action: 'submit',
    usernickname: '',
    Title: '',
    ReviewText: '',
    Rating: 1,
    IsRecommended: false,
    agreedtotermsandconditions: false,
    contextdatavalue_Spoilers_2: 'No',
    contextdatavalue_ReaderType: '',
    useremail: '',
  })

  const imageSource = {
    uri: product.imageList?.length > 0 ? product.imageList[0] : '',
  }

  const getSubmitReviewTags = async () => {
    await submitReview({ ProductId: product.ean })
  }

  const modalCloseHandler = () => {
    setModalIsVisible(!modalIsVisible)
  }

  useEffect(() => {
    getSubmitReviewTags()
  }, [])

  const finalSubmit = async () => {
    await submitReview(review)
    const productReview = {
      productFormat: product.parentFormat,
      productTitle: product.name,
      productId: product.ean,
      starRating: review.Rating,
      recommend: review.IsRecommended ? 'yes' : 'no',
      containSpoilers: review.contextdatavalue_Spoilers_2 ? 'yes' : 'no',
      readerTypeDescription: review.contextdatavalue_ReaderType,
    }
    addEvent(LL_REVIEW_SUBMITTED, productReview)
  }
  return (
    <Container>
      <HeaderContainer>
        <HeaderText>
          <TitleText>Write a Review</TitleText>
          <SubTitle>{product.name}</SubTitle>
          <SubTitle>{publisher}</SubTitle>
        </HeaderText>
        <StyledImage resizeMode="contain" source={imageSource} />
      </HeaderContainer>
      <RatingStars
        ratingLevel={review.Rating}
        onStarPress={(value) => setReview({ ...review, Rating: value })}
        title="Overall Rating"
        size={46}
      />
      <TextField
        label="Review Title"
        style={{ marginTop: 32 }}
        maxLength={50}
        endAdornment
        value={review.Title}
        onChange={(value) => {
          setReview({ ...review, Title: value })
        }}
        formId={REVIEW_FORM}
        formFieldId="title"
      />
      <TextField
        label="Review"
        maxLength={175}
        value={review.ReviewText}
        onChange={(value) => {
          setReview({ ...review, ReviewText: value })
        }}
        numberOfLines={5}
        endAdornment
        style={{ marginTop: 42 }}
        formId={REVIEW_FORM}
        formFieldId="reviewText"
      />
      <CharLength>{`${review.ReviewText.length} / 175`}</CharLength>

      <SecondaryTitle>
        Would you recommend this product to a friend?
      </SecondaryTitle>
      <TitledSwitch
        values={[false, true]}
        leftText="No"
        rightText="Yes"
        activeValue={review.IsRecommended}
        onValueChange={() =>
          setReview({ ...review, IsRecommended: !review.IsRecommended })
        }
      />

      {reviewState &&
        reviewState[product.ean] &&
        reviewState[product.ean].submitReviewDetails &&
        reviewState[product.ean].submitReviewDetails.tags.length > 0 && (
          <>
            <SecondaryTitle>Tag this Book</SecondaryTitle>
            <TagsContainer>
              {reviewState[product.ean].submitReviewDetails.tags.map((item) => (
                <TagLabel
                  key={item.id}
                  withIcon={true}
                  text={item.name}
                  isSelected={review.hasOwnProperty(item.id)}
                  onSelect={() => {
                    const keys = Object.keys(review)
                    if (keys.includes(item.id)) {
                      const helper = { ...review }
                      delete helper[item.id]
                      setReview(helper)
                    } else {
                      const helper = { ...review }
                      helper[item.id] = true
                      setReview(helper)
                    }
                  }}
                />
              ))}
            </TagsContainer>
          </>
        )}
      <SecondaryTitle>Does your review contain spoilers?</SecondaryTitle>
      <TitledSwitch
        values={['No', 'Yes']}
        leftText="No"
        rightText="Yes"
        activeValue={review.contextdatavalue_Spoilers_2}
        onValueChange={() =>
          setReview({
            ...review,
            contextdatavalue_Spoilers_2:
              review.contextdatavalue_Spoilers_2 === 'Yes' ? 'No' : 'Yes',
          })
        }
      />

      {reviewState &&
        reviewState[product.ean]?.submitReviewDetails &&
        reviewState[product.ean]?.submitReviewDetails.readerTypes.length >
          0 && (
          <>
            <SecondaryTitle>
              What type of reader best describes you?
            </SecondaryTitle>
            <Select
              label="Select one"
              data={reviewState[product.ean]?.submitReviewDetails.readerTypes}
              value={review.contextdatavalue_ReaderType || ''}
              onChange={(value) => {
                setReview({ ...review, contextdatavalue_ReaderType: value })
              }}
            />
          </>
        )}
      <TextField
        label="Username"
        style={{ marginTop: 26 }}
        maxLength={50}
        value={review.usernickname}
        onChange={(value) => setReview({ ...review, usernickname: value })}
        formId={REVIEW_FORM}
        formFieldId="usernickname"
      />
      <InfoText>This will be posted on bn.com</InfoText>
      <TextField
        label="Email Adress"
        maxLength={50}
        value={review.useremail}
        onChange={(value) => {
          setReview({
            ...review,
            useremail: value,
          })
        }}
        style={{ marginTop: 8 }}
        formId={REVIEW_FORM}
        formFieldId="hostedauthentication_authenticationemail"
      />
      <TermsAndConditions
        isSelected={review.agreedtotermsandconditions}
        onSelect={() =>
          setReview({
            ...review,
            agreedtotermsandconditions: !review.agreedtotermsandconditions,
          })
        }
        onPress={() => {
          setModalIsVisible(true)
        }}
        formId={REVIEW_FORM}
        formFieldId="agreedtotermsandconditions"
      />
      <Modal
        animationType="fade"
        isVisible={modalIsVisible}
        backdropOpacity={0.4}
        useNativeDriver={false}
        swipeDirection={['down']}
        onSwipeComplete={modalCloseHandler}
        propagateSwipe={true}
      >
        <ReviewTermsContent onPress={modalCloseHandler} />
      </Modal>

      <PostReviewButton
        variant="contained"
        onPress={() => {
          finalSubmit()
        }}
      >
        Post Review
      </PostReviewButton>
    </Container>
  )
}

WriteReviewScreen.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(WriteReviewScreen)
