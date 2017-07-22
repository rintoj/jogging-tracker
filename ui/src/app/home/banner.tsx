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
    return <div className="flex w-100 h3">
    </div>
  }
}