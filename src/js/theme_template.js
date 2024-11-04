(function () {
  //====================================
  // Theme replacement CSS (Glow styles)
  //====================================
  console.log('Theming start!');
  const tokenReplacements = {
        /* Red */
        'fe4450': "color: #ff6666; text-shadow: 0 0 6px #fc1f2c[NEON_BRIGHTNESS], 0 0 14px #fc1f2c[NEON_BRIGHTNESS]; backface-visibility: hidden;",
        /* Neon pink */
        'ff7edb': "color: #f5cfdd; text-shadow: 0 0 10px #ff073e[NEON_BRIGHTNESS], 0 0 3px #ffffff[NEON_BRIGHTNESS]; backface-visibility: hidden;",
        /* Yellow */
        'fede5d': "color: #ffffee; text-shadow: 0 0 6px #ffffff[NEON_BRIGHTNESS], 0 0 4px #ffff99[NEON_BRIGHTNESS]; backface-visibility: hidden;",
        /* Green */
        '72f1b8': "color: #ccff00; text-shadow: 0 0 8px #100c0f, 0 0 10px #25ff99[NEON_BRIGHTNESS]; backface-visibility: hidden;",
        /* Blue */
        '36f9f6': "color: #acffff; text-shadow: 0 0 6px #0399f9[NEON_BRIGHTNESS], 0 0 12px #66ffff[NEON_BRIGHTNESS]; backface-visibility: hidden;"
    // 'fe4450': "color: #ff6666; text-shadow: 0 0 6px #fc1f2c[NEON_BRIGHTNESS], 0 0 14px #fc1f2c[NEON_BRIGHTNESS]; backface-visibility: hidden;",
    // 'ff7edb': "color: #f5cfdd; text-shadow: 0 0 10px #ff073e[NEON_BRIGHTNESS], 0 0 3px #ffffff[NEON_BRIGHTNESS]; backface-visibility: hidden;",
    // 'fede5d': "color: #ffffee; text-shadow: 0 0 6px #ffffff[NEON_BRIGHTNESS], 0 0 4px #ffff99[NEON_BRIGHTNESS]; backface-visibility: hidden;",
    // '72f1b8': "color: #ccff00; text-shadow: 0 0 8px #100c0f, 0 0 10px #25ff99[NEON_BRIGHTNESS]; backface-visibility: hidden;",
    // '36f9f6': "color: #acffff; text-shadow: 0 0 6px #0399f9[NEON_BRIGHTNESS], 0 0 12px #66ffff[NEON_BRIGHTNESS]; backface-visibility: hidden;",
    // '969798': "color: #99ffcc; text-shadow: 0 0 8px #55FFCC[NEON_BRIGHTNESS], 0 0 2px #ffffff[NEON_BRIGHTNESS]; backface-visibility: hidden;",
    // '959697': "color: #dedede; text-shadow: 0 0 8px #44ff05[NEON_BRIGHTNESS], 0 0 8px #66ff99[NEON_BRIGHTNESS]; backface-visibility: hidden;",
    // '9855fe': "color: #ff1199; text-shadow: 0 0 6px #cc2266[NEON_BRIGHTNESS], 0 0 4px #ff99cd[NEON_BRIGHTNESS]; backface-visibility: hidden;"
  };

  //=============================
  // Helper functions
  //=============================

  /**
   * @summary Check if the style element exists and that it has synthwave '84 color content
   * @param {HTMLElement} tokensEl the style tag
   * @param {object} replacements key/value pairs of colour hex and the glow styles to replace them with
   * @returns {boolean}
   */
  const themeStylesExist = (tokensEl, replacements) => {
    console.log('Styles exist');
    return tokensEl.innerText !== '' && 
      Object.keys(replacements).every(color => {
        return tokensEl.innerText.toLowerCase().includes(`#${color}`);
      });
  };

  /**
   * @summary Search and replace colours within a CSS definition
   * @param {string} styles the text content of the style tag
   * @param {object} replacements key/value pairs of colour hex and the glow styles to replace them with
   * @returns 
   */
  const replaceTokens = (styles, replacements) => Object.keys(replacements).reduce((acc, color) => {
    const re = new RegExp(`color: #${color};`, 'gi');
    console.log('Replace tokens...');
    return acc.replace(re, replacements[color]);
  }, styles);

  /**
   * @summary Checks if a theme is applied, and that the theme belongs to the Synthwave 84 family
   * @returns {boolean}
   */
  const usingSynthwave = () => {
    const appliedTheme = document.querySelector('[class*="theme-json"]');
    const synthdark = document.querySelector('[class*="synthdark-theme-styles"]');
    console.log('Using synthdark', synthdark, appliedTheme && synthdark);
    return appliedTheme && synthdark;
  }

  /**
   * @summary Checks if the theme is synthwave, and that the styles exist, ready for replacement
   * @param {HTMLElement} tokensEl the style tag
   * @param {object} replacements key/value pairs of colour hex and the glow styles to replace them with
   * @returns 
   */
  const readyForReplacement = (tokensEl, tokenReplacements) => tokensEl 
    ? 
      (
        // only init if we're using a Synthwave 84 subtheme
        usingSynthwave() ||         
        // does it have content ?
        !!themeStylesExist(tokensEl, tokenReplacements)
      )
    : false;

  /**
   * @summary Attempts to bootstrap the theme
   * @param {boolean} disableGlow 
   * @param {MutationObserver} obs 
   */

  const initNeonDreams = (disableGlow, obs) => {
    console.log('Innit Neon.');
    const tokensEl = document.querySelector('.vscode-tokens-styles');

    if (!!tokensEl || !readyForReplacement(tokensEl, tokenReplacements)) {
      return;
    }

    const initialThemeStyles = tokensEl.innerText;
    
    // Replace tokens with glow styles
    let updatedThemeStyles = !disableGlow 
      ? replaceTokens(initialThemeStyles, tokenReplacements) 
      : initialThemeStyles;
    

     /* append the remaining styles */
     updatedThemeStyles = `${updatedThemeStyles}[CHROME_STYLES]`;

     const newStyleTag = document.createElement('style');
     newStyleTag.setAttribute("id", "synthdark-theme-styles");
     newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '');
     document.body.appendChild(newStyleTag);
     
     console.log('Synthdark initialised!');
     
     // disconnect the observer because we don't need it anymore
     if (obs) {
       obs.disconnect();
       obs = null;
     }
  };

  /**
   * @summary A MutationObserver callback that attempts to bootstrap the theme and assigns a retry attempt if it fails
   */
  const watchForBootstrap = function(mutationsList, observer) {
    console.log('Watch bootstrap.');
    for(let mutation of mutationsList) {
      if (mutation.type === 'attributes') {
        // does the style div exist yet?
        const tokensEl = document.querySelector('.vscode-tokens-styles');  
        if (readyForReplacement(tokensEl, tokenReplacements)) {
          // If everything we need is ready, then initialise
          initNeonDreams([DISABLE_GLOW], observer);
        } else {
          // sometimes VS code takes a while to init the styles content, so if there stop this observer and add an observer for that
          observer.disconnect();
          observer.observe(tokensEl, { childList: true });
        }
      }
      if (mutation.type === 'childList') {
        const tokensEl = document.querySelector('.vscode-tokens-styles');      
        if (readyForReplacement(tokensEl, tokenReplacements)) {
          // Everything we need should be ready now, so initialise
          initNeonDreams([DISABLE_GLOW], observer);
        }
      }
    }
  };

  //=============================
  // Start bootstrapping!
  //=============================
  initNeonDreams([DISABLE_GLOW]);
  // Grab body node
  const bodyNode = document.querySelector('body');
  // Use a mutation observer to check when we can bootstrap the theme
  const observer = new MutationObserver(watchForBootstrap);
  observer.observe(bodyNode, { attributes: true });
})();