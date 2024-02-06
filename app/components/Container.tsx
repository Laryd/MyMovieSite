import React from 'react'
import { CustomComponentProps } from '../interfaces'
import { mergeClassName } from '../utils'

const Container = (props: CustomComponentProps) => {
  return (
    <div className={mergeClassName("px-6 py-3 max-w-full mx-auto", )}>{props.children}</div>
  )
}

export default Container