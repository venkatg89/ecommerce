import React from 'react'
import styled from 'styled-components/native'

const Container = styled.View`
  flex-direction: row;
  align-items: baseline;
`

const SalePriceText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
`

const ListPriceText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  text-decoration-line: line-through;
  color: ${({ theme }) => theme.palette.grey3};
`

const SavedText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: #d8685d;
`

const VerticalLineText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey3};
`

const TextContainer = styled.Text`
  margin-left: ${({ theme }) => theme.spacing(1)};
`

interface Props {
  salePrice: number
  listPrice: number
  savedPercentage: string
}

const PriceHeader = ({ salePrice, listPrice, savedPercentage }: Props) => {
  return (
    <Container>
      <SalePriceText>
        ${salePrice ? salePrice.toFixed(2) : listPrice.toFixed(2)}
      </SalePriceText>
      {!!salePrice && salePrice !== listPrice && (
        <TextContainer>
          <ListPriceText>${listPrice.toFixed(2)}</ListPriceText>
          {!!savedPercentage && (
            <>
              <VerticalLineText> | </VerticalLineText>
              <SavedText>Save {savedPercentage}%</SavedText>
            </>
          )}
        </TextContainer>
      )}
    </Container>
  )
}

export default PriceHeader
