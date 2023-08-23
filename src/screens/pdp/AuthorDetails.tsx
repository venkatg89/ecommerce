import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import FastImage from 'react-native-fast-image'
import { NavigationStackProp } from 'react-navigation-stack'
import styled from 'styled-components/native'

import Header from 'src/controls/navigation/Header'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import { Params, navigate, Routes } from 'src/helpers/navigationService'

import BookCarouselHorizontalRow from 'src/components/BookCarousel/HorizontalRow'
import BookListSection from 'src/components/BookListSection'
import BookPromo from 'src/components/Pdp/BookPromo'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'

import { getBrowseDetailsAction } from 'src/redux/actions/pdp/browseDetails'
import { browseDetailsSelector } from 'src/redux/selectors/pdpSelector'
import { BrowseDetails } from 'src/endpoints/atgGateway/pdp/browseDetails'
import { browseDetailsApiStatus } from 'src/redux/selectors/apiStatus/books'
import { RequestStatus } from 'src/models/ApiStatus'

const PROFILE_IMAGE_SIZE = 120

const styles = StyleSheet.create({
  profileImage: {
    height: PROFILE_IMAGE_SIZE,
    width: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#777777',
    overflow: 'hidden',
  },

  contentStyle: {
    paddingHorizontal: 0,
    backgroundColor: '#ffffff',
  },
})

const InfoContainer = styled.View`
  padding-top: ${({ theme }) => theme.spacing(1)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`

const ContentText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  padding-top: ${({ theme }) => theme.spacing(2)};
`

const BooksContainer = styled.View`
  padding-left: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(2)};
`
const ListItem = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`
const Separator = styled.View`
  ${({ theme }) => theme.boxShadow.container}
  background-color: #cccccc;
`

interface StateProps {
  browseDetails: BrowseDetails
  browseDetailsStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  browseDetails: browseDetailsSelector,
  browseDetailsStatus: browseDetailsApiStatus,
})

interface DispatchProps {
  getBrowseDetails: (url: string) => void
}

const dispatcher = (dispatch) => ({
  getBrowseDetails: (url: string) => dispatch(getBrowseDetailsAction(url)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & { navigation: NavigationStackProp }

const AuthorDetails = ({
  navigation,
  browseDetails,
  getBrowseDetails,
  browseDetailsStatus,
}: Props) => {
  const authorDetails = navigation.getParam(Params.AUTHOR_DETAILS)
  const fetching = browseDetailsStatus === RequestStatus.FETCHING

  useEffect(() => {
    getBrowseDetails(authorDetails.url)
  }, [])

  return (
    <ScrollContainer contentContainerStyle={styles.contentStyle}>
      {fetching ? (
        <LoadingIndicator isLoading={fetching} />
      ) : (
        <>
          <InfoContainer>
            <TitleText>{authorDetails.name}</TitleText>
            {browseDetails.authorImage ? (
              <FastImage
                key={browseDetails.authorImage}
                style={styles.profileImage}
                source={{
                  uri: browseDetails.authorImage,
                  priority: FastImage.priority.high,
                }}
              />
            ) : null}
            {browseDetails.description ? (
              <ContentText>{browseDetails.description}</ContentText>
            ) : null}
          </InfoContainer>
          {browseDetails.promotionBook?.ean ? (
            <>
              <Separator />
              <BookPromo book={browseDetails.promotionBook} />
              <Separator />
            </>
          ) : null}
          <BooksContainer>
            {browseDetails.bestsellersEans.length > 0 && (
              <ListItem>
                <BookCarouselHorizontalRow
                  header="Bestsellers"
                  eans={browseDetails.bestsellersEans}
                  size="large"
                />
              </ListItem>
            )}
            {browseDetails.allEans.length > 0 && (
              <ListItem>
                <BookListSection
                  title="All"
                  size="large"
                  eans={browseDetails.allEans}
                  onPressSeeAll={() => {
                    navigation.setParams({ _authorName: authorDetails.name })
                    navigate(Routes.PDP__AUTHOR_SEARCH_RESULTS, {
                      [Params.AUTHOR_NAME]: authorDetails.name,
                    })
                  }}
                />
              </ListItem>
            )}
          </BooksContainer>
        </>
      )}
    </ScrollContainer>
  )
}

AuthorDetails.navigationOptions = () => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(AuthorDetails)
