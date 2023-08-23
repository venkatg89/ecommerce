import React, { useState } from 'react'
import styled from 'styled-components/native'

import Button from 'src/controls/Button'

import _Container from 'src/controls/layout/ScreenContainer'

import { icons } from 'assets/images'
import TagLabel from 'src/components/Pdp/TagLabel'

const Container = styled(_Container)`
  border-radius: ${({ theme }) => theme.spacing(2)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

const Wrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing(1)};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const TopHeader = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey1};
  margin-right: ${({ theme }) => theme.spacing(3)};
`
const SubTitleHeader = styled(TopHeader)`
  margin-top: ${({ theme }) => theme.spacing(4)};
`

const TopLine = styled.View`
  background-color: ${({ theme }) => theme.palette.grey5};
  width: 29;
  height: 4;
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const TopLineContainer = styled.View`
  align-items: center;
  justify-content: center;
`

const IconClose = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const TagsContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(2)};
  flex-direction: row;
  flex-wrap: wrap;
`

interface Props {
  modalClose: any
  ratingTitle: string
  ratingStack: string[]
  readerTitle: string
  readerStack: string[]
  spoilerTitle: string
  spoilerStack: string[]
  ratingContent: string[]
  readerContent: string[]
  spoilerContent: string[]
}

const ReviewsAllFiltersModal = ({
  modalClose,
  ratingTitle,
  ratingContent,
  ratingStack,
  readerTitle,
  readerStack,
  readerContent,
  spoilerTitle,
  spoilerStack,
  spoilerContent,
}: Props) => {
  const [ratingSelectedTags, setRatingSelectedTags] = useState<(string | undefined)[]>(ratingStack)
  const [readerSelectedTags, setReaderSelectedTags] = useState<(string | undefined)[]>(readerStack)
  const [spoilerSelectedTags, setSpoilerSelectedTags] = useState<(string | undefined)[]>(spoilerStack)

  const getUniqueTags = (content) => {
    let final = content.filter((item, index) => content.indexOf(item) === index)
    return final
  }

  const resetFilters = () => {
    setRatingSelectedTags([])
    setReaderSelectedTags([])
    setSpoilerSelectedTags([])
  }

  const closeModalHandler = () => {
    modalClose(ratingSelectedTags, readerSelectedTags, spoilerSelectedTags)
  }

  return (
    <>
      <Container>
        <TopLineContainer>
          <TopLine />
        </TopLineContainer>
        <Wrapper>
          <Button linkGreen onPress={resetFilters}>
            RESET
          </Button>
          <TopHeader>All Filters</TopHeader>
          <Button icon onPress={closeModalHandler}>
            <IconClose source={icons.actionClose} />
          </Button>
        </Wrapper>

        <SubTitleHeader>{ratingTitle}</SubTitleHeader>
        <TagsContainer>
          {getUniqueTags(ratingContent).map((item, index) => (
            <TagLabel
              key={index}
              withIcon={true}
              text={item}
              isSelected={ratingSelectedTags.indexOf(item) !== -1}
              onSelect={() => {
                if (ratingSelectedTags.includes(item)) {
                  let tags = ratingSelectedTags.filter((tag) => tag !== item)
                  setRatingSelectedTags(tags)
                } else {
                  setRatingSelectedTags([...ratingSelectedTags, item])
                }
              }}
            />
          ))}
        </TagsContainer>

        <SubTitleHeader>{readerTitle}</SubTitleHeader>
        <TagsContainer>
          {getUniqueTags(readerContent).map((item, index) => (
            <TagLabel
              key={index}
              withIcon={true}
              text={item}
              isSelected={readerSelectedTags.indexOf(item) !== -1}
              onSelect={() => {
                if (readerSelectedTags.includes(item)) {
                  let tags = readerSelectedTags.filter((tag) => tag !== item)
                  setReaderSelectedTags(tags)
                } else {
                  setReaderSelectedTags([...readerSelectedTags, item])
                }
              }}
            />
          ))}
        </TagsContainer>

        <SubTitleHeader>{spoilerTitle}</SubTitleHeader>
        <TagsContainer>
          {getUniqueTags(spoilerContent).map((item, index) => (
            <TagLabel
              key={index}
              withIcon={true}
              text={item}
              isSelected={spoilerSelectedTags.indexOf(item) !== -1}
              onSelect={() => {
                if (spoilerSelectedTags.includes(item)) {
                  let tags = spoilerSelectedTags.filter((tag) => tag !== item)
                  setSpoilerSelectedTags(tags)
                } else {
                  setSpoilerSelectedTags([...spoilerSelectedTags, item])
                }
              }}
            />
          ))}
        </TagsContainer>
      </Container>
    </>
  )
}

export default ReviewsAllFiltersModal
