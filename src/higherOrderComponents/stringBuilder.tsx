import hoistNonReactStatic from 'hoist-non-react-statics'
import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { getLanguageSelector } from 'src/redux/selectors/userSelector'

import {
  inject, interpolate, pluralize, ReplacementCollection,
} from 'src/helpers/strings'
import { getRawString } from 'src/strings'

export interface StringBuilderProps {
  getString(stringKey: string, collection?: ReplacementCollection): any;
}

interface StateProps {
  language: string;
}

const selector = createStructuredSelector({
  language: getLanguageSelector,
})

type CombinedProps<P> = P & StringBuilderProps

export default function stringBuilder<P>(WrapperComponent: React.ComponentType<CombinedProps<P>>) {
  class StringBuilderHoc extends React.Component<any> {
    getString = (stringKey: string, collection?: ReplacementCollection) => {
      const { language } = this.props
      const replacements = { ...(collection || {}) }

      return (
        inject( // inject non string (ie: custom image emoji or css wrapped text)
          pluralize( // pluralize strings
            interpolate( // replace string placeholders
              getRawString(language, stringKey), replacements,
            ), replacements,
          ), replacements,
        )
      )
    }

    render() {
      const { language, ...otherProps } = this.props // eslint-disable-line
      return (
        <WrapperComponent
          getString={ this.getString }
          { ...otherProps as P }
        />
      )
    }
  }

  hoistNonReactStatic(StringBuilderHoc, WrapperComponent)
  return connect<StateProps, {}, CombinedProps<P>>(selector)(StringBuilderHoc)
}
