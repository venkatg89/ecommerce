import React, { useCallback, memo } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import Button from 'src/controls/Button'

import { CommunitiesInterestsModel } from 'src/models/Communities/InterestModel'
import { push, Routes, Params } from 'src/helpers/navigationService'

import { communitiesInterestSelector } from 'src/redux/selectors/communities/interestsListSelector'

interface TextBorderProps {
  themeColor: HexColor
}

const TextWrapper = styled.View`
  flex-direction: row;
`

const TextBorder = styled.View<TextBorderProps>`
  border-bottom-width: 2;
  border-bottom-color: ${({ themeColor }) => `#${themeColor}`};
`

const ButtonText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey3};
  text-transform: uppercase;
`

interface OwnProps {
  categoryId: string;
}

interface StateProps {
  category: CommunitiesInterestsModel;
}

const selector = createStructuredSelector({
  category: communitiesInterestSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

const CategoryItem = ({ category, categoryId }: Props) => {
  const goToCategory = useCallback(() => {
    push(Routes.COMMUNITY__QUESTIONS_CATEGORIES, { [Params.CATEGORY_ID]: categoryId })
  }, [categoryId])

  return (
    <Button
      onPress={ goToCategory }
      icon
    >
      <TextWrapper>
        <TextBorder themeColor={ category.customAttributes.themeColor }>
          <ButtonText>{ category.name }</ButtonText>
        </TextBorder>
      </TextWrapper>
    </Button>
  )
}

export default memo(connector(CategoryItem))
