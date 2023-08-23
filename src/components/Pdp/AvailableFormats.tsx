import React from 'react'
import styled from 'styled-components/native'

import { BookFormat } from 'src/models/PdpModel'
import { FlatList } from 'react-native-gesture-handler'

const Container = styled.View``

const FormatContainer = styled.TouchableOpacity`
  border-radius: 20;
  border-width: ${({ isActive }) => (isActive ? 3 : 1)};
  border-color: ${({ theme }) => theme.palette.primaryGreen};
  padding-top: ${({ isActive }) => (isActive ? 6 : 8)};
  height: 40;
  align-items: center;
  justify-content: center;
  margin-horizontal: 4;
`

const FormatText = styled.Text`
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.typography.body1}
  color: ${({ theme }) => theme.palette.grey1};
  flex: 1;
`

interface Props {
  availableFormats: BookFormat[]
  onPress: (format: BookFormat) => void
  selectedFormat?: BookFormat
}

const _AvailableFormats = ({
  availableFormats,
  onPress,
  selectedFormat,
}: Props) => {
  return (
    <Container>
      <FlatList
        data={availableFormats}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.ean}
        renderItem={({ item, index }) => {
          return (
            <FormatContainer
              isActive={selectedFormat?.ean === item.ean}
              onPress={() => onPress(item)}
            >
              <FormatText>{item.format}</FormatText>
            </FormatContainer>
          )
        }}
      />
    </Container>
  )
}

export default _AvailableFormats
