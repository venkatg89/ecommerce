import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components/native'
import _Modal from 'react-native-modal'

import Button from 'src/controls/Button'
import { CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'

interface ModalContainerProps {
  currentWidth: number
}

const Modal = styled(_Modal)`
  justify-content: flex-end;
`

const ModalContainer = styled.View<ModalContainerProps>`
  background-color: ${({ theme }) => theme.palette.white};
  border-radius: 8;
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-horizontal: ${({ currentWidth }) => CONTENT_HORIZONTAL_PADDING(currentWidth)};
`

const ModalTitle = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  text-align: center;
`
const ModalDesc = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const DiscardButton = styled(Button)`
  background-color: ${({ theme }) => theme.palette.supportingError};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(2)}px;
`

interface Props {
  open: boolean
  discard: () => void
  cancel: () => void
}


const DiscardQuestionModal = ({ open, discard, cancel }: Props) => {
  const { palette } = useContext(ThemeContext)
  const { width } = useResponsiveDimensions()
  return (
    <Modal isVisible={ open } backdropOpacity={ 0.5 }>
      <ModalContainer currentWidth={ width }>
        <ModalTitle>Unsaved post</ModalTitle>
        <ModalDesc>Are you sure you want to discard your post?</ModalDesc>
        <DiscardButton variant="contained" onPress={ discard } maxWidth center>
          Discard Post
        </DiscardButton>
        <Button onPress={ cancel } maxWidth textStyle={ { color: palette.linkGreen } } center>
          Keep Writing
        </Button>
      </ModalContainer>
    </Modal>
  )
}

export default DiscardQuestionModal
