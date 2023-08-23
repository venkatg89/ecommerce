import React, { useContext, useState } from 'react'
import { connect } from 'react-redux'
import { store } from 'src/redux'
import Rate, { AndroidMarket } from 'react-native-rate'
import config from 'config'
import styled, { ThemeContext } from 'styled-components/native'
import { Platform, Linking } from 'react-native'
import Button from 'src/controls/Button'
import MegaphonePublicIcon from 'src/icons/MegaphonePublic'
import MyBooksIcon from 'src/icons/MyBooks'
import CommunityIcon from 'src/icons/Community'
import LocationFindStoreIcon from 'src/icons/LocationFindStore'
import CafeOrderIcon from 'src/icons/CafeOrder'
import DeviceInfo from 'react-native-device-info'
import { CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'
import { Routes, Params, push } from 'src/helpers/navigationService'
import { TIP_TYPE } from 'src/redux/reducers/UserReducer/TipsReducer/index'
import { acceptTipAction, dismissTipAction, setTipsOptions } from 'src/redux/actions/user/tipsActions'
import { setAppReviewAction } from 'src/redux/actions/user/appReviewAction'
import { ReviewType } from 'src/redux/reducers/UserReducer/AppReviewReducer'
import { getReadingListBooksSelector, getMostRecentReadingBookDateSelector } from 'src/redux/selectors/myBooks/booksSelector'
import { isUserLoggedInSelector } from 'src/redux/selectors/userSelector'
import { ReadingStatus } from 'src/models/ReadingStatusModel'
import { SearchTypesKeys } from 'src/constants/search'

interface ContainerProps {
  currentWidth: number
}

const Container = styled.View<ContainerProps>`
  flex: 1;
  flex-direction: column;
  ${({ theme, currentWidth }) => (DeviceInfo.isTablet()
    ? `margin: ${theme.spacing(3)}px ${CONTENT_HORIZONTAL_PADDING(currentWidth)}px;`
    : `margin: ${theme.spacing(2)}px;`
  )}
  ${({ theme }) => Platform.OS === 'android' && (DeviceInfo.isTablet()
    ? `margin-top: ${theme.spacing(4)};`
    : `margin-top: ${theme.spacing(3)};`
  )}
`

const Content = styled.View`
  ${({ theme }) => theme.boxShadow.container}
  border-radius: 4;
  background-color: ${props => props.theme.palette.white};
  justify-content: center;
  position: relative;
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const CardHeader = styled.View`
  height: 64;
  background-color: 'rgb(52,98,80)';
  border-top-left-radius: 4;
  border-top-right-radius: 4;
  justify-content: center;
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  color:${({ theme }) => theme.palette.white};
  text-align: center;
`

const Text = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color:${({ theme }) => theme.palette.grey2};
  text-align: center;
  padding: ${({ theme }) => theme.spacing(2)}px ${({ theme }) => theme.spacing(2)}px ${({ theme }) => theme.spacing(3)}px ${({ theme }) => theme.spacing(2)}px;

`
const IconContainer = styled.View`
  background-color: 'rgb(52,98,80)';
  width: 32;
  height: 32;
  justify-content: center;
  align-self: center;
  border-radius: 50;
  z-index: 1;
  overflow: visible;
  position: absolute;
  top: ${({ theme }) => -theme.spacing(2)};
`

const PrimaryButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(1)}px;
  min-width: 65%;
