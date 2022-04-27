import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from "styled-components";
import WebFont from 'webfontloader';
import { GlobalStyles } from './theme/GlobalStyles';
import {useTheme} from './theme/useTheme';

import ThemeSelector from './ThemeSelector';

import Dialog from './Dialog';
import CreateThemeContent from './CreateThemeContent';

const Container = styled.div`
  margin: 5px auto 5px auto;
`;


function App() {
  const {theme, themeLoaded, getFonts} = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [showDialog, setShowDialog] = useState(false);
  const [newTheme, setNewTheme] = useState();
  
 useEffect(() => {
    WebFont.load({
      google: {
        families: getFonts()
      }
    });
  });

  useEffect(() => {
    setSelectedTheme(theme);
  }, [themeLoaded]);

  

  return (
    <>
    {
      themeLoaded && <ThemeProvider theme={ selectedTheme }>
        <GlobalStyles/>
        <Container style={{fontFamily: selectedTheme.font}}>
          <h1>Theming System</h1>
          <p>
            Hey, There! Use the power of Genetic Algorithms. 
            The theming system helps you in building a theme of your choice and apply it to test live. 
            Why wait? Just give it a try.
          </p>
          <ThemeSelector setter={ setSelectedTheme } currentTheme={selectedTheme}/>
        </Container>
      </ThemeProvider>
    }
    </>
  );
}

export default App;
