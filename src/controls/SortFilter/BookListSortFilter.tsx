import React, { useContext, useState, useEffect } from 'react'
import styled, { ThemeContext } from 'styled-components/native'
import _Modal from 'react-native-modal'
import DeviceInfo from 'react-native-device-info'

import _Button from 'src/controls/Button'
import { BookListFormatNames, BookListSortNames } from 'src/models/MyBooks/BookListSortFilter'
import { ReadingStatus } from 'src/models/ReadingStatusModel'
import { CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'
import { icons } from 'assets/images'

const Modal = styled(_Modal)`
  justify-content: flex-end;
  margin-horizontal: 0px;
  margin-bottom: 0px;
`

interface ModalContainerProps {
  currentWidth: number
}

const ModalContainer = styled.View<ModalContainerProps>`
  background-color: ${({ theme }) => theme.palette.white};
  min-height: ${({ theme }) => theme.spacing(35)};
  padding-top: ${({ theme }) => theme.spacing(1)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  border-radius: 12;
  position: relative;
  ${({ currentWidth }) => DeviceInfo.isTablet() && `margin-horizontal: ${CONTENT_HORIZONTAL_PADDING(currentWidth)};`}
`

const HeaderContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(1)};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  padding-right: ${({ theme }) => theme.spacing(3)};
`

const IconButton = styled(_Button)`
`

const CloseIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const Handle = styled.View`
  left: 40%;
  width: 20%;
  border-color: ${({ theme }) => theme.palette.grey2};
  border-width: 1;
  border-radius: 1;
`
const ButtonsContainer = styled.View`
  flex-direction: row;
  flex-flow: wrap;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const Button = styled(_Button)`
  border-radius: 16;
  height: ${({ theme }) => theme.spacing(4)};
  border-width: 1px;
  ${({ theme, selected }) => (selected ? `border-color: ${theme.palette.grey5};` : `border-color: ${theme.palette.grey4};`)}
  padding: 0px ${({ theme }) => theme.spacing(2)}px;
  margin-right: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const ResetButton = styled(_Button)`
  
`

const ResetText = styled.Text`
  color: ${({ theme }) => theme.palette.linkGreen};
`
interface Props {
  isOpen: boolean
  onClose: () => void
  filterCallback?: (sort: BookListSortNames, format: BookListFormatNames, bookStatus: ReadingStatus[]) => void
  currentFormat?: BookListFormatNames
  currentSort?: BookListSortNames
  currentBookStatus?: ReadingStatus[]
  disabledFilters?: any
  disableStatus?: boolean
  defaultSort?: BookListSortNames
  disableFormat?: boolean
}

const sortOptions = Object.values(BookListSortNames)
const formatOptions = Object.values(BookListFormatNames).filter(i => i !== BookListFormatNames.ALL)
const bookStatusOptions = Object.keys(ReadingStatus)

const DEFAULT_DISABLED_FILTERS = {
  sort: [],
  bookStatus: [],
  format: [],
}

const SortFilter = ({
  isOpen, onClose, filterCallback = () => {}, currentSort, currentFormat, disableFormat,
  currentBookStatus, disabledFilters = DEFAULT_DISABLED_FILTERS, disableStatus = false, defaultSort = BookListSortNames.RECENT,
}: Props) => {
  const { palette } = useContext(ThemeContext)
  const { width } = useResponsiveDimensions()
  const [sort, setSort] = useState<BookListSortNames>(BookListSortNames.DATE_ADDED)
  const [format, setFormat] = useState<BookListFormatNames>(BookListFormatNames.ALL)
  const [bookStatus, setBookStatus] = useState<ReadingStatus[]>([])

  useEffect(() => {
    if (currentSort) {setSort(currentSort)}
  }, [currentSort])

  useEffect(() => {
    if (currentFormat) {setFormat(currentFormat)}
  }, [currentFormat])

  useEffect(() => {
    if (currentBookStatus) {setBookStatus(currentBookStatus)}
  }, [currentBookStatus])


  const applyFilter = () => filterCallback(sort, format, bookStatus)
  const setDefaults = () => {
    setSort(defaultSort)
    setFormat(BookListFormatNames.ALL)
    setBookStatus([])
  }

  const onPressFormat = (target: BookListFormatNames) => (target === format ? setFormat(BookListFormatNames.ALL) : setFormat(target))
  const onPressBookStatus = (target: ReadingStatus) => (bookStatus.includes(target) ? setBookStatus(bookStatus.filter(i => i !== target)) : setBookStatus(bookStatus.concat(target)))

  const getTextStyle = (target, current) => {
    const textStyle = { textTransform: 'capitalize' }
    if (Array.isArray(current) && current.includes(target)) {return textStyle}
    if (target === current) {return textStyle}
    return { color: palette.grey3, ...textStyle }
  }

  return (
    <Modal
      isVisible={ isOpen }
      backdropOpacity={ 0.5 }
      swipeDirection={ ['down'] }
      onSwipeComplete={ onClose }
      onModalHide={ applyFilter }
      onBackButtonPress={ onClose }
      onBackdropPress={ onClose }
    >
      <ModalContainer currentWidth={ width }>
        <Handle />
        <HeaderContainer>
          <ResetButton onPress={ setDefaults }>
            <ResetText>Reset</ResetText>
          </ResetButton>
          <HeaderText>Filter</HeaderText>
          <IconButton
            icon
            onPress={ onClose }
          >
            <CloseIcon source={ icons.actionClose } />
          </IconButton>
        </HeaderContainer>

        <>
          <Title>Sort by</Title>
          <ButtonsContainer>
            {sortOptions
              .filter(option => !disabledFilters.sort.includes(option))
              .map(option => (
                <Button
                  key={ option }
                  variant="outlined"
                  onPress={ () => setSort(option) }
                  selected={ sort === option }
                  textStyle={ getTextStyle(option, sort) }
                >
                  {option}
                </Button>
              ))}
          </ButtonsContainer>
        </>
        {disableFormat ?
          <React.Fragment />
          : (
            <>
              <Title>Format</Title>
              <ButtonsContainer>
                {formatOptions
                  .filter(option => !disabledFilters.format.includes(option))
                  .map(option => (
                    <Button
                      key={ option }
                      variant="outlined"
                      onPress={ () => onPressFormat(option) }
                      selected={ format === option }
                      textStyle={ getTextStyle(option, format) }
                    >
                      {option}
                    </Button>
                  ))}
              </ButtonsContainer>
            </>
          )}
        {disableStatus ?
          <React.Fragment />
          : (
            <>
              <Title>Reading Lists</Title>
              <ButtonsContainer>
                {bookStatusOptions.map(option => (
                  <Button
                    disabled={ disabledFilters.bookStatus.includes(option) }
                    key={ ReadingStatus[option] }
                    variant="outlined"
                    onPress={ () => onPressBookStatus(ReadingStatus[option]) }
                    selected={ bookStatus.includes(ReadingStatus[option]) }
                    textStyle={ getTextStyle(ReadingStatus[option], bookStatus) }
                  >
                    {option.replace(/_+/g, ' ')}
                  </Button>
                ))}
              </ButtonsContainer>

            </>
          )}
      </ModalContainer>
    </Modal>
  )
}

export default SortFilter
