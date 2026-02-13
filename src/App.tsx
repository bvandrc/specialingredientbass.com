import '@fontsource/barlow'
import '@fontsource/outfit'
import '@fontsource/roboto-condensed'
import '@fortawesome/fontawesome-free/css/all.css'
import './styles/index.css'

import './api/soundcloudWidget'

import { Header } from './components/Header'
import { MainGridBody } from './components/MainGridBody'

export const App = () => {
  return (
    <>
      {<Header />}
      {<MainGridBody />}
    </>
  )
}
