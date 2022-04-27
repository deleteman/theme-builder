import { useEffect, useState } from 'react';
import { setToLS, getFromLS } from '../utils/storage';
import _ from 'lodash';

export const useTheme = () => {
    const themes = getFromLS('all-themes');
    let firstTheme = Object.keys(themes.data)[0]
    const [theme, setTheme] = useState(themes.data[firstTheme]);
    const [themeLoaded, setThemeLoaded] = useState(false);

    const setMode = mode => {
        console.log("set mode called with ", mode)
        setToLS('theme', mode)
        setTheme(mode);
    };

    const getFonts = () => {
        const allFonts = _.values(_.mapValues(themes.data, 'font'));
        return allFonts;
    }

    useEffect(() => {
        const localTheme = getFromLS('theme');
        localTheme ? setTheme(localTheme) : setTheme(themes.data[firstTheme]);
        setThemeLoaded(true);
    }, []);
    
    return { theme, themeLoaded, setMode, getFonts };
};
