import { useState } from 'react'
import { Navbar , Welcome , Dock } from '#components'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />
    </main>
  )
}

export default App
