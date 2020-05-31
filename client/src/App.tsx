import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import MainPanel from './MainPanel'
import {Menu} from "semantic-ui-react";

function App() {
  return (
    <div className="App">
        <Menu className='mainMenu' inverted>
            <Menu.Item name='Video Editor' />
            <Menu.Item name='home' />
        </Menu>
        <MainPanel />
    </div>
  )
}

export default App
