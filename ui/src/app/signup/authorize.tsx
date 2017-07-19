import * as React from 'react'

import { Loader } from '../../component/index'

interface Props {
  history?: string[]
}
interface State { }

export class AuthorizePage extends React.Component<Props, State> {
  render() {
    return <div className="flex flex-column items-center justify-center vh-100">
      <Loader></Loader>
    </div>
  }
}