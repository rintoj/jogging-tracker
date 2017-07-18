import * as React from 'react'

import { Loader } from '../../component/index'

interface Props {
  history?: string[]
}
interface State { }

export class AuthorizePage extends React.Component<Props, State> {

  private timeout

  componentDidMount() {
    this.timeout = setTimeout(() => {
      if (location.pathname === '/authorize') {
        this.props.history.push('/signin')
      }
    }, 2000)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    return <div className="flex items-center justify-center vh-100">
      <Loader></Loader>
    </div>
  }
}