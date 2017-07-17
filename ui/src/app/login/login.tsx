import * as React from 'react'

import { Link } from 'react-router-dom'

interface Props { }
interface State { }

export class LoginPage extends React.Component<Props, State> {

  render() {
    return <div>
      Login Page
      <Link to="/home">Home</Link>
    </div>
  }
}