import atgApiRequest from 'src/apis/atgGateway'

const NOOK_DEVICE_SPEC = '/product-details/getNookDeviceSpecifications'

export const fetchNookDeviceSpecifications = (ean?: string) =>
  atgApiRequest({
    method: 'GET',
    endpoint: NOOK_DEVICE_SPEC,
    params: { eanId: ean },
  })
