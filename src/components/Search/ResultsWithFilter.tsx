import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'

import PdpList from 'src/components/PdpList'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import IMAGES, { icons } from 'assets/images'
import SearchFilterModal from './FilterModal'
import SearchSortModal from './SortModal'
import BrowseResultsWithFilter from 'src/components/BrowseCategoryList/BrowseResultsWithFilter'

import { getSearchResultsData } from 'src/data/search'
import {
  SearchResultsModel,
  SearchOtherResultsModel,
} from 'src/models/SearchModel'
import OptionChipsList, {
  ChipModel,
  ChipGroupModel,
} from 'src/components/OptionChipsList'

const Flex = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  align-items: center;
`

const Image = styled.Image`
  height: 200;
  width: 200;
`

const TotalResultsText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey3};
`

const Content = styled.View`
  align-items: center;
  height: 100%;
  justify-content: flex-start;
  top: 20%;
`

const Container = styled.View`
  flex: 1;
  position: relative;
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2}
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

const Spacer = styled.View`
  width: ${({ theme }) => theme.spacing(3)};
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

enum SearchOptions {
  SORT = 'sort',
  FILTERS = 'filters',
}

interface OwnProps {
  style?: any
  searchTerm: string
  initialFilterTerm?: string
  sortTerm: string
  searchMode: string
}

type Props = OwnProps

