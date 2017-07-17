import * as React from 'react'

import { Button, IconText } from '../../component'

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
    return <div className="primary flex flex-column vh-100" style={{ width: (this.state.open ? '250' : '0') + 'px' }}>
      <div className="flex items-center justify-start bb divider-l-br w-100 mv3 ph3">
        <div className="white-text f4 nowrap ttu pa2">Jog Tracker</div>
      </div>
      <div className="ph3 pv1 o-60 flex-auto">
        <IconText icon="home" className="pa1 pointer divider-l-bg--hover br2">Home</IconText>
        <IconText icon="home" className="pa1 pointer divider-l-bg--hover">Home</IconText>
      </div>
      <div className="flex items-center justify-around bt divider-l-br w-100 secondary pa3">
        <div>
          <div className="white br-100 w2 h2 flex items-center justify-center">R</div>
        </div>
        <div className="white-text nowrap ttu pa2 f6 flex-auto truncate">Rinto Jose</div>
        <Button>Sign Out</Button>
      </div>
    </div>
  }
}