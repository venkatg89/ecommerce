import React, { useEffect, useState, useContext } from 'react'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import styled, { ThemeContext } from 'styled-components/native'

import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import { BrowseDetailsModel } from 'src/models/BrowseModel'
import { ThemeModel } from 'src/models/ThemeModel'
import { getBrowseDetailsData, getNoResultsData } from 'src/data/browse'
import { push, Routes, Params, WebRoutes } from 'src/helpers/navigationService'
import { icons } from 'assets/images'
import ScrollContainer from 'src/controls/layout/ScrollContainer'

import OptionChipsList, {
  ChipModel,
  ChipGroupModel,
} from 'src/components/OptionChipsList'
import SearchFilterModal from 'src/components/Search/FilterModal'
import SearchSortModal from 'src/components/Search/SortModal'
import HomeCardTwo from 'src/components/Home/HomeCardTypeTwo'
import HomeCardFive from 'src/components/Home/HomeCardTypeFive'
import HomeCardSix from 'src/components/Home/HomeCardTypeSix'
import HomeCardSeven from 'src/components/Home/HomeCardTypeSeven'
import HomeCardEight from 'src/components/Home/HomeCardTypeEight'
import PdpList from 'src/components/PdpList'
import CqContent from 'src/components/CqContent'

const Container = styled.View`
  flex: 1;
  padding-top: ${({ theme }) => theme.spacing(2)};
`

const Wrapper = styled.View`
  padding-left: ${({ theme }) => theme.spacing(2)};
`

const Flex = styled.View`
  flex-direction: row;
  justify-content: ${({ isCentered }) =>
    isCentered ? 'center' : 'space-between'};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  align-items: center;
`

const IconButton = styled.TouchableOpacity`
  position: relative;
  margin-right: ${({ theme }) => theme.spacing(1)};
`

const IconImage = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
`

const FilterCountContainer = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  height: ${({ theme }) => theme.spacing(2)};
  min-width: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  border-width: 0;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.primaryGreen};
`

const FilterCountText = styled.Text`
  ${({ theme }) => theme.typography.caption}
  color: ${({ theme }) => theme.palette.white};
  padding-left: 1;
`

const LoadingOverlay = styled.View`
  position: absolute;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
`
const TotalResultsText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey3};
`

const Spacer = styled.View`
  width: ${({ theme }) => theme.spacing(3)};
`
const Name = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const ErrorMessage = styled.Text`
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.palette.grey2};
  text-align: center;
