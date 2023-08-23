import React from 'react'
import { Modal } from 'react-native'
import styled from 'styled-components/native'

const WIDTH = 270

// the 400% etc darken the screen for the dialog slide animations
const BackgroundTint = styled.View`
  flex: 1;
  background: black;
  opacity: 0.4;
  width: 400%;
  height: 400%;
  margin-top: -300%;
  position: absolute;
`

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const Dialog = styled.View`
  background: #E2E2E2;
  border-radius: 14;
  padding: 0px 20px 0px 20px;
  align-items: center;
  width: ${WIDTH};
`

const Title = styled.Text`
  font-size: 17;
  font-weight: bold;
  margin-bottom: 4;
  margin-top: 20;
`

const Message = styled.Text`
  font-size: 13;
  margin-bottom: 28;
`

const Input = styled.TextInput`
  font-size: 13;
  color: ${({ theme }) => theme.font.default};
  background: white;
  padding: 4px 8px 4px 8px;
  margin-bottom: 4;
  border: 1px lightgrey solid;
  width: 100%;
`

const ButtonRow = styled.View`
  flex-direction: row;
  width: 100%;
  height: 44;
  width: ${WIDTH};
`

const Button = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const ThinLine = styled.View`
  margin-top: 8;
  height: 0.5px;
  width: ${WIDTH};
  background-color: grey;
`

const ThinLineV = styled.View`
  width: 0.5px;
  height: 44px;
  background-color: grey;
`


interface ButtonStyleProps {
  bold: boolean
}

const ButtonText = styled.Text<ButtonStyleProps>`
  color: rgb(0, 122, 255);
  font-size: 17;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
`

export interface ButtonProps {
  title: string
  onPress: () => void
  primary?: boolean
}

interface Props {
  buttons: ButtonProps[]
  isVisible: boolean
  title: string
  message: string
  placeholder: string
  animationType?: 'none' | 'slide' | 'fade'
  onChangeText?: (value: string) => void
}


export default ({ isVisible, animationType, title, message, placeholder, buttons, onChangeText }: Props) => (
  <Modal
    animationType={ animationType || 'slide' }
    transparent
    visible={ isVisible }
    onRequestClose={ () => undefined }
  >
    <BackgroundTint />
    <Container>
      <Dialog>
        <Title>{ title }</Title>
        <Message>{ message }</Message>
        <Input placeholder={ placeholder } onChangeText={ onChangeText } />
        <ThinLine />
        <ButtonRow>
          {
            buttons.map((button, index) => (
              <React.Fragment key={ button.title }>
                <Button onPress={ button.onPress }>
                  <ButtonText bold={ !!button.primary }>{ button.title }</ButtonText>
                </Button>
                { index !== buttons.length - 1 && (
                  <ThinLineV />
                ) }
              </React.Fragment>
            ))
          }
        </ButtonRow>
      </Dialog>
    </Container>
  </Modal>
)
