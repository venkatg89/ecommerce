import React from 'react'
import Header from 'src/controls/navigation/Header'
import styled from 'styled-components/native'
import { NavigationInjectedProps } from 'react-navigation'

const Container = styled.ScrollView`
  padding-top: ${({ theme }) => theme.spacing(3)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.white};
`

const TitleText = styled.Text`
  font-size: 24;
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const ListItemText = styled.Text`
  font-size: 16;
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

type Props = NavigationInjectedProps

const ProductDetailsScreen = ({ navigation }: Props) => {
  const detailsList = navigation.getParam('data')

  return (
    <Container>
      <TitleText>Product Details</TitleText>
      {detailsList?.map((item) => {
        return item.content ? (
          <ListItemText key={item.fieldName}>
            {item.fieldName + ': ' + item.content}
          </ListItemText>
        ) : null
      })}
    </Container>
  )
}
ProductDetailsScreen.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default ProductDetailsScreen
