import '../store'

import * as React from 'react'

import { TodoFooter, TodoHeader, TodoList } from './'

import { config } from './config'

export class App extends React.Component<{}, {}> {

  render() {
    console.log(config)
    return <div id="todo-app">
      <TodoHeader />
      <TodoList />
      <TodoFooter />
    </div>
  }
}
