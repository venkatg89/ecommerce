import React from 'react'
import styled from 'styled-components/native'

const Container = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: flex-end;
  border-color: ${({ theme }) => theme.palette.grey5};
  border-bottom-width: 2;
  padding-top: ${({ theme }) => theme.spacing(1)};
  padding-bottom: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const Content = styled.View`
  flex-direction: column;
  flex: 1;
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
`

interface DetailProps {
  hasChildren?: boolean
}

const Details = styled.Text<DetailProps>`
  margin-top: 10;
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme, hasChildren }) =>
    hasChildren ? `margin-bottom: ${theme.spacing(1)};` : ''}
`

const PasswordDetails = styled.Text<DetailProps>`
  ${({ theme }) => theme.typography.body2};
  font-weight: 900;
  color: ${({ theme }) => theme.palette.grey2};
`

const ChildrenWrapper = styled.View``

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
`

interface Props {
  children?: React.ReactNode
  title: string
  details?: string
  icon?: React.ReactNode
  isPasswordField?: boolean
  onPress?: () => void
}

export default ({
  children,
  title,
  details,
  icon,
  isPasswordField,
  onPress,
}: Props) => (
  <Container accessible={!!onPress} disabled={!onPress} onPress={onPress}>
    <Content>
      <TitleContainer>
        <Title>{title}</Title>
        {icon}
      </TitleContainer>
      {details &&
        (isPasswordField ? (
          <PasswordDetails hasChildren={!!children}>{details}</PasswordDetails>
        ) : (
          <Details hasChildren={!!children}>{details}</Details>
        ))}
      {children && <ChildrenWrapper>{children}</ChildrenWrapper>}
    </Content>
  </Container>
)
