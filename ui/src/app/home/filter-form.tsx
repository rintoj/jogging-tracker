import * as React from 'react'

import { Accordion, TextInput } from '../../component/index'
import { data, inject } from 'statex/react'

import { AppState } from '../../state'
import { Filters } from '../../state/filters'
import { SetFiltersAction } from '../../action/index'

class Props {
  @data((state: AppState) => state.filters)
  filters?: Filters
}

interface State {
  filters?: Filters
  errors?: {
    toDate?: string
  }
}

@inject(Props)
export class FilterForm extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      errors: {},
      filters: {}
    }
  }

  componentWillReceiveProps(props: Props) {
    this.props = props
    this.setState({
      filters: props.filters || {}
    })
  }

  render() {
    const badge = this.state.filters == undefined ?
      undefined : this.state.filters.fromDate != undefined || this.state.filters.toDate != undefined ?
        'Clear filter' : undefined

    return <div>
      <Accordion title="filters" icon="sliders" badge={badge}
        onBadgeClick={event => this.clearFilters()}>
        <form className="flex">
          <TextInput className="ml3" type="date" label="From Date"
            value={this.state.filters && this.state.filters.fromDate || ''}
            onChange={event => this.setFilter(event, 'fromDate')}
          ></TextInput>
          <TextInput className="ml3" type="date" label="To Date"
            error={this.state.errors.toDate}
            value={this.state.filters && this.state.filters.toDate || ''}
            onChange={event => this.setFilter(event, 'toDate')}
          ></TextInput>
        </form>
      </Accordion>
    </div >
  }

  validate(filters) {
    this.setState({
      errors: {
        toDate: filters.fromDate > filters.toDate ? 'To date must be greater than from date' : undefined
      }
    })

    return Object.keys(this.state.errors).filter(i => this.state.errors[i] != undefined).length === 0
  }

  setFilter(event, type) {
    const filters = Object.assign({}, this.state.filters)
    filters[type] = event.target.value === '' ? undefined : event.target.value
    this.setState({ filters })
    new SetFiltersAction(filters).dispatch()
  }

  clearFilters() {
    const filters = { fromDate: undefined, toDate: undefined }
    this.setState({ filters })
    new SetFiltersAction(filters).dispatch()
  }

}