import * as React from 'react'

import { IconText, Profile } from '../../component'

interface Props { }
interface State {
  open?: boolean
}

export class MenuComponent extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      open: true
    }
  }

  render() {
    return <div className="primary flex flex-column vh-100" style={{ width: (this.state.open ? '280' : '0') + 'px' }}>
      <div className="flex flex-column justify-start bb divider-l-br w-100 ph3 secondary">
        <div className="white-text f4 nowrap ttu ph2 pv3">Jog Tracker</div>
        <Profile name="Rinto Jose" role="Administrator" showButton={true}></Profile>
      </div>
      <div className="ph3 pv1 o-60 flex-auto">
        <IconText icon="home" className="pa1 pointer divider-l-bg--hover br2">Home</IconText>
        <IconText icon="home" className="pa1 pointer divider-l-bg--hover">Home</IconText>
      </div>
    </div>
  }
}