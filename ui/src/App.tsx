import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity="error">This is an error alert — check it out!</Alert>
          <Alert severity="success">This is a success alert — check it out!</Alert>
        </Stack>
        <Stack mt={2} sx={{ width: '100%' }} direction="row" spacing={1}>
          <Button variant="contained"><AddIcon /> Add Button</Button>
          <Button color="error" variant="outlined"><DeleteIcon /> Delete Button</Button>
        </Stack>
    </div>
    </>
  )
}

export default App
