import React from 'react'
import styled from 'styled-components/native'

import EyeOn from 'src/icons/EyeOn'
import EyeOff from 'src/icons/EyeOff'

const Container = styled.View`
  margin-bottom: 15;
  flex-direction: row;
  background-color: rgb(238, 238, 238);
  align-items: center;
`

const ShowPasswordIcon = styled.TouchableOpacity`
  width: 32;
  height: 20;
  align-items: center;
  margin-right: 15;
`

const TextInput = styled.TextInput`
  flex:1;
  background-color: rgb(238, 238, 238);
`

interface Props {
  onChange: (value: string) => void
  onSubmitEditing?: () => void
  getRef: (ref) => void
  returnKeyType?: any
  placeholder: string
  editable?: boolean
  value: string
  focus?: boolean
  style?: any
}

interface State {
  showPassword: boolean
}

class PasswordInput extends React.Component<Props, State> {
  state = {
    showPassword: false,
  }

  getRef = (ref) => {
    if (this.props.getRef) {this.props.getRef(ref)}
  }

  handleShowPassword = () => this.setState(prevState => ({ showPassword: !prevState.showPassword }))

  inputPasswordFieldRef?: any // TextInput

  render() {
    const { showPassword } = this.state
    const { style, value, placeholder, onChange, focus, returnKeyType, editable, onSubmitEditing } = this.props

    return (
      <Container>
        <TextInput
          style={ style }
          onChangeText={ onChange }
          value={ value }
          ref={ this.getRef }
          placeholder={ placeholder }
          secureTextEntry={ !showPassword }
          editable={ editable }
          autoFocus={ focus }
          returnKeyType={ returnKeyType }
          onSubmitEditing={ onSubmitEditing }
          autoCapitalize="none"
          autoCorrect={ false }
        />
        <ShowPasswordIcon onPress={ this.handleShowPassword }>
          { !showPassword ?
            <EyeOn color="rgb(178,178,178)" width={ 32 } height={ 20 } /> :
            <EyeOff color="rgb(178,178,178)" width={ 32 } height={ 20 } />
          }
        </ShowPasswordIcon>
      </Container>
    )
  }
}

export default PasswordInput