`

const SecondaryButton = styled(Button)`
  padding-top: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.palette.linkGreen};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`

const userTip = {
  [TIP_TYPE.REVIEW_APP]: {
    icon: <MegaphonePublicIcon color="rgb(225,217,201)" width={ 32 } height={ 20 } />,
    title: 'Having a Good Time?',
    text: 'We want to bring you the best in books, recommendations, and everything else B&N has to offer. Have you enjoyed the B&N app experience?',
    buttons: {
      primary: {
        text: 'It\'s great!',
        onPress: async () => {
          Rate.rate({
            AppleAppID: config.appReview.appleAppId,
            GooglePackageName: config.appReview.googlePackageName,
            preferredAndroidMarket: AndroidMarket.Google,
            preferInApp: false,
            openAppStoreIfInAppFails: true,
            fallbackPlatformURL: config.appReview.fallbackUrl,
          }, () => {})
          await store.dispatch(setAppReviewAction(ReviewType.RATED))
        },
      },
      secondary: {
        text: 'It\'s OK but...',
        onPress: async () => {
          const url = `mailto:${config.appReview.feedbackEmail}`
          const mailTo = await Linking.canOpenURL(url)
          if (mailTo) {
            Linking.openURL(url)
          }
          await store.dispatch(setAppReviewAction(ReviewType.SENT_FEEDBACK))
        },
      },
    },
  },
  [TIP_TYPE.ADD_TO_FINISHED_LIST]: {
    icon: <MyBooksIcon color="rgb(225,217,201)" width={ 32 } height={ 20 } />,
    title: 'Better Recommendations',
    text: 'Add books to your Finished list to help us give you better recommendations for your next read.',
    buttons: {
      primary: {
        text: 'Add books now',
        onPress: async () => {
          const state = store.getState()
          if (isUserLoggedInSelector(state)) {
            push(Routes.SEARCH__MAIN_LEGACY)
            return
          }

          const _getReadingListBooksSelector = getReadingListBooksSelector()
          push(Routes.ONBOARDING__READ_BOOKS, { [Params.USER_TIP]: {
            type: TIP_TYPE.ADD_TO_FINISHED_LIST,
            alreadyReadBooksCount: Object.keys(_getReadingListBooksSelector(state, { status: ReadingStatus.FINISHED })).length,
          } })
        },
      },
      secondary: {
        text: 'Maybe later',
        onPress: async () => {},
      },
    },
  },
  [TIP_TYPE.ASK_QUESTIONS]: {
    icon: <CommunityIcon color="rgb(225,217,201)" width={ 32 } height={ 20 } />,
    title: 'Find Your Next Book',
    text: 'Ready for another book? Ask the Community for recommendations to help find your next favorite.',
    buttons: {
      primary: {
        text: 'Ask the Community',
        onPress: async () => push(Routes.COMMUNITY__ASK),
      },
      secondary: {
        text: 'I know my next read',
        onPress: async () => push(Routes.SEARCH__MAIN_LEGACY),
      },
    },
  },
  [TIP_TYPE.ADD_TO_READING_LIST]: {
    icon: <MyBooksIcon color="rgb(225,217,201)" width={ 32 } height={ 20 } />,
    title: 'What Are You Reading?',
    text: 'Let other Readers know what you\'re reading now by adding the book to your Reading list.',
    buttons: {
      primary: {
        text: 'Add my book',
        onPress: async () => push(Routes.SEARCH__MAIN_LEGACY),
      },
      secondary: {
        text: 'Maybe later',
        onPress: async () => {},
      },
    },
  },
  [TIP_TYPE.FIND_FRIENDS]: {
    icon: <MegaphonePublicIcon color="rgb(225,217,201)" width={ 32 } height={ 20 } />,
    title: 'Connect with Friends',
    text: 'Find fellow readers with similar interests in Community, or invite your friends to join.',
    buttons: {
      primary: {
        text: 'Invite friends',
        onPress: async () => push(Routes.SEARCH__MAIN_LEGACY, { [Params.SEARCH_TYPE]: SearchTypesKeys.READERS }),
      },
      secondary: {
        text: 'Maybe later',
        onPress: async () => {},
      },
    },
  },
  [TIP_TYPE.CHOOSE_STORE]: {
    icon: <LocationFindStoreIcon color="rgb(225,217,201)" width={ 32 } height={ 20 } />,
    title: 'Find My B&N',
    text: 'Choose your My B&N to learn about the events happening at your favorite store. Plus, get quick access to store info and Café ordering.',
    buttons: {
      primary: {
        text: 'Find My Store',
        onPress: async () => push(Routes.MY_BN__SEARCH_STORE),
      },
      secondary: {
        text: 'Not right now',
        onPress: async () => {},
      },
    },
  },
  [TIP_TYPE.ANSWER_QUESTIONS]: {
    icon: <CommunityIcon color="rgb(225,217,201)" width={ 32 } height={ 20 } />,
    title: 'Share the Book Love',
    text: 'Have something to share about your recently finished book? Head over to Community to recommend someone else\'s next read.',
    buttons: {
      primary: {
        text: 'Share my favorites',
        onPress: async () => {
          await store.dispatch(setTipsOptions({ hasAnswerQuestions: false }))
          push(Routes.COMMUNITY__MAIN)
        },
      },
      secondary: {
        text: 'Maybe later',
        onPress: async () => {
          await store.dispatch(setTipsOptions({ hasAnswerQuestions: false }))
        },
      },
    },
  },
  [TIP_TYPE.ORDER_FROM_CAFE]: {
    icon: <CafeOrderIcon color="rgb(225,217,201)" width={ 32 } height={ 20 } />,
    title: 'Need a Coffee Break?',
    text: '',
    buttons: {
      primary: {
        text: 'Get my order ready',
        onPress: async () => {
          push(Routes.CAFE__MAIN)
        },
      },
      secondary: {
        text: 'Not right now',
        onPress: async () => {},
      },
    },
  },
}

interface OwnProps {
  tipType: TIP_TYPE;
}

interface DispatchProps {
  dismissTip: (tip: TIP_TYPE) => void;
  acceptTip: (tip: TIP_TYPE) => void;
}

const dispatcher = dispatch => ({
  dismissTip: tip => dispatch(dismissTipAction(tip)),
  acceptTip: tip => dispatch(acceptTipAction(tip)),
})

const connector = connect<null, DispatchProps, OwnProps>(null, dispatcher)

type Props = OwnProps & DispatchProps

export default connector(({ tipType, dismissTip, acceptTip }: Props) => {
  const { width } = useResponsiveDimensions()
  const content = userTip[tipType] || null
  const { palette } = useContext(ThemeContext)
  const [dismiss, setDismiss] = useState(false)
  const dismissTextStyle = { color: palette.linkGreen }
  if (!content || dismiss) {
    return null
  }

  if (tipType === TIP_TYPE.ORDER_FROM_CAFE) {
    content.text = `Order a latte from the Café ${(getMostRecentReadingBookDateSelector())(store.getState())
      ? 'to go with your current read'
      : 'and find your next read'}. Customize and pay for your items, pick up, and enjoy!`
  }

  return (
    <Container currentWidth={ width }>
      <Content>
        <CardHeader>
          <HeaderText>{content.title}</HeaderText>
        </CardHeader>
        <Text>
          {content.text}
        </Text>
        <PrimaryButton
          center
          size="small"
          variant="contained"
          onPress={ async () => {
            await Promise.all([
              acceptTip(tipType),
              setDismiss(!dismiss),
              content.buttons.primary.onPress(),
            ])
          } }
        >
          { content.buttons.primary.text }
        </PrimaryButton>
        <SecondaryButton
          center
          size="small"
          onPress={ async () => {
            await Promise.all([
              dismissTip(tipType),
              setDismiss(!dismiss),
              content.buttons.secondary.onPress(),
            ])
          } }
          textStyle={ dismissTextStyle }
        >
          { content.buttons.secondary.text }
        </SecondaryButton>
        <IconContainer>
          {content.icon}
        </IconContainer>
      </Content>
    </Container>
  )
})
