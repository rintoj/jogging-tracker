import './loader.css'

import * as React from 'react'

interface Props {
  primaryColor?: string
  secondaryColor?: string
  className?: string
}
interface State { }

export class Loader extends React.Component<Props, State> {

  render() {
    return <div className={`${this.props.className} spinner`}>
      <div className={`bounce1 ${this.props.primaryColor || 'ternary'}`}></div>
      <div className={`bounce2 ${this.props.secondaryColor || 'accent'}`}></div>
      <div className={`bounce3 ${this.props.primaryColor || 'ternary'}`}></div>
      <div className={`bounce4 ${this.props.secondaryColor || 'accent'}`}></div>
    </div>
  }
}