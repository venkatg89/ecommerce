import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Text } from 'react-native'

const Item = styled.TouchableOpacity`
  height: 40px;
`

interface ItemProps {
  selected: boolean;
}

const Content = styled(Text)<ItemProps>`
  height: 40px;
  line-height: 40px;
  color: ${({ selected }) => (selected ? 'black' : 'lightgray')};
`

interface Props {
  content: string
  handler: () => void
  selected: boolean
}

interface State {
  selected: boolean
}

class RecommendationsSortItem extends Component<Props, State> {
  render() {
    const { handler, content, selected } = this.props
    return (
      <Item onPress={ handler }><Content selected={ selected }>{ content }</Content></Item>
    )
  }
}

export default RecommendationsSortItem
