import React, { useCallback, useState, Fragment, useEffect } from 'react'
import styled from 'styled-components/native'

import Button from 'src/controls/Button'

import { push, Routes } from 'src/helpers/navigationService'
import { StoreType } from 'src/screens/myBN/StoreDetails'

interface OwnProps {
  storeType: StoreType;
  withFavoriteStore: boolean;
}

const TooltipContainer = styled.View`
  ${({ theme }) => theme.boxShadow.container};
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`

const TooltipText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const FindMyBnButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-horizontal: ${({ theme }) => theme.spacing(7)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  flex: 1;
`
type Props = OwnProps

const StoreTooltip = ({ storeType, withFavoriteStore }: Props) => {
  const [showTooltip, setShowTooltip] = useState(true)
  const [toggleDismiss, setDismiss] = useState(false)
  useEffect(() => {
    if (withFavoriteStore || storeType === StoreType.DETAILS) {
      setShowTooltip(false)
    }
    if (!toggleDismiss && storeType === StoreType.NEARBY && !withFavoriteStore) {
      setShowTooltip(true)
    }
  }, [storeType, withFavoriteStore, toggleDismiss])

  const navigateToStoreSearch = useCallback(() => { push(Routes.MY_BN__SEARCH_STORE) }, [])

  const handleCloseTooltip = useCallback(() => {
    setShowTooltip(false)
    setDismiss(true)
  }, [])

  if (!showTooltip) {
    return <Fragment />
  }

  return (
    <TooltipContainer>
      <TooltipText>
        Find out what&apos;s happening at your favorite store or place a pickup order from the café.
      </TooltipText>
      <FindMyBnButton
        variant="contained"
        onPress={ navigateToStoreSearch }
        center
        maxWidth
        size="small"
      >
      Find My B&N
      </FindMyBnButton>
      <Button
        onPress={ handleCloseTooltip }
        center
        linkGreen
        size="small"
      >
      Dismiss
      </Button>
    </TooltipContainer>
  )
}

export default StoreTooltip
