import * as React from 'react'

import { data, inject } from 'statex/react'

import { AppState } from '../../state'

class Props {
  @data((state: AppState) => state)
  state?: AppState
}

interface State { }

@inject(Props)
export class Banner extends React.Component<Props, State> {

  render() {
    return <div className="flex items-center secondary justify-center pv3 ph4">
      <div className="tc ttu o-60 mr3">User:</div>
      <select className="input-reset transparent bn mt2 accent br0 pv2 ph3 w-100">
        <option value="">Rinto Jose (me)</option>
        <option value="">Rittu Jose</option>
        <option value="">Bily Mary Joshua</option>
        <option value="">Vansy Krishna Reddy Bandaru</option>
      </select>
    </div>
  }
}