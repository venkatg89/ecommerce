import React from 'react'
import styled from 'styled-components/native'
import { membership } from 'assets/images'


interface OwnProps {
  joined: boolean
}

const WrappingContainer = styled.View`
  width: 100%;
`

// TODO: Change to Image and delete background color after icon is added
const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  tint-color: ${({ theme }) => theme.palette.primaryGreen};
`


const TextContainer = styled.View`
  flex: 1; 
`

interface ContainerProps {
  border?: boolean
  last?: boolean
}

const Container = styled.View<ContainerProps>`
  margin: ${({ border, theme }) => (border ? -theme.spacing(1) : 0)}px;
  padding: ${({ border, theme }) => (border ? theme.spacing(1) : 0)}px;
  border: ${({ theme, border }) => (border ? `1px solid ${theme.palette.linkGreen} ` : 'none')};
  margin-bottom: ${({ theme, last }) => (last ? 0 : theme.spacing(3))};
  flex-direction: row;
  flex: 1;
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
`

const Desc = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

interface BenefitType {
  icon: any
  title: string
  desc: string
  border?: boolean
}


const whyJoin: BenefitType[] = [
  { icon: membership.bookDeal,
    title: '40% off Hardcover Bestsellers',
    desc: 'Special in-store pricing lets you pore over today’s bestsellers & build your home library—for less!' },
  { icon: membership.save,
    title: '10% off in Store and Online',
    desc: 'Everything you love at B&N will ring up at 10% off the lowest price, including magazines and Café items.' },
  { icon: membership.coupons,
    title: 'Sign-Up Bonus',
    desc: 'Your Welcome email will include $60 in savings. Plus, throughout the year, you’ll receive Member-only coupons valid online and in stores.',
  },
  { icon: membership.shipping,
    title: 'Free Shipping',
    desc: 'Free shipping on all orders—no minimum purchase required.' },
  { icon: membership.access, title: 'Early Access', desc: 'Shop at special sale prices and sign up for events—before everyone else!' },
  { icon: membership.gift, title: 'Special Birthday Gift', desc: 'Enjoy your special day with a free Tall Drink and 20% off one purchase during the month of your birthday.' },
  { icon: membership.nookDevice, title: 'Exclusive NOOK Offer', desc: 'Enjoy 10% off the regular price of all NOOK devices and accessories online and in stores.', border: true },
]

const memberBenefits: BenefitType[] = [
  { icon: membership.bookDeal,
    title: '40% off Hardcover Bestsellers',
    desc: 'Special in-store pricing lets you pore over today’s bestsellers & build your home library—for less!' },
  { icon: membership.save,
    title: '10% off in Store and Online',
    desc: 'Everything you love at B&N will ring up at 10% off the lowest price, including magazines and Café items.' },
  { icon: membership.coupons,
    title: 'Exclusive In-Store & Online Offers',
    desc: 'You’ll receive additional Member-only coupons throughout the year, valid online and in stores.',
  },
  { icon: membership.shipping, title: 'Free Shipping', desc: 'Free shipping on all orders—no minimum purchase required.' },
  { icon: membership.access, title: 'Early Access', desc: 'Shop at special sale prices and sign up for events—before everyone else!' },
  { icon: membership.gift, title: 'Special Birthday Gift', desc: 'Enjoy your special day with a free Tall Drink and 20% off one purchase during the month of your birthday.' },
  { icon: membership.nookDevice, title: 'Exclusive NOOK Offer', desc: 'Enjoy 10% off the regular price of all NOOK devices and accessories online and in stores.', border: true },
]

const BenefitList = ({ joined }: OwnProps) => {
  const benefits = joined ? memberBenefits : whyJoin
  return (
    <WrappingContainer>
      {(joined ? memberBenefits : whyJoin).map((benefit, index) => (
        <Container
          key={ benefit.title }
          border={ benefit.border }
          last={ benefits.length - 1 === index }
        >
          <Icon source={ benefit.icon } />
          <TextContainer>
            <Title>{benefit.title}</Title>
            <Desc>{benefit.desc}</Desc>
          </TextContainer>
        </Container>
      ))}
    </WrappingContainer>
  )
}

export default BenefitList
