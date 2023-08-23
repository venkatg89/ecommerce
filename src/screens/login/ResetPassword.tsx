import React from 'react'
import styled from 'styled-components/native'

import ResetPasswordForm from 'src/components/ResetPasswordForm'
import Container from 'src/controls/layout/ScreenContainer'
import NavHeader from 'src/controls/navigation/Header'

const Content = styled.View`
  align-items: center;
  max-width: 1200;
  margin-top: 48;
  margin-left: 28;
  margin-right: 28;
`

class ResetPasswordScreen extends React.Component {
  static navigationOptions = ({ screenProps }) => (
    {
      headerBackTitle: 'Login',
      header: headerProps => <NavHeader headerProps={ headerProps } />,
    }
  )

  render() {
    return (
      <Container>
        <Content>
          <ResetPasswordForm />
        </Content>
      </Container>
    )
  }
}

export default ResetPasswordScreen
