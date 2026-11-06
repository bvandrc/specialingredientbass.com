import '@fontsource/barlow'
import '@fontsource/outfit'
import '@fontsource/roboto-condensed'
import '@fontsource/roboto-condensed/700.css'
import './styles/index.css'

import { Header } from './components/Header'
import { MainGridBody } from './components/MainGridBody'

export const App = () => (
  <>
    <Header />
    <MainGridBody />
  </>
)
