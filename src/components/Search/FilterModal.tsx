import React, { useContext } from 'react'
import { connect } from 'react-redux'
import styled, { ThemeContext } from 'styled-components/native'

import DraggableModal from 'src/controls/Modal/BottomDraggable'
import _OptionChipsList, {
  ChipGroupModel,
} from 'src/components/OptionChipsList'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import Button from 'src/controls/Button'
import { ThemeModel } from 'src/models/ThemeModel'
import {
  addEventAction,
  LL_FILTERED_APPLIED,
} from 'src/redux/actions/localytics'

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const Flex = styled.View`
  flex: 1;
`

const ResetButton = styled(Button)`
  margin-left: ${({ theme }) => theme.spacing(3)};
`

const LoadingContainer = styled.View`
  height: 100%;
  width: 100%;
  position: absolute;
  align-items: center;
  justify-content: center;
`

const OptionChipsList = styled(_OptionChipsList)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const HeaderText = styled.Text`
  align-self: center;
  ${({ theme }) => theme.typography.subTitle1}
`

interface OwnProps {
  isOpen: boolean
  onDismiss: () => void
  specifiedFilterChipGroup?: ChipGroupModel
  setSpecifiedFilterChipGroup: (param: ChipGroupModel) => void
  appliedFilterChipGroup: ChipGroupModel
  filterChipGroups: ChipGroupModel[]
  onApplyFilterTerm: (filterTerm: string) => void
  isLoading: boolean
  resetCallback?: () => void
}

interface DispatchProps {
  addEvent: (name, attributes) => void
}

const dispatcher = (dispatch) => ({
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})

const connector = connect<{}, DispatchProps, {}>(null, dispatcher)

type Props = OwnProps & DispatchProps

const FILTER_TYPES = {
  PRODUCT_TYPES: 'Product Type',
  SUBJECTS: 'Subjects',
  FORMATS: 'Formats',
  PRICES: 'Prices',
  PRICE: 'Price',
  AGES: 'Ages',
  AGE: 'Age',
}
const SearchFilterModal = ({
  isOpen,
  onDismiss,
  specifiedFilterChipGroup,
  setSpecifiedFilterChipGroup,
  appliedFilterChipGroup,
  filterChipGroups,
  onApplyFilterTerm,
  isLoading,
  resetCallback,
  addEvent,
}: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel

  const setFilterforEvents = (type, name) => {
    switch (type) {
      case FILTER_TYPES.PRODUCT_TYPES:
        addEvent(LL_FILTERED_APPLIED, { productType: name })
        return
      case FILTER_TYPES.SUBJECTS:
        addEvent(LL_FILTERED_APPLIED, { subjects: name })
        return
      case FILTER_TYPES.FORMATS:
        addEvent(LL_FILTERED_APPLIED, { formats: name })
        return
      case FILTER_TYPES.PRICES:
      case FILTER_TYPES.PRICE:
        addEvent(LL_FILTERED_APPLIED, { prices: name })
        return
      case FILTER_TYPES.AGES:
      case FILTER_TYPES.AGE:
        addEvent(LL_FILTERED_APPLIED, { age: name })
        return
      default:
        return
    }
  }

  return (
    <DraggableModal
      isOpen={isOpen}
      onDismiss={() => {
        onDismiss()
      }}
      fullContent
      header={
        <HeaderContainer>
          <Flex>
            <ResetButton
              onPress={() => {
                resetCallback ? resetCallback() : onApplyFilterTerm('')
                onDismiss()
              }}
              linkGreen
            >
              Reset
            </ResetButton>
          </Flex>
          <HeaderText>Filter By</HeaderText>
          <Flex />
        </HeaderContainer>
      }
    >
      {!specifiedFilterChipGroup ? (
        <>
          <OptionChipsList
            chips={appliedFilterChipGroup}
            onSelect={(id, name) => {
              onApplyFilterTerm(id)
            }}
          />
          {filterChipGroups.map((filterChips, index) => {
            return (
              <OptionChipsList
                key={index}
                chips={filterChips}
                onSelect={(id, name) => {
                  onApplyFilterTerm(id)
                  if (filterChips) {
                    setFilterforEvents(filterChips.name, name)
                  }
                }}
              />
            )
          })}
        </>
      ) : (
        <OptionChipsList
          chips={specifiedFilterChipGroup}
          onSelect={(id, name) => {
            onApplyFilterTerm(id)
            onDismiss()
            if (specifiedFilterChipGroup) {
              setFilterforEvents(specifiedFilterChipGroup.name, name)
            }
          }}
        />
      )}
      {isLoading && (
        <LoadingContainer>
          <LoadingIndicator
            isLoading={true}
            color={theme.palette.disabledGrey}
          />
        </LoadingContainer>
      )}
    </DraggableModal>
  )
}

export default connector(SearchFilterModal)
