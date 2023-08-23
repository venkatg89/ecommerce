import React from 'react'
import { SectionList, SectionListData } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import ItemOptionsHeader from './Header'
import ItemOptionItem from './Item'

import { CafeItem, CafeItemOption } from 'src/models/CafeModel/ItemsModel'
import { cafeItemSelector, cafeItemOptionsSelector } from 'src/redux/selectors/cafeSelector'
import { itemOptionsListingsSelector } from 'src/redux/selectors/listings/cafeSelector'

const SectionSpacing = styled.View`
  height: ${({ theme }) => theme.spacing(1)};
`

interface OwnProps {
  itemId: string;
  selectedItemOptions: Record<string, string[]>;
  toggleItemOptionId: (itemOptionId: string, addonGroupId: string) => void;
}

interface StateProps {
  item: CafeItem;
  itemOptions: Record<string, CafeItemOption>;
  itemOptionsListings: Record<string, string[]>;
}

interface State {
  openedItemOptionIds: string[];
}

const selector = createStructuredSelector({ // TODO: use Id
  item: (state, ownProps) => {
    const { itemId } = ownProps
    return cafeItemSelector(state, { itemId })
  },
  itemOptions: cafeItemOptionsSelector,
  itemOptionsListings: itemOptionsListingsSelector,
})

const connector = connect<StateProps, {}, {}>(selector)

type Props = StateProps & OwnProps

class CafeItemOptionList extends React.Component<Props, State> {
  state = {
    openedItemOptionIds: [] as string[],
  }

  toggleOpenedItemOptionIds = (id: string) => {
    const { openedItemOptionIds } = this.state
    if (openedItemOptionIds.includes(id)) {
      this.setState({ openedItemOptionIds: openedItemOptionIds.filter(i => i !== id) })
    } else {
      this.setState({ openedItemOptionIds: [...openedItemOptionIds, id] })
    }
  }

  renderSectionHeader = ({ section }) => (
    <ItemOptionsHeader
      addonGroup={ section.addonGroup }
      onClick={ this.toggleOpenedItemOptionIds }
      collapsed={ !section.addonGroup.minSelection && !this.state.openedItemOptionIds.includes(section.addonGroup.id) }
    />
  )

  renderItem = ({ item, section }) => {
    const { selectedItemOptions, toggleItemOptionId } = this.props
    const { addonGroup } = section

    const selected = (selectedItemOptions[addonGroup.id] || []).includes(item.id) // for empty state

    return (
      <ItemOptionItem
        itemOption={ item }
        onPress={ () => { toggleItemOptionId(item.id, addonGroup.id) } }
        selected={ selected }
        checkboxStyle={ !addonGroup.minSelection }
      />
    )
  }

  formatItemOptionsToGroupedAddonSectionsData = (): SectionListData<CafeItemOption>[] => {
    const { item, itemOptions, itemOptionsListings } = this.props
    const { addonGroups = [] } = item
    const { openedItemOptionIds } = this.state

    return (
      addonGroups.map((addonGroup): SectionListData<CafeItemOption> => {
        const itemOptionIds = itemOptionsListings[addonGroup.id] || []
        const data = itemOptionIds.filter(e => !!e).map(id => itemOptions[id])
        return ({
          title: addonGroup.name,
          data: (addonGroup.minSelection || openedItemOptionIds.includes(addonGroup.id)) ? data : [],
          addonGroup,
        })
      })
    )
  }

  render() {
    const sectionsData = this.formatItemOptionsToGroupedAddonSectionsData()

    return (
      <SectionList
        sections={ sectionsData }
        keyExtractor={ item => item.id }
        renderItem={ this.renderItem }
        renderSectionHeader={ this.renderSectionHeader }
        SectionSeparatorComponent={ SectionSpacing }
      />
    )
  }
}

export default connector(CafeItemOptionList)
