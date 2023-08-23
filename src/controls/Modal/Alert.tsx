import React, { useCallback, useContext } from 'react'
import _Modal from 'react-native-modal'
import styled, { ThemeContext } from 'styled-components/native'
import {
  CONTENT_HORIZONTAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'

import _Button, { Variant } from 'src/controls/Button'

import { isIPhoneX } from 'src/helpers/iPhoneX'
import { ThemeModel } from 'src/models/ThemeModel'
import htmlToText from 'src/helpers/ui/htmlToText'

const Modal = styled(_Modal)`
  justify-content: flex-end;
  margin-horizontal: 0;
  margin-bottom: 0;
`

interface ModalContainer {
  currentWidth: number
}

const ModalContainer = styled.View<ModalContainer>`
  position: relative;
  border-radius: 4;
  background-color: ${({ theme }) => theme.palette.white};
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-horizontal: ${({ currentWidth }) =>
    CONTENT_HORIZONTAL_PADDING(currentWidth)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const IphoneXPadding = styled.View`
  height: 30;
`

const HeaderText = styled.Text`
  text-align: center;
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const BodyText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  ${({ bodyTextCentered }) => (bodyTextCentered && 'text-align: center;')}
`

const ButtonContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const Button = styled(_Button)`
  padding: ${(props) => props.theme.spacing(2)}px;
  box-shadow: 1px 2px 3px ${({ theme }) => theme.palette.grey4};
`

export interface ButtonProps {
  title: string
  onPress: () => void
  warning?: boolean
  disabled?: boolean
  showSpinner?: boolean
  variant?: Variant
  linkGreen?: boolean
  withoutDismiss?: boolean
}

interface Props {
  isOpen: boolean
  onDismiss: () => void
  title: string
  description?: string
  customBody?: React.ReactNode
  buttons?: ButtonProps[]
  cancelText?: string
  onCancelCallback?: () => void
  animationType?: string
  bodyTextCentered?: boolean
}

const Alert = ({
  buttons = [],
  title,
  bodyTextCentered,
  description,
  customBody,
  isOpen,
  onDismiss,
  cancelText,
  onCancelCallback,
  animationType,
}: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()
  const onCancel = useCallback(() => {
    if (onCancelCallback) {
      onCancelCallback()
    }
    onDismiss()
  }, [onCancelCallback, onDismiss])

  return (
    <Modal
      isVisible={isOpen}
      backdropOpacity={0.5}
      onBackdropPress={onDismiss}
      avoidKeyboard
      animationType={animationType}
    >
      <ModalContainer currentWidth={width}>
        <HeaderText>{title}</HeaderText>
        {customBody || ( // use customBody if exist
          <BodyText bodyTextCentered={bodyTextCentered}>
            {description && htmlToText(description)}
          </BodyText>
        )}
        <ButtonContainer>
          {buttons.map((button, index) => {
            const {
              title: buttonTitle,
              warning,
              onPress,
              withoutDismiss,
              ...props
            } = button
            const isContainedVariant = index === 0 || warning
            return (
              <Button
                // eslint-disable-next-line
                key={`ModalAlertButton-${index}`}
                style={{
                  marginBottom: theme.spacing(1),
                  ...(!isContainedVariant && {
                    borderColor: theme.palette.linkGreen,
                  }),
                  ...(warning && {
                    backgroundColor: theme.palette.supportingError,
                  }),
                }}
                variant={isContainedVariant ? 'contained' : 'outlined'}
                onPress={() => {
                  if (!withoutDismiss) {
                    onDismiss()
                  }
                  onPress()
                }} // TODO: maybe cases where we don't want to dismiss
                textStyle={{
                  textTransform: 'uppercase',
                  ...(!isContainedVariant && {
                    color: theme.palette.linkGreen,
                  }),
                }}
                maxWidth
                center
                {...props}
              >
                {buttonTitle}
              </Button>
            )
          })}
          <Button onPress={onCancel} linkGreen maxWidth center>
            {cancelText || 'Cancel'}
          </Button>
        </ButtonContainer>
      </ModalContainer>
      {(isIPhoneX() && <IphoneXPadding />) || undefined}
    </Modal>
  )
}

export default Alert
