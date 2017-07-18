import './loader.css'

import * as React from 'react'

interface Props {
  className?: string
}
interface State { }

export class Loader extends React.Component<Props, State> {

  render() {
    return <div className={`${this.props.className} spinner`}>
      <div className="bounce1 ternary"></div>
      <div className="bounce2 accent"></div>
      <div className="bounce3 ternary"></div>
      <div className="bounce4 accent"></div>
    </div>
  }
}