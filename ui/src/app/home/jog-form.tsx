import * as React from 'react'

import { Button, TextInput } from '../../component'

interface Props { }
interface State { }

export class JogForm extends React.Component<Props, State> {

  render() {
    return <div className="flex justify-center w-100 mv4">
      <form className="flex justify-center items-end w-100">
        <TextInput type="date"
          label="Date"
          min="0" max="100" step="0.01"></TextInput>
        <TextInput type="number"
          label="Distance"
          placeholder="KM"
          className="ml4"
          min="0" max="100" step="0.01"></TextInput>
        <TextInput type="number"
          label="Time"
          placeholder="Minutes"
          className="ml4"
          min="0" max="100" step="0.01"></TextInput>
        <div className="ml4">
          <Button>Add Log</Button>
        </div>
      </form>
    </div>
  }
}