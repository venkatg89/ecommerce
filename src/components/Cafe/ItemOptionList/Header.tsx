import React from 'react'
import styled from 'styled-components/native'

import { CafeAddonGroup } from 'src/models/CafeModel/ItemsModel'
import { icons } from 'assets/images'

interface HeaderContainerProps {
  collapsed?: boolean;
}

const HeaderContainer = styled.View<HeaderContainerProps>`
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.palette.white};
  margin-top: ${({ theme }) => theme.spacing(1)};
  ${({ collapsed, theme }) => collapsed ? `margin-bottom: ${theme.spacing(3)}` : ''};
`

const HeaderContent = styled.View`
  flex-direction: row;
`

const NameText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey2};
`

const SelectionText = styled.Text`
  margin-left: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
`

const TouchableOpacity = styled.TouchableOpacity``

interface Props extends HeaderContainerProps {
  addonGroup: CafeAddonGroup;
  onClick: (id: string) => void;
}

const Header = ({ addonGroup, onClick, collapsed }: Props) => (
  <TouchableOpacity
    onPress={ () => {
      if (!addonGroup.minSelection) {
        onClick(addonGroup.id)
      }
    } }
  >
    <HeaderContainer collapsed={ collapsed }>
      <HeaderContent>
        <NameText>
          { addonGroup.name }
        </NameText>
        <SelectionText>
          { addonGroup.minSelection
            ? `Select ${addonGroup.minSelection}`
            : 'Optional' // TODO: Add up to #
          }
        </SelectionText>
      </HeaderContent>
      { !addonGroup.minSelection &&
        <Icon source={ collapsed ? icons.chevronDown : icons.chevronUp } />
      }
    </HeaderContainer>
  </TouchableOpacity>
)

export default Header
