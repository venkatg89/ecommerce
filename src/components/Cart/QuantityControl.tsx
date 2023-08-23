import { icons } from 'assets/images'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

const Container = styled.View`
  margin-left: 8;
  flex-direction: row;
`

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(2.5)};
  height: ${({ theme }) => theme.spacing(2.5)};
`

const Button = styled.TouchableOpacity`
  border-width: 1;
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.grey4};
  padding-right: ${({ theme }) => theme.spacing(1.5)};
  padding-left: ${({ theme }) => theme.spacing(1.5)};
  padding-top: ${({ theme }) => theme.spacing(1.5)};
  padding-bottom: ${({ theme }) => theme.spacing(1.5)};
`

const MinusButton = styled(Button)`
  border-top-left-radius: 5;
  border-bottom-left-radius: 5;
  border-right-width: 0;
`

const DeleteButton = styled(Button)`
  border-top-left-radius: 5;
  border-bottom-left-radius: 5;
  border-right-width: 0;
`

const AddButton = styled(Button)`
  border-left-width: 0;
  border-bottom-right-radius: 5;
  border-top-right-radius: 5;
`

const CounterContainer = styled.View`
  border-width: 1;
  border-color: ${({ theme }) => theme.palette.grey4};
`

const Counter = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  font-weight: bold;
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing(2)};
  padding-right: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(1.5)};
  padding-bottom: ${({ theme }) => theme.spacing(1.5)};
`

interface Props {
  count: number
  onPressMinus: () => void
  onPressDelete: () => void
  onPressAdd: () => void
  isAddPending: boolean
  isMinusPending: boolean
}

const QuantityControl = ({
  count,
  onPressMinus,
  onPressDelete,
  onPressAdd,
  isMinusPending,
  isAddPending,
}: Props) => {
  const isActionEnabled = () => !(isMinusPending || isAddPending)
  return (
    <Container>
      {count === 1 ? (
        <DeleteButton onPress={isActionEnabled() ? onPressDelete : () => {}}>
          <Icon source={icons.delete} />
        </DeleteButton>
      ) : (
        <MinusButton onPress={isActionEnabled() ? onPressMinus : () => {}}>
          {isMinusPending ? (
            <ActivityIndicator size="small" color="grey" />
          ) : (
            <Icon source={icons.minusCart} />
          )}
        </MinusButton>
      )}
      <CounterContainer>
        <Counter>{count}</Counter>
      </CounterContainer>
      <AddButton onPress={isActionEnabled() ? onPressAdd : () => {}}>
        {isAddPending ? (
          <ActivityIndicator size="small" color="grey" />
        ) : (
          <Icon source={icons.add} />
        )}
      </AddButton>
    </Container>
  )
}

export default QuantityControl
