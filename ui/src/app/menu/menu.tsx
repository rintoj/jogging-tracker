import * as React from 'react'

import { Accordion, IconText, Profile } from '../../component'

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
        <div className="white-text f4 nowrap ttu ph2 pv3 mv1">Jog Tracker</div>
        <Profile name="Rinto Jose" role="Administrator" showButton={true}></Profile>
      </div>
      <div className="ph3 pv1 flex-auto">
        <Accordion title="Navigation" icon="navicon" className="pt3" open={true}>
          <IconText icon="home" className="pa2 pointer accent--hover br1">Home</IconText>
          <IconText icon="home" className="pa2 pointer accent--hover br1">Home</IconText>
        </Accordion>
        <Accordion title="Manage Users" icon="user-circle" className="pt3" open={true}>
          <IconText icon="home" className="pa2 pointer accent--hover br1">Home</IconText>
          <IconText icon="home" className="pa2 pointer accent--hover br1">Home</IconText>
        </Accordion>
        <IconText icon="cogs" className="ttu pt3 pointer">Settings</IconText>
      </div>
    </div>
  }
}