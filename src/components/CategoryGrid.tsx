import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled, { ThemeContext } from 'styled-components/native'

import { CommunitiesInterestsModel } from 'src/models/Communities/InterestModel'
import { push, Routes, Params } from 'src/helpers/navigationService'

import { allCommunitiesInterestSelector } from 'src/redux/selectors/communities/interestsListSelector'

interface ContainerProps {
  center?: boolean
}

interface WrapperProps {
  borderColor: HexColor
}

const Container = styled.View<ContainerProps>`
  margin-top: -${({ theme }) => theme.spacing(2)};
  margin-left: -${({ theme }) => theme.spacing(2)};
  flex-direction: row;
  flex-wrap: wrap;
  ${({ center }) => (center ? 'justify-content: center;' : '')}
`

const Wrapper = styled.TouchableOpacity<WrapperProps>`
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  border-bottom-width: 2;
  border-bottom-color: ${({ borderColor }) => borderColor};
`

const CategoryText = styled.Text`
  margin-bottom: 1;
  text-transform: uppercase;
  ${({ theme }) => theme.typography.subTitle2}
  color: ${({ theme }) => theme.palette.grey1};
`

type Size = 'regular' | 'small'
interface OwnProps extends ContainerProps {
  categoryIds: (string | number)[]
  size?: Size
}

interface StateProps {
  categories: Record<number, CommunitiesInterestsModel>
}

const selector = createStructuredSelector({
  categories: allCommunitiesInterestSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

const CategoryGrid = ({ categoryIds, categories, center, size = 'regular' }: Props) => {
  const { typography } = useContext(ThemeContext)
  const textStyle = size === 'regular' ? typography.subTitle1 : typography.subTitle2

  return (
    <Container center={ center }>
      {categoryIds
        .filter(e => !!e)
        .map(categoryId => (
          categories[categoryId] && (
            <Wrapper
              accessibilityLabel={ categories[categoryId].name }
              accessibilityRole="button"
              key={ categories[categoryId].id }
              onPress={ () => { push(Routes.COMMUNITY__QUESTIONS_CATEGORIES, { [Params.CATEGORY_ID]: categoryId }) } }
              borderColor={ `#${categories[categoryId].customAttributes.themeColor}` }
            >
              <CategoryText
                style={ textStyle }
              >
                {categories[categoryId].name}
              </CategoryText>
            </Wrapper>
          )
        ))}
    </Container>
  )
}

export default connector(CategoryGrid)
