import React, { useState, useContext } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Header from 'src/controls/navigation/Header'
import styled, { ThemeContext } from 'styled-components/native'
import Button from 'src/controls/Button'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { RequestStatus } from 'src/models/ApiStatus'
import {
  myAtgAccountSelector,
  myAtgApiStatusSelector,
} from 'src/redux/selectors/userSelector'
import { editAtgAccountDetails } from 'src/redux/actions/user/atgAccountAction'
import { pop } from 'src/helpers/navigationService'
import { icons } from 'assets/images'
import { useToast } from 'native-base'
import { ThemeModel } from 'src/models/ThemeModel'
import { getSuccessToastStyle } from 'src/constants/layout'

const Container = styled.View``

const NameHeader = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const ContentSetting = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const ContentSettingContainer = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
`

const SaveChangesButton = styled(Button)`
  padding-vertical: ${({ theme }) => theme.spacing(1.5)};
`

const CheckboxCircleIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const RowContainer = styled.View`
  flex-direction: row;
`

interface StateProps {
  atgAccount?: AtgAccountModel
  atgApiStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
  atgApiStatus: myAtgApiStatusSelector,
})

interface DispatchProps {
  editExplicitContentSetting: (explicitContentSetting: boolean) => void
}

const dispatcher = (dispatch) => ({
  editExplicitContentSetting: (explicitContentSetting: boolean) =>
    dispatch(
      editAtgAccountDetails({
        explicitContentSetting: explicitContentSetting ? 'true' : 'false',
      }),
    ),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const ExplicitContentSettingScreen = ({
  atgAccount,
  editExplicitContentSetting,
  atgApiStatus,
}: Props) => {
  const toast = useToast()
  const theme = useContext(ThemeContext) as ThemeModel
  const [explicitContentSetting, setExplicitContentSetting] = useState(
    atgAccount?.explicitContentSetting || false,
  )

  const saveChangesButtonHandler = () => {
    editExplicitContentSetting(explicitContentSetting)
    pop()
    /* @ts-ignore */
    toast.show({
      title: 'Changes saved',
      ...getSuccessToastStyle(theme),
    })
  }

  const disabled = atgApiStatus === RequestStatus.FETCHING

  return (
    <React.Fragment>
      <Container>
        <NameHeader>Content Settings</NameHeader>
        <RowContainer>
          <ContentSettingContainer
            onPress={() => {
              setExplicitContentSetting(true)
            }}
          >
            <CheckboxCircleIcon
            source={
              explicitContentSetting
                ? icons.radioSelected
                : icons.radioDeselected
            }
            />
            <ContentSetting>Allow explicit content</ContentSetting>
          </ContentSettingContainer>
        </RowContainer>
        <RowContainer>
          <ContentSettingContainer
            onPress={() => {
              setExplicitContentSetting(false)
            }}
          >
            <CheckboxCircleIcon
            source={
              explicitContentSetting
                ? icons.radioDeselected
                : icons.radioSelected
            }
            />
            <ContentSetting>Don't Allow explicit content</ContentSetting>
          </ContentSettingContainer>
        </RowContainer>
      </Container>
      <SaveChangesButton
        onPress={saveChangesButtonHandler}
        variant="contained"
        maxWidth
        isAnchor
        center
        disabled={disabled}
        showSpinner={atgApiStatus === RequestStatus.FETCHING}
      >
        Save Changes
      </SaveChangesButton>
    </React.Fragment>
  )
}

ExplicitContentSettingScreen.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(ExplicitContentSettingScreen)
