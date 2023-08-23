import React, { useContext } from 'react'
import styled from 'styled-components/native'
import { ThemeContext } from 'styled-components'

import { RecommendationFilterNames } from 'src/models/Communities/QuestionModel'

import Button from 'src/controls/Button'

const Content = styled.View`
  flex-direction: row;
  width: 100%;
`
interface OwnProps {
  onFilterChange: (filter: RecommendationFilterNames) => void
  currentFilter: RecommendationFilterNames
}

const CommunityButton = styled(Button)`
  margin-right: ${props => props.theme.spacing(1)};
  padding: 0px ${({ theme }) => theme.spacing(2)}px;
  border-radius: ${({ theme }) => theme.spacing(2)};
  height: ${({ theme }) => theme.spacing(4)};
  ${({ theme, selected }) => !selected && `
    border-color: ${theme.palette.grey4};
  `}
`
const MyPostButton = styled(Button)`
  padding: 0px ${({ theme }) => theme.spacing(2)}px;
  border-radius: ${({ theme }) => theme.spacing(2)};
  height: ${({ theme }) => theme.spacing(4)};
  ${({ theme, selected }) => !selected && `
    border-color: ${theme.palette.grey4};
  `}
`

const ButtonText = styled.Text<TextProps>`
  ${({ theme, selected }) => !selected && `
    color: ${theme.palette.grey4};
  `}
  text-transform: none;
`

type TextProps = {
  selected: boolean
}

type Props = OwnProps

const RecommendationFilter = ({ onFilterChange, currentFilter }: Props) => {
  const { typography } = useContext(ThemeContext)
  const showMyPosts = () => {
    onFilterChange(RecommendationFilterNames.MY_POST)
  }

  const showMyCommunityPosts = () => {
    onFilterChange(RecommendationFilterNames.MY_COMMUNITIES)
  }

  return (
    <Content>
      <CommunityButton
        accessibilityState={ {
          selected: currentFilter === RecommendationFilterNames.MY_COMMUNITIES,
        } }
        textStyle={ typography.subTitle2 }
        onPress={ showMyCommunityPosts }
        variant="outlined"
        selected={ currentFilter === RecommendationFilterNames.MY_COMMUNITIES }
      >
        <ButtonText selected={ currentFilter === RecommendationFilterNames.MY_COMMUNITIES }>
          My Community
        </ButtonText>
      </CommunityButton>
      <MyPostButton
        accessibilityState={ {
          selected: currentFilter === RecommendationFilterNames.MY_POST,
        } }
        textStyle={ typography.subTitle2 }
        variant="outlined"
        onPress={ showMyPosts }
        selected={ currentFilter === RecommendationFilterNames.MY_POST }
      >
        <ButtonText selected={ currentFilter === RecommendationFilterNames.MY_POST }>
          My Posts
        </ButtonText>
      </MyPostButton>
    </Content>
  )
}

export default RecommendationFilter
