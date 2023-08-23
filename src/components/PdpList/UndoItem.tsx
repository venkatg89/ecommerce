import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'

import _BookImage from 'src/components/BookImage'
import Button from 'src/controls/Button'

import { ResultModel } from 'src/models/SearchModel'

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`

const Content = styled.View`
  justify-content: space-between;
  flex-direction: column;
  flex: 1;
  margin-vertical: ${({ theme }) => theme.spacing(2)};
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const BookImage = styled(_BookImage)`
  opacity: 0.7;
`

const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey1};
  opacity: 0.7;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const ButtonContent = styled.View`
  align-self: flex-end;
`

interface OwnProps {
  onUndo: (ean: string) => void
  result: ResultModel
  onRemoveEan?: (ean: string) => void
}

type Props = OwnProps

const UndoItem = ({ onUndo, result, onRemoveEan }: Props) => {
  const [hide, setHide] = useState<boolean>(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHide(true)
      if (onRemoveEan) {
        onRemoveEan(result.ean)
      }
    }, 5000)

    return (
      () => { clearTimeout(timeout) }
    )
  }, [])

  if (hide) {
    return null
  }

  return (
    <Container>
      <BookImage bookOrEan={ result.ean } size="small" />
      <Content>
        <DescriptionText>{ `${result.name} removed from list` }</DescriptionText>
        <ButtonContent>
          <Button
            onPress={ () => { onUndo(result.ean ) }}
            linkGreen
          >
            Undo
          </Button>
        </ButtonContent>
      </Content>
    </Container>
  )
}

export default UndoItem
