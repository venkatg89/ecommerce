import { reportContents } from 'src/endpoints/milq/communities/flagContents'

import { State } from 'src/redux/reducers'


export const reportContentAction: (entitiyType, entitiyId) => ThunkedAction<State>
 = (entityType, entityId) => async (dispatch, getState) => {
   try {
     await reportContents({ entityType, entityId })
   } catch { /** */ }
 }
