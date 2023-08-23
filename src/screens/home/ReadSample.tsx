import React, { useState, useEffect } from 'react'
import { WebView } from 'react-native-webview'
import { ActivityIndicator } from 'react-native'
import _Modal from 'react-native-modal'
import styled from 'styled-components/native'
import LLLocalytics from 'localytics-react-native'

import { BookModel } from 'src/models/BookModel'
import { ReviewsStateModel } from 'src/models/PdpModel'

import _Button from 'src/controls/Button'
import _Container from 'src/controls/layout/ScreenContainer'
import { icons } from 'assets/images'

import { LL_READ_SAMPLE_VIEWED } from 'src/redux/actions/localytics'

const Container = styled(_Container)`
  border-radius: ${({ theme }) => theme.spacing(2)};
`

const TopLine = styled.View`
  background-color: ${({ theme }) => theme.palette.grey5};
  width: 29;
  height: 4;
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const TopLineContainer = styled.View`
  align-items: center;
  justify-content: center;
`
const IconClose = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const ButtonClose = styled(_Button)`
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: 10;
`
const Button = styled(_Button)``

const Wrapper = styled.View`
  margin-left: auto;
`

const Border = styled.View`
  border-top-width: 0.5;
  border-top-color: ${({ theme }) => theme.palette.grey3};
  shadow-offset: 1px 1px;
  shadow-radius: 2;
  shadow-opacity: 0.9;
  shadow-color: #000000;
`

const Modal = styled(_Modal)`
  background-color: white;
  margin-horizontal: 0;
  margin-bottom: 0;
  margin-top: 15%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`

const ApplyButton = styled(Button)`
  padding: ${({ theme }) => `${theme.spacing(1)}px ${theme.spacing(2)}px`};
  min-height: 42;
  min-width: 45%;
`

const Spinner = styled.View`
  flex: 8;
  justify-content: center;
  align-items: center;
`

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.palette.primaryGreen};
  ${({ theme }) => theme.typography.button.small}
  text-transform: uppercase;
`

interface OwnProps {
  style?: any
  url: string | undefined
  product: BookModel
  reviews: ReviewsStateModel
}
type Props = OwnProps

const ReadSample = ({ url, product, reviews, style }: Props) => {
  const [showModal, setShowModal] = useState(false)
  const [showSpinner, setShowSpinner] = useState(true)

  const hideSpinner = () => {
    setShowSpinner(!showSpinner)
  }

  useEffect(() => {
    if (showModal && product && reviews) {
      const readSample = {
        productFormat: product.parentFormat,
        productTitle: product.name,
        productId: product.ean,
        starRating: reviews[product.ean] ? reviews[product.ean].ratings : 0,
      }
      LLLocalytics.tagEvent({
        name: LL_READ_SAMPLE_VIEWED,
        attributes: { ...readSample },
      })
    }
  }, [showModal])

  const modalCloseHandler = () => {
    setShowModal(!showModal)
    setShowSpinner(true)
  }
  return (
    <>
      <ApplyButton
        style={style}
        onPress={modalCloseHandler}
        variant="outlined"
        textStyle={{ textTransform: 'uppercase' }}
        center
        linkGreen
      >
        <ButtonText>Read Sample</ButtonText>
      </ApplyButton>
      <Modal
        animationType="fade"
        visible={showModal}
        backdropOpacity={0.4}
        useNativeDriver={false}
        swipeDirection={['down']}
        onSwipeComplete={modalCloseHandler}
      >
        <>
          <Container>
            <TopLineContainer>
              <TopLine />
            </TopLineContainer>
            <Wrapper>
              <ButtonClose icon onPress={modalCloseHandler}>
                <IconClose source={icons.actionClose} />
              </ButtonClose>
            </Wrapper>
            <Border />
            <WebView
              style={{ flex: 1 }}
              source={{
                uri: url || '',
              }}
              useNativeDriver={false}
              onLoad={hideSpinner}
            />
            {showSpinner && (
              <Spinner>
                <ActivityIndicator size="large" />
              </Spinner>
            )}
          </Container>
        </>
      </Modal>
    </>
  )
}

export default ReadSample
