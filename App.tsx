import React from 'react'
import RootNavigation from './src/navigator/RootNavigation'
import { NavigationContainer } from '@react-navigation/native'

const App = () => {
  return (
    <NavigationContainer>
      <RootNavigation/>
    </NavigationContainer>
  )
}

export default App
