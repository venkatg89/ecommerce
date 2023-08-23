import { icons } from 'assets/images'
import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components/native'
import styled from 'styled-components/native'

const Container = styled.View`
  /* flex-direction: row; */
`

const Bar = styled.View`
  flex: 1;
  height: 4;
  align-self: center;
  background-color: ${({ color }) => color};
`

const BarContainer = styled.View`
  flex-direction: row;
`

const StepDetailsContainer = styled.View`
  align-self: ${({ align }) => align};
  align-items: ${({ align }) => align};
`

const StepLabel = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
`

const StepDate = styled.Text`
  ${({ theme }) => theme.typography.body2};
`

const SuccessIcon = styled.Image`
  width: 24;
  height: 24;
`
const CancelledIcon = styled.Image`
  width: 24;
  height: 24;
  tint-color: ${({ theme }) => theme.palette.supportingError};
`

const NeutralIcon = styled.View`
  width: 24;
  height: 24;
  border-radius: 12;
  border-width: 2;
  border-color: ${({ theme }) => theme.palette.grey3};
  background-color: ${({ theme }) => theme.palette.grey5};
`

interface Props {
  isCancelled?: boolean
  totalSteps: 2 | 3
  currentStep: number
  label: string
  stepDate: string
}

const OrderDetailsProgressBar = ({
  isCancelled,
  currentStep,
  totalSteps,
  label,
  stepDate,
}: Props) => {
  const { palette } = useContext(ThemeContext)
  const successColor = palette.primaryGreen
  const failureColor = palette.supportingError
  const neutralColor = palette.grey3

  const getAlign = () => {
    if (totalSteps === 2) {
      return currentStep === 1 ? 'flex-start' : 'flex-end'
    }
    switch (currentStep) {
      case 1:
        return 'flex-start'
      case 2:
        return 'center'
      case 3:
        return 'flex-end'
      default:
        return 'flex-start'
    }
  }

  if (isCancelled) {
    return (
      <Container>
        <BarContainer>
          <SuccessIcon source={icons.circleCheckmark} />
          <Bar color={failureColor} />
          <CancelledIcon source={icons.close} />
        </BarContainer>
        <StepDetailsContainer align={getAlign()}>
          <StepLabel>{label}</StepLabel>
          <StepDate>{stepDate}</StepDate>
        </StepDetailsContainer>
      </Container>
    )
  }

  return (
    <Container>
      <BarContainer>
        <SuccessIcon source={icons.circleCheckmark} />
        <Bar color={currentStep > 1 ? successColor : neutralColor} />
        {currentStep > 1 ? (
          <SuccessIcon source={icons.circleCheckmark} />
        ) : (
          <NeutralIcon />
        )}
        {totalSteps > 2 && (
          <Bar color={currentStep === 3 ? successColor : neutralColor} />
        )}
        {totalSteps > 2 && currentStep === 3 ? (
          <SuccessIcon source={icons.circleCheckmark} />
        ) : (
          <NeutralIcon />
        )}
      </BarContainer>
      <StepDetailsContainer align={getAlign()}>
        <StepLabel>{label}</StepLabel>
        <StepDate>{stepDate}</StepDate>
      </StepDetailsContainer>
    </Container>
  )

  // return

  // return (
  //   <>
  //     <BarContainer>
  //       <SuccessIcon source={icons.circleCheckmark} />
  //       <Bar color={successColor} />
  //       <CancelledIcon source={icons.close} />
  //     </BarContainer>
  //     <BarContainer>
  //       <SuccessIcon source={icons.circleCheckmark} />
  //       <Bar color={successColor} />
  //       <CancelledIcon source={icons.close} />
  //       <Bar color={failureColor} />
  //       <CancelledIcon source={icons.close} />
  //     </BarContainer>
  //     <BarContainer>
  //       <SuccessIcon source={icons.circleCheckmark} />
  //       <Bar color={neutralColor} />
  //       <NeutralIcon source={icons.close} />
  //       <Bar color={neutralColor} />
  //       <NeutralIcon source={icons.close} />
  //     </BarContainer>
  //   </>
  // )
}

export default OrderDetailsProgressBar
