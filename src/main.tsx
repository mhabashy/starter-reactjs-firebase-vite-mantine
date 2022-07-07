import ReactDOM from 'react-dom/client'
import { FirebaseAppProvider } from 'reactfire'
import App from './App'
import { firebaseConfig } from './config'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig} >
    <App />
  </FirebaseAppProvider>
)
