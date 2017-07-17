import * as React from 'react'

import { Button } from '../../component/button'
import { Link } from 'react-router-dom'
import { TextInput } from '../../component/text-input'

// import { Link } from 'react-router-dom'

interface Props { }
interface State { }

export class LoginPage extends React.Component<Props, State> {

  render() {
    return <div className="primary flex flex-column flex-auto w-100 vh-100 items-center justify-center">
      <div className="card pa4 ma4 shadow-3 br1" style={{ width: '350px' }}>
        <div className="flex flex-column items-center justify-center">
          <img src={require('../../assets/img/logo.png')} alt="" className="w3 h2" />
          <div className="f3 tc mb4 ttu title-text b">Jog Logger</div>
        </div>
        <TextInput type="text" id="userId" label="User ID" placeholder="Enter your email ID"></TextInput>
        <TextInput type="password" id="password" label="Password" placeholder="Enter your password"></TextInput>
        <div className="flex mt3">
          <Button className="mr3 flex-auto">Login</Button>
          <Link to="/register" className="flex-auto" >
            <Button className="w-100" color="secondary">Register</Button>
          </Link>
        </div>
      </div>
    </div>
  }
}