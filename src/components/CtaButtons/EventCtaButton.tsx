import React, { useState, useCallback } from 'react'
import Share from 'react-native-share'

import { makeEventURLFull } from 'src/helpers/generateUrl'

import CtaButton from 'src/controls/navigation/CtaButton'
import DraggableModal from 'src/controls/Modal/BottomDraggable'
import Button from 'src/controls/Button/CtaButton'
import { icons } from 'assets/images'

interface OwnProps {
  eventId: string
}

type Props = OwnProps

const EventCtaButton = ({ eventId }: Props) => {
  const [isOpen, setOpen] = useState<boolean>(false)

  const toggleModal = useCallback(() => setOpen(!isOpen), [isOpen])

  const handleClickShare = async () => {
    const eventUrl = makeEventURLFull(eventId)
    const options = {
      title: 'Share via',
      url: eventUrl,
      social: Share.Social.EMAIL,
    }
    try {
      await Share.open(options)
      toggleModal()
    } catch {
      toggleModal()
    }
  }

  return (
    <>
      <CtaButton dots onPress={ toggleModal } accessibilityLabel="three dots" />
      <DraggableModal
        isOpen={ isOpen }
        onDismiss={ toggleModal }
      >
        <Button
          icon={ icons.share }
          label="Share"
          onPress={ handleClickShare }
        />
      </DraggableModal>
    </>
  )
}

export default EventCtaButton
