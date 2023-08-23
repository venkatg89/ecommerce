import { Reducer } from 'redux'
import { TooltipsModel, ToolTipsName } from 'src/models/TooltipsModel'
import { SET_TOOLTIPS_STATUS } from 'src/redux/actions/tooltips/tooltipsStatusAction'

export type TooltipsState = TooltipsModel

const DEFAULT: TooltipsState = {} as TooltipsModel

const tooltipsStatus: Reducer<TooltipsModel> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_TOOLTIPS_STATUS: {
      const { field, value } = action.payload
      return {
        ...state,
        [field as ToolTipsName]: value,
      }
    }

    default:
      return state
  }
}

export default tooltipsStatus
