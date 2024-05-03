import './App.css';
import { Container } from '@mui/material';
import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { orange } from '@mui/material/colors'
import BarraNavegacao from './components/BarraNavegacao';
import Footer from './components/Footer';
import { GlobalStyles } from '@mui/styled-engine-sc';
import { BrowserRouter } from 'react-router-dom'
import Rotas from './components/Rotas';

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      secondary: orange
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: { backgroundColor: darkMode ? "#222222" : "#FFFFFF" },
        }}
      />
      <BrowserRouter>
        <BarraNavegacao check={darkMode} change={() => setDarkMode(!darkMode)} />
        <Container maxWidth="xl">
          <Rotas />
        </Container>
      </BrowserRouter>
      <Footer />
    </ThemeProvider>
  )
}

export default App;