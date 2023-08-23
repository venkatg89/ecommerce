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
  flex-wrap: wrap;
`

interface Props {
  modalClose: any
  content: string[]
}

const SortModal = ({ modalClose, content }: Props) => {
  const [selectedTag, setSelectedTag] = useState('')

  const getUniqueTags = (content) => {
    let final = content.filter((item, index) => content.indexOf(item) === index)
    return final
  }

  const resetFilters = () => {
    setSelectedTag('reset')
  }

  const closeModalHandler = () => {
    modalClose(selectedTag)
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
          <TopHeader>Sort by</TopHeader>
          <Button icon onPress={closeModalHandler}>
            <IconClose source={icons.actionClose} />
          </Button>
        </Wrapper>
        <TagsContainer>
          {getUniqueTags(content).map((item, index) => (
            <TagLabel
              key={index}
              withIcon={false}
              text={item}
              isSelected={selectedTag.indexOf(item) !== -1}
              onSelect={() => {
                setSelectedTag(item)
              }}
            />
          ))}
        </TagsContainer>
      </Container>
    </>
  )
}

export default SortModal
