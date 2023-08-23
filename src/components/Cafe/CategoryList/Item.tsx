import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import Routes, { Params } from 'src/constants/routes'
import { navigate } from 'src/helpers/navigationService'
import { CafeCategory } from 'src/models/CafeModel/CategoryModel'

import { categorySelector } from 'src/redux/selectors/cafeSelector'

const ButtonContainer = styled.TouchableOpacity``

const Row = styled.View`
  flex-direction: row;
`

const Image = styled.Image`
  height: ${({ theme }) => theme.spacing(12)};
  width: ${({ theme }) => theme.spacing(10)};
  background-color: ${({ theme }) => theme.palette.disabledGrey};
`

const View = styled.View`
  height: ${({ theme }) => theme.spacing(10)};
  width: ${({ theme }) => theme.spacing(10)};
  overflow:hidden;
  align-items:center;
  justify-content:flex-start;
`

const Text = styled.Text`
  margin-left: 16;
  align-self: center;
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.palette.grey1};
`

interface OwnProps {
  // eslint-disable-next-line react/no-unused-prop-types
  categoryId: string;
}

interface StateProps {
  category: CafeCategory;
}

const selector = createStructuredSelector({
  category: (state, ownProps) => {
    const { categoryId } = ownProps
    return categorySelector(state, { categoryId })
  },
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const CafeCategoryItem = ({ category }: Props) => {
  return (
  <ButtonContainer
    onPress={ () => { navigate(Routes.CAFE__ITEMS, { [Params.CAFE_CATEGORY_ID]: category.id }) } }
  >
    <Row>
      <View>
      <Image source={ { uri: category.imageUrl } }/>
      </View>
      <Text>
        { category.name }
      </Text>
    </Row>
  </ButtonContainer>
)}

export default connector(CafeCategoryItem)
