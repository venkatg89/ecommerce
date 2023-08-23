import React, { useState, useMemo } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { NavigationInjectedProps } from 'react-navigation'
import { createStructuredSelector } from 'reselect'

import _Button from 'src/controls/Button'
import Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'

import Genre from 'src/components/InterestItem'
import _ScreenHeader from 'src/components/ScreenHeader'

import { CommunitiesInterestsList } from 'src/models/Communities/InterestModel'

import { communitiesInterestsListSelector } from 'src/redux/selectors/communities/interestsListSelector'
import { updateMyFavoriteCommunitiesAction } from 'src/redux/actions/user/community/favoriteCategoriesAction'

import { myInterestCommunityIds, isBusyMyInterestCommunities } from 'src/redux/selectors/userSelector'

import { comparePrimitiveArraysOrderInsensitive } from 'src/helpers/arrayHelper'
import { useResponsiveDimensions, CONTENT_VERTICAL_PADDING, CONTENT_HORIZONTAL_PADDING } from 'src/constants/layout'

const ScreenHeader = styled(_ScreenHeader)`
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(2)};
`

const Spacing = styled.View`
  height: ${({ theme }) => theme.spacing(2)};
`

const ButtonContainer = styled.View`
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
`

interface StateProps {
  genreInterestsList: CommunitiesInterestsList,
  interestIds: number[]
  isBusy: boolean
}

const selector = createStructuredSelector({
  genreInterestsList: communitiesInterestsListSelector,
  interestIds: myInterestCommunityIds,
  isBusy: isBusyMyInterestCommunities,
})

interface DispatchProps {
  updateGenreInterests: (categories: number[]) => void;
}

const dispatcher = dispatch => ({
  updateGenreInterests: (categories: number[]) => {
    dispatch(updateMyFavoriteCommunitiesAction(categories))
  },
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps


const ProfileEditGenreInterests = ({ interestIds, genreInterestsList, updateGenreInterests, isBusy }: Props) => {
  const [genreInterests, setInterests] = useState<number []>(interestIds)
  const { width } = useResponsiveDimensions()

  const toggleGenreInterest = (genreId: number) => {
    const position = genreInterests.indexOf(genreId)
    // Return a new array with the new interest added
    if (position < 0) {
      setInterests([...genreInterests, genreId])
    } else {
      const result = [...genreInterests]
      result.splice(position, 1)
      setInterests(result)
    }
  }

  const checkForChangesToSave = () => {
    if (genreInterests.length < 3) {
      return false
    }
    return !comparePrimitiveArraysOrderInsensitive(interestIds, genreInterests)
  }

  const contentContainerStyle = useMemo(() => ({
    flexGrow: 1,
    paddingVertical: CONTENT_VERTICAL_PADDING,
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING(width),
  }), [width])

  return (
    <Container>
      <ScreenHeader
        header="Genre Interests"
        body="Choose at least three genres"
      />
      <FlatList
        data={ genreInterestsList }
        keyExtractor={ item => item.id.toString() }
        contentContainerStyle={ contentContainerStyle }
        renderItem={ ({ item }) => (
          <Genre
            themeColor={ `#${item.customAttributes.themeColor}` }
            interestId={ item.id }
            name={ item.name }
            onPress={ (id) => { toggleGenreInterest(Number(id)) } }
            selected={ genreInterests.includes(Number(item.id)) }
            isRadioButton
          />
        ) }
        extraData={ genreInterests }
        ItemSeparatorComponent={ Spacing }
      />
      <ButtonContainer>
        <Button
          variant="contained"
          disabled={ isBusy || !checkForChangesToSave() }
          onPress={ () => { updateGenreInterests(genreInterests) } }
          maxWidth
          center
        >
          Save Changes
        </Button>
      </ButtonContainer>
    </Container>
  )
}

ProfileEditGenreInterests.navigationOptions = () => ({
  header: headerProps => <Header headerProps={ headerProps } />,
})


export default connector(ProfileEditGenreInterests)
