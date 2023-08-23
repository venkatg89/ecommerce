import React from 'react'
import styled, { withTheme } from 'styled-components/native'
import { NavigationInjectedProps } from 'react-navigation'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Dimensions, ScaledSize } from 'react-native'

import _Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'
import Select from 'src/controls/form/Select'
import _TextField from 'src/controls/form/TextField'

import { askRecommendationAction } from 'src/redux/actions/communities/askRecommendationAction'
import { fetchCommunityInterestsAction } from 'src/redux/actions/communities/fetchInterestsAction'
import { communitiesInterestsListSelector } from 'src/redux/selectors/communities/interestsListSelector'
import { CommunitiesInterestsList } from 'src/models/Communities/InterestModel'
import { ThemeModel } from 'src/models/ThemeModel'
import { navigate, Routes } from 'src/helpers/navigationService'

import _Button from 'src/controls/Button'
import DiscardQuestionModal from 'src/components/Community/DiscardQuestionModal'
import KeyboardAwareScrollView from 'src/controls/KeyboardAwareScrollView'
import {
  CONTENT_HORIZONTAL_PADDING,
  CONTENT_VERTICAL_PADDING,
} from 'src/constants/layout'

interface State {
  communityId: number
  title: string
  showModal: boolean
  currentDimension: ScaledSize
}

interface ThemeProps {
  theme: ThemeModel
}

interface ContainerProps {
  currentWidth: number
}

const Container = styled(_Container)<ContainerProps>`
  padding-vertical: ${CONTENT_VERTICAL_PADDING};
  padding-horizontal: ${({ currentWidth }) =>
    CONTENT_HORIZONTAL_PADDING(currentWidth)};
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
`

const Description = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const TextField = styled(_TextField)`
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const CharLength = styled.Text`
  align-self: flex-end;
  padding-right: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(1) / 2};
`

const ButtonContainer = styled.View`
  justify-content: flex-end;
  flex: 1;
`

const Button = styled(_Button)``

interface StateProps {
  interestList: CommunitiesInterestsList
}

const selector = createStructuredSelector({
  interestList: communitiesInterestsListSelector,
})

interface DispatchProps {
  askRecommendation: (communityId: number, title: string) => boolean
  fetchCommunityInterests: () => void
}

const dispatcher = (dispatch) => ({
  askRecommendation: (communityId, title) =>
    dispatch(askRecommendationAction(communityId, title)),
  fetchCommunityInterests: () => dispatch(fetchCommunityInterestsAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps & ThemeProps

class AskRecommendationScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      title: 'Questions',
      header: (headerProps) => (
        <Header
          headerProps={headerProps}
          onPressBack={params.handleOpenModal}
        />
      ),
    }
  }

  state = {
    communityId: 0,
    title: '',
    showModal: false,
    currentDimension: Dimensions.get('screen'),
  }

  handleSetDimension = (dims) => {
    this.setState({ currentDimension: dims.screen })
  }

  componentWillMount() {
    Dimensions.addEventListener('change', this.handleSetDimension)
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.handleSetDimension)
  }

  componentDidMount() {
    const { fetchCommunityInterests, navigation } = this.props
    fetchCommunityInterests()
    const categoryId = navigation.getParam('categoryId')
    if (categoryId) {
      this.setState({ communityId: categoryId })
    }
    navigation.setParams({ handleOpenModal: this.openModal })
  }

  openModal = () => {
    const { navigation } = this.props
    const { title } = this.state
    if (title) {
      this.setState({ showModal: true })
    } else {
      navigation.goBack()
    }
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  goBack = () => {
    const { navigation } = this.props
    this.closeModal()
    navigation.goBack()
  }

  setCategory = (value: number) => {
    this.setState({ communityId: value })
  }

  setQuestion = (value: string) => {
    this.setState({ title: value })
  }

  onSubmit = async () => {
    const { askRecommendation, navigation } = this.props
    const { communityId, title } = this.state
    const success = await askRecommendation(communityId, title)
    if (success) {
      if (
        !navigation.getParam('categoryId') ||
        (navigation.getParam('categoryId') &&
          navigation.getParam('categoryId') !== communityId)
      ) {
        navigate(Routes.COMMUNITY__QUESTIONS, { _goToMyPost: true })
      } else {
        navigate(Routes.COMMUNITY__QUESTIONS_CATEGORIES, { _goToMyPost: true })
      }
    }
  }

  onCancel = () => {
    const { navigation } = this.props
    this.setState({} as State)
    navigation.goBack()
  }

  render() {
    const { setCategory, setQuestion, onSubmit, closeModal, goBack } = this
    const { interestList, theme } = this.props
    const { spacing } = theme
    const { communityId, title, showModal, currentDimension } = this.state
    const { width } = currentDimension
    return (
      <Container currentWidth={width}>
        <KeyboardAwareScrollView
          type="view"
          contentContainerStyle={{ flex: 1 }}
        >
          <Title>Ask a question</Title>
          <Description>
            Ask members of the community what they recommend. Or start a
            conversation based on what you already like.
          </Description>

          <Select
            containerStyle={{ marginTop: spacing(3) }}
            label="Category"
            data={interestList}
            labelExtractor={({ name }) => name}
            valueExtractor={({ id }) => id}
            value={communityId}
            rippleInsets={{ top: 0, bottom: -spacing(2) }}
            onChange={setCategory}
          />

          <TextField
            numberOfLines={4}
            value={title}
            onChange={setQuestion}
            label="Type your question"
            maxLength={175}
          />
          <CharLength>{`${title.length} / 175`}</CharLength>

          <ButtonContainer>
            <Button
              variant="contained"
              maxWidth
              center
              onPress={onSubmit}
              disabled={!communityId || !title}
              isAnchor
            >
              Post Question
            </Button>
          </ButtonContainer>

          <DiscardQuestionModal
            open={showModal}
            discard={goBack}
            cancel={closeModal}
          />
        </KeyboardAwareScrollView>
      </Container>
    )
  }
}

export default connector(withTheme(AskRecommendationScreen))
