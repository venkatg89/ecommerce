import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import TextField from 'src/controls/form/TextField'
import styled from 'styled-components/native'
import { createStructuredSelector } from 'reselect'
import {
  getAllCountriesAction,
  getStatesAction,
  setEnteredShippingAddressAction,
  verifyAddressAction,
} from 'src/redux/actions/shop/cartAction'
import Button from 'src/controls/Button'
import _Select from 'src/controls/form/Select'
import {
  ShippingAddress,
  VerifyAddressRequest,
} from 'src/models/ShopModel/CartModel'
import {
  clearFormFieldErrorMessagesAction,
  setformErrorMessagesAction,
} from 'src/redux/actions/form/errorsAction'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import { ErrorMessage } from 'src/models/FormModel'
import { icons } from 'assets/images'
import {
  allCountrySelector,
  allStateSelector,
} from 'src/redux/selectors/widgetSelector'

const Container = styled.View`
  background-color: #ffffff;
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const DefaultText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(1)};
`

const RowContainer = styled.TouchableOpacity`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing(2.5)};
`

const TextFieldContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  margin-horizontal: -${({ theme }) => theme.spacing(2)};
`

const StateZipContainer = styled.View`
  margin-right: -${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const StateContainer = styled.View`
  margin-left: -${({ theme }) => theme.spacing(2)};
  width: 50%;
  top: -4;
  background-color: white;
`

const ContinueButton = styled(Button)`
  padding-vertical: ${({ theme }) => theme.spacing(1.5)};
`

const Select = styled(_Select)`
  margin-top: ${({ theme }) => theme.spacing(0.5)};
  height: 55.5;
`

const CheckboxCircleIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const CheckBoxContainer = styled.TouchableOpacity`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const FORM_ID = 'AddShippingAddressForm'
const FIRST_NAME_ID = 'firstName'
const LAST_NAME_ID = 'lastName'
const ADDRESS1_ID = 'address1'
const CITY_ID = 'city'
const PHONE_NUMBER_ID = 'phoneNumber'
const STATE_ID = 'state'
const COUNTRY_ID = 'country'
const POSTAL_CODE_ID = 'postalCode'

interface OwnProps {
  edit?: boolean
  addressToEdit?: ShippingAddress
  isGuest: boolean
  reload: () => void
  handleAddAddressContinueBtn: () => void
  returnAddress?: boolean
  onAccount?: boolean
}

interface StateProps {
  countries?: Map<string, string>
  states?: Map<string, string>
}

interface DispatchProps {
  getAllCountries: () => void
  getStates: (countryCode: string) => void
  setEnteredShippingAddress: (shippingAddress: ShippingAddress) => void
  verifyAddress: (verifyAddressRequest: VerifyAddressRequest) => void
  setError: (error: ErrorMessage) => void
  clearError: (fieldId: string) => void
}

const selector = createStructuredSelector<any, StateProps>({
  countries: allCountrySelector,
  states: allStateSelector,
})

const dispatcher = (dispatch) => ({
  getAllCountries: () => dispatch(getAllCountriesAction()),
  getStates: (countryCode: string) => dispatch(getStatesAction(countryCode)),
  setEnteredShippingAddress: (shippingAddress: ShippingAddress) =>
    dispatch(setEnteredShippingAddressAction(shippingAddress)),
  verifyAddress: (verifyAddressRequest: VerifyAddressRequest) =>
    dispatch(verifyAddressAction(verifyAddressRequest)),
  setError: (error) => dispatch(setformErrorMessagesAction(FORM_ID, [error])),
  clearError: (fieldId) =>
    dispatch(
      clearFormFieldErrorMessagesAction({
        formId: FORM_ID,
        formFieldId: fieldId,
      }),
    ),
})

interface SelectData {
  label: string
  value: string
}

type Props = OwnProps & StateProps & DispatchProps

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

const buildCountryOptions = (data) => {
  if (data) {
    const result = Object.keys(data).map((code) => {
      return {
        label: data[code],
        value: code,
      }
    })
    result.sort((e1: SelectData, e2: SelectData) => {
      if (e1.label < e2.label) {
        return -1
      }
      if (e2.label < e1.label) {
        return 1
      }
      return 0
    })
    return result
  } else {
    return []
  }
}

const buildStateOptions = (data) => {
  if (data) {
    const result = Object.keys(data).map((code) => {
      return {
        label: code,
        value: code,
      }
    })
    result.sort((e1: SelectData, e2: SelectData) => {
      if (e1.label < e2.label) {
        return -1
      }
      if (e2.label < e1.label) {
        return 1
      }
      return 0
    })
    return result
  } else {
    return []
  }
}

const AddShippingAddressForm = ({
  edit,
  addressToEdit,
  reload,
  countries,
  states,
  isGuest,
  getAllCountries,
  getStates,
  setEnteredShippingAddress,
  verifyAddress,
  handleAddAddressContinueBtn,
  setError,
  clearError,
  returnAddress = false,
  onAccount,
}: Props) => {
  const [country, setCountry] = useState(edit ? addressToEdit?.country : 'US')
  const [state, setState] = useState(edit ? addressToEdit?.state : '')
  const [firstName, setFirstName] = useState(
    edit ? addressToEdit?.firstName : '',
  )
  const [lastName, setLastName] = useState(edit ? addressToEdit?.lastName : '')
  const [city, setCity] = useState(edit ? addressToEdit?.city : '')
  const [address1, setAddress1] = useState(edit ? addressToEdit?.address1 : '')
  const [address2, setAddress2] = useState(edit ? addressToEdit?.address2 : '')
  const [phoneNumber, setPhoneNumber] = useState(
    edit ? addressToEdit?.phoneNumber : '',
  )
  const [postalCode, setPostalCode] = useState(
    edit ? addressToEdit?.postalCode : '',
  )
  const [companyName, setCompanyName] = useState(
    edit ? addressToEdit?.companyName : '',
  )

  const [isEdited, setIsEdited] = useState(false)
  const [excludeUPS, setexcludeUPS] = useState(
    edit ? addressToEdit?.excludeUPS : false,
  )

  const [isDefaultAddress, setIsDefaultAddress] = useState(
    edit ? addressToEdit?.defaultAddress : false,
  )

  const countryOptions: SelectData[] = buildCountryOptions(countries)
  const stateOptions: SelectData[] = buildStateOptions(states)

  useEffect(() => {
    getAllCountries()
    getStates('US')
  }, [])

  const validateField = (field, formFieldId) => {
    if (!field) {
      setError({
        formFieldId: formFieldId,
        error: 'Field cannot be empty',
      })
      return false
    } else {
      clearError(formFieldId)
      return true
    }
  }

  const validatePhoneNumber = () => {
    if (!phoneNumber) {
      setError({
        formFieldId: PHONE_NUMBER_ID,
        error: 'Field cannot be empty',
      })
      return false
    } else if (!/^[0-9]{10}$/.test(phoneNumber)) {
      setError({
        formFieldId: PHONE_NUMBER_ID,
        error: 'Phone number should be of 10 digits',
      })
      return false
    } else {
      clearError(phoneNumber)
      return true
    }
  }

  useEffect(() => {
    if (!isEdited) {
      return
    }
    validateField(country, COUNTRY_ID)
  }, [country])

  useEffect(() => {
    if (!isEdited) {
      return
    }
    validateField(state, STATE_ID)
  }, [state])

  useEffect(() => {
    if (!isEdited) {
      return
    }
    validateField(firstName, FIRST_NAME_ID)
  }, [firstName])

  useEffect(() => {
    if (!isEdited) {
      return
    }
    validateField(lastName, LAST_NAME_ID)
  }, [lastName])

  useEffect(() => {
    if (!isEdited) {
      return
    }
    validateField(address1, ADDRESS1_ID)
  }, [address1])

  useEffect(() => {
    if (!isEdited) {
      return
    }
    validateField(city, CITY_ID)
  }, [city])

  useEffect(() => {
    if (!isEdited) {
      return
    }
    validateField(postalCode, POSTAL_CODE_ID)
  }, [postalCode])

  const changeCountryHandler = (countryCode) => {
    setIsEdited(true)
    setCountry(countryCode)
    getStates(countryCode)
  }

  const changeStateHandler = (stateCode) => {
    setIsEdited(true)
    setState(stateCode)
  }

  const continueBtnHandler = () => {
    validatePhoneNumber()
    let isFormError = false
    const firstNameValid = validateField(firstName, FIRST_NAME_ID)
    const lastNameValid = validateField(lastName, LAST_NAME_ID)
    const cityValid = validateField(city, CITY_ID)
    const address1Valid = validateField(address1, ADDRESS1_ID)
    const phoneNumberValid = validatePhoneNumber()
    isFormError = !(
      firstNameValid &&
      lastNameValid &&
      cityValid &&
      address1Valid &&
      phoneNumberValid
    )
    if (isFormError) {
      return
    }
    const shippingAddress: ShippingAddress = {
      country,
      firstName,
      lastName,
      address1,
      address2,
      postalCode,
      city,
      state,
      phoneNumber,
      companyName,
      addressNickname: addressToEdit?.addressNickname,
      excludeUPS,
      makeDefault: isDefaultAddress,
      profileId: addressToEdit?.profileId,
    }
    setEnteredShippingAddress(shippingAddress)
    verifyAddress({
      country,
      address1,
      address2,
      postal: postalCode,
      city,
      state,
    })
    handleAddAddressContinueBtn()
  }

  const lastNameRef = useRef<any>()
  const addressOneRef = useRef<any>()
  const addressTwoRef = useRef<any>()
  const cityRef = useRef<any>()
  const zipCodeRef = useRef<any>()
  const phoneRef = useRef<any>()
  const companyRef = useRef<any>()

  return (
    <Container>
      <ScrollContainer withAnchor>
        <TextFieldContainer>
          <Select
            overlayStyle={{ width: '80%' }}
            label={'Country'}
            data={countryOptions}
            dropdownMargins={{ min: 17, max: 17 }}
            dropdownPosition={-5.2}
            onChange={changeCountryHandler}
            useNativeDriver={false}
            value={country}
            formFieldId={COUNTRY_ID}
            formId={FORM_ID}
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField
            value={firstName}
            blurOnSubmit={false}
            onSubmitEditing={() => lastNameRef.current.focus()}
            onChange={(text) => {
              setFirstName(text)
              setIsEdited(true)
            }}
            label="First Name *"
            autoCorrect={false}
            returnKeyType="next"
            formFieldId={FIRST_NAME_ID}
            formId={FORM_ID}
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField
            inputRef={lastNameRef}
            blurOnSubmit={false}
            onSubmitEditing={() => addressOneRef.current.focus()}
            label="Last Name *"
            value={lastName}
            onChange={(text) => {
              setLastName(text)
              setIsEdited(true)
            }}
            autoCorrect={false}
            returnKeyType="next"
            formFieldId={LAST_NAME_ID}
            formId={FORM_ID}
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField
            inputRef={addressOneRef}
            blurOnSubmit={false}
            onSubmitEditing={() => addressTwoRef.current.focus()}
            label="Address Line 1 *"
            value={address1}
            onChange={(text) => {
              setAddress1(text)
              setIsEdited(true)
            }}
            autoCorrect={false}
            returnKeyType="next"
            formFieldId={ADDRESS1_ID}
            formId={FORM_ID}
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField
            inputRef={addressTwoRef}
            blurOnSubmit={false}
            onSubmitEditing={() => cityRef.current.focus()}
            label="Address Line 2 *"
            value={address2}
            onChange={(text) => setAddress2(text)}
            autoCorrect={false}
            returnKeyType="next"
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField
            inputRef={cityRef}
            blurOnSubmit={false}
            onSubmitEditing={() => zipCodeRef.current.focus()}
            label="City *"
            value={city}
            onChange={(text) => {
              setCity(text)
              setIsEdited(true)
            }}
            returnKeyType="next"
            autoCorrect={false}
            formFieldId={CITY_ID}
            formId={FORM_ID}
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
        <StateZipContainer>
          <StateContainer>
            <Select
              overlayStyle={{ width: '80%' }}
              label={'State *'}
              data={stateOptions}
              dropdownPosition={-5.2}
              dropdownMargins={{ min: 17, max: 17 }}
              onChange={changeStateHandler}
              useNativeDriver={false}
              value={state}
              formFieldId={STATE_ID}
              formId={FORM_ID}
            />
          </StateContainer>
          <TextField
            inputRef={zipCodeRef}
            blurOnSubmit={false}
            onSubmitEditing={() => phoneRef.current.focus()}
            label="Zip Code*"
            value={postalCode}
            onChange={(text) => {
              setPostalCode(text)
              setIsEdited(true)
            }}
            autoCorrect={false}
            formFieldId={POSTAL_CODE_ID}
            formId={FORM_ID}
            returnKeyType="next"
            style={{ backgroundColor: 'white', width: '50%' }}
          />
        </StateZipContainer>
        <TextFieldContainer>
          <TextField
            blurOnSubmit={false}
            onSubmitEditing={() => companyRef.current.focus()}
            inputRef={phoneRef}
            label="Phone Number *"
            value={phoneNumber}
            onChange={(text) => {
              setPhoneNumber(text)
            }}
            autoCorrect={false}
            returnKeyType="next"
            keyboardType="phone-pad"
            formFieldId={PHONE_NUMBER_ID}
            formId={FORM_ID}
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField
            inputRef={companyRef}
            label="Company Name"
            value={companyName}
            onChange={(text) => setCompanyName(text)}
            autoCorrect={false}
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
        {onAccount && (
          <RowContainer>
            <CheckBoxContainer onPress={() => setexcludeUPS(!excludeUPS)}>
              <CheckboxCircleIcon
                source={
                  excludeUPS ? icons.checkboxChecked : icons.checkboxUnchecked
                }
              />
            </CheckBoxContainer>
            <DefaultText>
              Address can’t be serviced by UPS (P.O. Box, APO or FPO)
            </DefaultText>
          </RowContainer>
        )}
        {onAccount && (
          <RowContainer
            onPress={() => {
              setIsDefaultAddress(!isDefaultAddress)
            }}
          >
            <CheckboxCircleIcon
              source={
                isDefaultAddress
                  ? icons.checkboxChecked
                  : icons.checkboxUnchecked
              }
            />
            <DefaultText>Set as default shipping address</DefaultText>
          </RowContainer>
        )}
      </ScrollContainer>
      <ContinueButton
        onPress={continueBtnHandler}
        variant="contained"
        style={{ width: '90%' }}
        isAnchor={!isGuest}
        center
      >
        Continue
      </ContinueButton>
    </Container>
  )
}

export default connector(AddShippingAddressForm)
