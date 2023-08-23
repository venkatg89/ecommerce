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
  margin-top: ${({ theme }) => theme.spacing(3)};
  flex-direction: row;
  flex-wrap: wrap;
`

interface Props {
  modalClose: any
  title: string
  content: string[]
}

const ReviewsModal = ({ modalClose, title, content }: Props) => {
  const [selectedTags, setSelectedTags] = useState<(string | undefined)[]>([])

  const getUniqueTags = (content) => {
    let final = content.filter((item, index) => content.indexOf(item) === index)
    return final
  }

  const resetFilters = () => {
    setSelectedTags([])
  }

  const closeModalHandler = () => {
    modalClose(title, selectedTags)
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
          <TopHeader>{title}</TopHeader>
          <Button icon onPress={closeModalHandler}>
            <IconClose source={icons.actionClose} />
          </Button>
        </Wrapper>
        <TagsContainer>
          {getUniqueTags(content).map((item, index) => (
            <TagLabel
              key={index}
              withIcon={true}
              text={item}
              isSelected={selectedTags.indexOf(item) !== -1}
              onSelect={() => {
                if (selectedTags.includes(item)) {
                  let tags = selectedTags.filter((tag) => tag !== item)
                  setSelectedTags(tags)
                } else {
                  setSelectedTags([...selectedTags, item])
                }
              }}
            />
          ))}
        </TagsContainer>
      </Container>
    </>
  )
}

export default ReviewsModal