`

enum BrowseOptions {
  SORT = 'sort',
  FILTERS = 'filters',
}

interface OwnProps {
  style?: any
  browseUrl: string
  withTitle?: boolean
}

type Props = OwnProps & NavigationInjectedProps

const BrowseResultsWithFilter = ({
  style,
  browseUrl,
  navigation,
  withTitle = false,
}: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const [browseDetails, setBrowseDetails] = useState<
    undefined | BrowseDetailsModel
  >(undefined)
  const [openOptions, setOpenOptions] = useState<undefined | BrowseOptions>(
    undefined,
  )
  const [specifiedFilterChipGroup, setSpecifiedFilterChipGroup] = useState<
    undefined | ChipGroupModel
  >(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)

  // initial load
  useEffect(() => {
    onApplyFilterTerm(browseUrl)
  }, [browseUrl])

  const onApplyFilterTerm = async (url: string) => {
    if (!isLoading) {
      setIsLoading(true)
      if (url.substring(0, 2) === '/w') {
        closeModal()
        const product = url.split('ean=')[1]
        if (product) {
          push(Routes.PDP__MAIN, { ean: product })
        } else {
          const results = await getNoResultsData({ url })

          if (results) {
            setBrowseDetails(results)
            setIsLoading(false)
          }
        }
        setIsLoading(false)
      } else {
        let results
        if (!url.startsWith('/h')) {
          results = await getBrowseDetailsData({ url })
        } else {
          push(Routes.WEBVIEW__WITH_SESSION, {
            [Params.WEB_ROUTE]: WebRoutes.WEB_BASE + url,
          })
          setIsLoading(false)
        }

        if (results) {
          setBrowseDetails(results)
          setIsLoading(false)
        }
      }
    }
  }

  useEffect(() => {
    navigation.setParams({ _browseTitle: browseDetails && browseDetails.title })
  }, [browseDetails])

  const appliedFilterChipGroup: ChipGroupModel = {
    chips: ((browseDetails && browseDetails.appliedFilters) || []).map(
      (filter): ChipModel => ({
        name: filter.name,
        id: filter.term,
        selected: true,
      }),
    ),
  }

  const filterChipGroups: ChipGroupModel[] = (
    (browseDetails && browseDetails.filterGroups) ||
    []
  ).map((filterGroup) => ({
    name: filterGroup.name,
    chips: filterGroup.filters.map(
      (filter): ChipModel => ({ name: filter.name, id: filter.term }),
    ),
  }))

  const filterHeaderChips: ChipGroupModel = {
    chips: [
      ...((browseDetails && browseDetails.appliedFilters) || []).map(
        (filter): ChipModel => ({
          name: filter.name,
          id: filter.term,
          selected: true,
        }),
      ),
      ...filterChipGroups.map(
        (filterChipGroup): ChipModel => ({
          name: filterChipGroup.name || '',
          id: filterChipGroup.name || '',
          onPressOverride: () => {
            setSpecifiedFilterChipGroup(filterChipGroup)
            setOpenOptions(BrowseOptions.FILTERS)
          },
          dropdownIcon: true,
        }),
      ),
    ],
  }
  const sortChipGroup: ChipGroupModel = {
    chips: ((browseDetails && browseDetails.sort) || []).map(
      (_sort): ChipModel => ({
        name: _sort.name,
        id: _sort.term,
        selected: _sort.selected,
      }),
    ),
  }

  useEffect(() => {
    if (
      filterChipGroups.length === 0 &&
      appliedFilterChipGroup.chips.length === 0 &&
      openOptions === BrowseOptions.FILTERS
    ) {
      closeModal()
    }
  }, [openOptions, filterChipGroups])

  const onApplySortTerm = async (url: string) => {
    if (!isLoading) {
      closeModal()
      setIsLoading(true)
      const results = await getBrowseDetailsData({ url })

      if (results) {
        setBrowseDetails(results)
        setIsLoading(false)
      }
    }
  }

  const closeModal = () => {
    setOpenOptions(undefined)
    setSpecifiedFilterChipGroup(undefined)
  }

  const onLoadMoreResults = async () => {
    if (!isLoadingMore && !isLoading && browseDetails) {
      if (browseDetails.page === browseDetails.totalPages) {
        return
      }
      setIsLoadingMore(true)
      const page = browseDetails.page + 1
      const results = await getBrowseDetailsData({
        url: browseDetails?.nextPageUrl,
        pageNumber: page,
      })
      if (results) {
        const newFilterResults = {
          ...results,
          filterResults: {
            ...results.filterResults,
            results: [
              ...browseDetails.filterResults.results,
              ...results.filterResults.results,
            ],
          },
        } as BrowseDetailsModel
        setBrowseDetails(newFilterResults)
      }

      setIsLoadingMore(false)
    }
  }

  const openWebView = (url) => {
    if (url) {
      push(Routes.WEBVIEW__WITH_SESSION, {
        [Params.WEB_ROUTE]: WebRoutes.WEB_BASE + url,
        onPressBack: () => {
          navigation.goBack()
          navigation.goBack()
        },
      })
    }
  }
  const renderCards = () => {
    return (
      <ScrollContainer>
        {browseDetails?.browseSections.map((content, index) => {
          switch (content.type) {
            case 'TypeTwo':
              return <HomeCardTwo key={index} content={content} />
            case 'TypeFive':
              return <HomeCardFive key={index} content={content} />
            case 'TypeSix':
              return <HomeCardSix key={index} content={content} />
            case 'TypeSeven':
              return (
                <HomeCardSeven
                  key={index}
                  content={content}
                  onPress={onApplyFilterTerm}
                />
              )
            case 'TypeEight':
              return (
                <HomeCardEight
                  key={index}
                  content={content}
                  onPress={onApplyFilterTerm}
                />
              )
            case 'CQType':
              return (
                <CqContent
                  cqContent={{
                    source: content.imageSource,
                  }}
                  cssLink={browseDetails.CSS}
                  jsLink={browseDetails.JS}
                />
              )
          }
        })}
      </ScrollContainer>
    )
  }

  return (
    <Container style={style}>
      {browseDetails ? (
        browseDetails.errorMessage ? (
          <ErrorMessage>{browseDetails.errorMessage}</ErrorMessage>
        ) : (
          <>
            <Wrapper>
              {withTitle && <Name>{browseDetails.name}</Name>}
              {browseDetails.filterResults.type !== 'TopXList' ? (
                <Flex
                  isCentered={
                    sortChipGroup.chips.length === 0 ||
                    browseDetails.filterResults.results.length === 1
                  }
                >
                  {!!sortChipGroup.chips.length &&
                    browseDetails.filterResults.results.length > 1 && (
                      <IconButton
                        onPress={() => {
                          setOpenOptions(BrowseOptions.SORT)
                        }}
                      >
                        <IconImage source={icons.sortDefault} />
                      </IconButton>
                    )}
                  {!!browseDetails.totalResults && (
                    <>
                      <TotalResultsText>
                        {browseDetails.totalResults} results
                      </TotalResultsText>
                      <Spacer />
                    </>
                  )}
                </Flex>
              ) : null}
              {((filterChipGroups.length === 0 &&
                appliedFilterChipGroup.chips.length > 0) ||
                filterChipGroups.length > 0) &&
              browseDetails.filterResults.type !== 'TopXList' ? (
                <Flex>
                  <IconButton
                    onPress={() => {
                      setOpenOptions(BrowseOptions.FILTERS)
                    }}
                  >
                    <IconImage source={icons.filter} />
                    {!!appliedFilterChipGroup.chips.length && (
                      <FilterCountContainer>
                        <FilterCountText>
                          {appliedFilterChipGroup.chips.length}
                        </FilterCountText>
                      </FilterCountContainer>
                    )}
                  </IconButton>

                  <OptionChipsList
                    chips={filterHeaderChips}
                    onSelect={onApplyFilterTerm}
                    scrollable
                  />
                </Flex>
              ) : null}
            </Wrapper>
            {!!browseDetails.filterResults.results &&
            !!browseDetails.filterResults.results.length ? (
              <PdpList
                results={browseDetails.filterResults.results}
                onEndReached={onLoadMoreResults}
                isLoading={isLoadingMore}
                hasReachedEnd={browseDetails.page === browseDetails.totalPages}
                footerElement={() => renderCards()}
              />
            ) : !!browseDetails.browseSections.length &&
              !browseDetails.url?.startsWith('/h') ? (
              renderCards()
            ) : (
              !browseDetails.filterResults.type &&
              openWebView(browseDetails.url)
            )}
            {isLoading && (
              <LoadingOverlay>
                <LoadingIndicator
                  isLoading={true}
                  color={theme.palette.disabledGrey}
                />
              </LoadingOverlay>
            )}
            <SearchFilterModal
              isOpen={openOptions === BrowseOptions.FILTERS}
              onDismiss={closeModal}
              specifiedFilterChipGroup={specifiedFilterChipGroup}
              setSpecifiedFilterChipGroup={setSpecifiedFilterChipGroup}
              appliedFilterChipGroup={appliedFilterChipGroup}
              filterChipGroups={filterChipGroups}
              onApplyFilterTerm={onApplyFilterTerm}
              isLoading={isLoading}
              resetCallback={() => {
                onApplyFilterTerm(browseUrl)
              }}
            />
            <SearchSortModal
              isOpen={openOptions === BrowseOptions.SORT}
              onDismiss={closeModal}
              sortChipGroup={sortChipGroup}
              onApplySortTerm={onApplySortTerm}
            />
          </>
        )
      ) : (
        isLoading && (
          <LoadingOverlay>
            <LoadingIndicator
              isLoading={true}
              color={theme.palette.disabledGrey}
            />
          </LoadingOverlay>
        )
      )}
    </Container>
  )
}

export default withNavigation(BrowseResultsWithFilter)
