import React from 'react'
import { Image, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { BookModel } from 'src/models/BookModel'
import { productTypes, contributorsMovieTypes } from 'src/strings/pdpTypes'
import { icons } from 'assets/images'
import { navigate, push, Routes, Params } from 'src/helpers/navigationService'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { PromotionBookModel } from 'src/endpoints/atgGateway/pdp/browseDetails'

const Container = styled.View`
  flex-direction: column;
  align-items: ${({ isDisabled }) => (isDisabled ? 'flex-start' : 'center')};
  width: 100%;
`

const ContributorsText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme, isGreen }) =>
    isGreen ? theme.palette.linkGreen : theme.palette.grey3};
`

const Separator = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.palette.grey3 : theme.palette.grey1};
`
const ContributorsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: ${({ theme }) => theme.spacing(4)};
  margin-right: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  book: BookModel | PromotionBookModel
  isDisabled: boolean
}

type Props = OwnProps & NavigationInjectedProps

const AuthorRow = ({ book, isDisabled, navigation }: Props) => {
  const { directors, cast, contributors } = book.authors
  const { DIRECTOR, CAST } = contributorsMovieTypes

  const renderRole = (role: string) => {
    switch (role) {
      case DIRECTOR:
        return directors.length > 1 ? 'Directors' : 'Director'
      case CAST:
        return ' Cast'
      default:
        return ''
    }
  }

  const movieContributors = [
    {
      title: renderRole(DIRECTOR),
      data: directors.map((item) => ({
        name: item.name,
        url: item.url,
      })),
    },
    {
      title: renderRole(CAST),
      data: cast.map((item) => ({
        name: item.name,
        url: item.url,
      })),
    },
  ]

  const renderContributors = (contributors) => {
    return (
      contributors && (
        <>
          {contributors.map((contributor, index) => (
            <React.Fragment key={index}>
              <ContributorsText
                isGreen={!isDisabled}
                onPress={() => {
                  if (!isDisabled) {
                    if (contributor.url.substring(0, 2) === '/b') {
                      navigation.setParams({ _title: book.name })
                      navigate(Routes.PDP__AUTHOR_DETAILS, {
                        [Params.AUTHOR_DETAILS]: contributor,
                      })
                    } else {
                      navigation.setParams({ _title: contributor.name })
                      push(Routes.PDP__AUTHOR_SEARCH_RESULTS, {
                        [Params.AUTHOR_NAME]: contributor.name,
                      })
                    }
                  }
                }}
              >
                {contributor.name}
              </ContributorsText>
              {index !== contributors.length - 1 && (
                <Separator isDisabled={isDisabled}>, </Separator>
              )}
            </React.Fragment>
          ))}
        </>
      )
    )
  }

  return (
    <Container isDisabled={isDisabled}>
      {book.skuType === productTypes.MOVIE ? (
        <>
          {isDisabled ? (
            <ContributorsText numberOfLines={1}>
              {renderContributors(directors)}
              {directors.length > 0 && (
                <Separator isDisabled={isDisabled}>, </Separator>
              )}
              {renderContributors(cast)}
            </ContributorsText>
          ) : (
            <ContributorsContainer>
              <ContributorsText numberOfLines={1}>
                <Separator isDisabled={isDisabled}>
                  {directors.length > 0 && renderRole(DIRECTOR) + ':'}
                </Separator>
                {renderContributors(directors)}
                <Separator isDisabled={isDisabled}>
                  {cast.length > 0 && renderRole(CAST) + ':'}
                </Separator>
                {renderContributors(cast)}
              </ContributorsText>
              {(directors.length > 0 || cast.length > 0) && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.setParams({ _title: book.name })
                    navigate(Routes.PDP__CONTRIBUTORS, {
                      data: movieContributors,
                      title: 'Contributors',
                      productName: book.name,
                    })
                  }}
                >
                  <Image source={icons.arrowRight} />
                </TouchableOpacity>
              )}
            </ContributorsContainer>
          )}
        </>
      ) : (
        <ContributorsText numberOfLines={1}>
          {renderContributors(contributors)}
        </ContributorsText>
      )}
    </Container>
  )
}

export default withNavigation(AuthorRow)