const SearchResultsWithFilter = ({
  style,
  searchTerm,
  initialFilterTerm,
  sortTerm,
  searchMode,
}: Props) => {
  const [searchResults, setSearchResults] = useState<
    undefined | SearchResultsModel
  >(undefined)
  const [firstLoad, setFirstLoad] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [otherTerm, setOtherTerm] = useState<
    SearchOtherResultsModel | undefined
  >(undefined)

  const [openOptions, setOpenOptions] = useState<undefined | SearchOptions>(
    undefined,
  )
  const [specifiedFilterChipGroup, setSpecifiedFilterChipGroup] = useState<
    undefined | ChipGroupModel
  >(undefined)

  useEffect(() => {
    let isCanceled = false
    const callback = async () => {
      setIsLoading(true)
      const results = await getSearchResultsData({
        searchTerm,
        filterTerm: initialFilterTerm,
        sortTerm: sortTerm,
        searchMode: searchMode,
      })
      if (!isCanceled) {
        if (results?.type === 'browse') {
          setOtherTerm(results as SearchOtherResultsModel)
          setIsLoading(false)
          setFirstLoad(false)
        } else {
          setSearchResults(results as SearchResultsModel)
          setIsLoading(false)
          setFirstLoad(false)
        }
      }
    }
    if (!isLoading) {
      callback()
    }
    return () => {
      isCanceled = true
    }
  }, [])

  const onLoadMoreResults = async () => {
    if (!isLoadingMore && !isLoading && searchResults) {
      if (searchResults.page === searchResults.totalPages) {
        return
      }
      setIsLoadingMore(true)
      const page = searchResults.page + 1
      const results = await getSearchResultsData({
        filterTerm: searchResults.currentFilterTerm,
        sortTerm: searchResults.currentSortTerm,
        searchTerm,
        page,
      })
      if (results) {
        if (!results.type) {
          // default
          const newSearchResults = {
            ...results,
            results: [
              ...searchResults.results,
              ...(results as SearchResultsModel).results,
            ],
          } as SearchResultsModel
          setSearchResults(newSearchResults)
        }
      }
      if (setIsLoadingMore) {
        setIsLoadingMore(false)
      }
    }
  }

  const closeModal = () => {
    setOpenOptions(undefined)
    setSpecifiedFilterChipGroup(undefined)
  }

  const onApplyFilterTerm = (id: string) => {
    const callback = async () => {
      setIsLoading(true)
      const results = await getSearchResultsData({
        searchTerm,
        filterTerm: id,
        sortTerm: searchResults && searchResults.currentSortTerm,
      })
      if (results && !results.type) {
        setSearchResults(results as SearchResultsModel)
        setIsLoading(false)
      }
    }
    if (!isLoading) {
      callback()
    }
  }

  const onApplySortTerm = (id: string) => {
    const callback = async () => {
      closeModal()
      setIsLoading(true)
      const results = await getSearchResultsData({
        searchTerm,
        sortTerm: id,
        filterTerm: searchResults && searchResults.currentFilterTerm,
      })
      if (results && !results.type) {
        setSearchResults(results as SearchResultsModel)
        setIsLoading(false)
      }
    }
    if (!isLoading) {
      callback()
    }
  }

  const appliedFilterChipGroup: ChipGroupModel = {
    chips: ((searchResults && searchResults.appliedFilters) || []).map(
      (filter): ChipModel => ({
        name: filter.name,
        id: filter.term,
        selected: true,
      }),
    ),
  }

  const filterChipGroups: ChipGroupModel[] = (
    (searchResults && searchResults.filterGroups) ||
    []
  ).map((filterGroup) => ({
    name: filterGroup.name,
    chips: filterGroup.filters.map(
      (filter): ChipModel => ({ name: filter.name, id: filter.term }),
    ),
  }))

  const filterHeaderChips: ChipGroupModel = {
    chips: [
      ...((searchResults && searchResults.appliedFilters) || []).map(
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
            setOpenOptions(SearchOptions.FILTERS)
          },
          dropdownIcon: true,
        }),
      ),
    ],
  }

  const sortChipGroup: ChipGroupModel = {
    chips: ((searchResults && searchResults.sort) || []).map(
      (_sort): ChipModel => ({
        name: _sort.name,
        id: _sort.term,
        selected: _sort.selected,
      }),
    ),
  }

  if (firstLoad) {
    return (
      <Container style={style}>
        <LoadingIndicator isLoading={true} />
      </Container>
    )
  }

  if (otherTerm) {
    if (otherTerm.type === 'browse') {
      return <BrowseResultsWithFilter browseUrl={otherTerm.term} />
    }
  }

  return (
    <Container style={style}>
      {searchResults ? (
        <>
          <Flex marginBottom>
            <IconButton
              onPress={() => {
                setOpenOptions(SearchOptions.SORT)
              }}
            >
              <IconImage source={icons.sortDefault} />
            </IconButton>
            <TotalResultsText>
              {searchResults.totalResults} results
            </TotalResultsText>
            <Spacer />
          </Flex>
          <Flex>
            <IconButton
              onPress={() => {
                setOpenOptions(SearchOptions.FILTERS)
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
          <PdpList
            results={searchResults.results}
            onEndReached={onLoadMoreResults}
            isLoading={isLoadingMore}
            hasReachedEnd={searchResults.page === searchResults.totalPages}
          />
          <SearchFilterModal
            isOpen={openOptions === SearchOptions.FILTERS}
            onDismiss={closeModal}
            specifiedFilterChipGroup={specifiedFilterChipGroup}
            setSpecifiedFilterChipGroup={setSpecifiedFilterChipGroup}
            appliedFilterChipGroup={appliedFilterChipGroup}
            filterChipGroups={filterChipGroups}
            onApplyFilterTerm={onApplyFilterTerm}
            isLoading={isLoading}
          />
          <SearchSortModal
            isOpen={openOptions === SearchOptions.SORT}
            onDismiss={closeModal}
            sortChipGroup={sortChipGroup}
            onApplySortTerm={onApplySortTerm}
          />
          {isLoading && (
            <LoadingOverlay>
              <LoadingIndicator isLoading={true} />
            </LoadingOverlay>
          )}
        </>
      ) : isLoading ? (
        <LoadingIndicator isLoading={true} />
      ) : (
        <Content>
          <Image source={IMAGES.search} />
          <HeaderText>
            Sorry, we couldn't find what you're looking for
          </HeaderText>
          <DescriptionText>Please try another search.</DescriptionText>
        </Content>
      )}
    </Container>
  )
}

export default SearchResultsWithFilter
