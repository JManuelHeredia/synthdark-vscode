(function () {
  //====================================
  // Theme replacement CSS (Glow styles)
  //====================================
  const tokenReplacements = {
    /* Red */
    'fe4450': "color: #fff5f6; text-shadow: 0 0 2px #000, 0 0 10px #fc1f2c[NEON_BRIGHTNESS], 0 0 5px #fc1f2c[NEON_BRIGHTNESS], 0 0 25px #fc1f2c[NEON_BRIGHTNESS]; backface-visibility: hidden;",
    /* Neon pink */
    'ff7edb': "color: #f92aad; text-shadow: 0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3; backface-visibility: hidden;",
    /* Yellow */
    'fede5d': "color: #f4eee4; text-shadow: 0 0 2px #393a33, 0 0 8px #f39f05[NEON_BRIGHTNESS], 0 0 2px #f39f05[NEON_BRIGHTNESS]; backface-visibility: hidden;",
    /* Green */
    '72f1b8': "color: #72f1b8; text-shadow: 0 0 2px #100c0f, 0 0 10px #257c55[NEON_BRIGHTNESS], 0 0 35px #212724[NEON_BRIGHTNESS]; backface-visibility: hidden;",
    /* Blue */
    '36f9f6': "color: #fdfdfd; text-shadow: 0 0 2px #001716, 0 0 3px #03edf9[NEON_BRIGHTNESS], 0 0 5px #03edf9[NEON_BRIGHTNESS], 0 0 8px #03edf9[NEON_BRIGHTNESS]; backface-visibility: hidden;"
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
    return acc.replace(re, replacements[color]);
  }, styles);

  /**
   * @summary Checks if a theme is applied, and that the theme belongs to the Synthwave 84 family
   * @returns {boolean}
   */
  const usingSynthwave = () => {
    const appliedTheme = document.querySelector('[class*="theme-json"]');
    const synthWaveTheme = document.querySelector('[class*="RobbOwen-synthwave-vscode-themes"]');
    return appliedTheme && synthWaveTheme;
  }

  /**
   * @summary Checks if the theme is synthwave, and that the styles exist, ready for replacement
   * @param {HTMLElement} tokensEl the style tag
   * @param {object} replacements key/value pairs of colour hex and the glow styles to replace them with
   * @returns 
   */
  const readyForReplacement = (tokensEl, tokenReplacements) => tokensEl 
    ? (
      // only init if we're using a Synthwave 84 subtheme
      usingSynthwave() &&         
      // does it have content ?
      themeStylesExist(tokensEl, tokenReplacements)
    )
    : false;

  /**
   * @summary Attempts to bootstrap the theme
   * @param {boolean} disableGlow 
   * @param {MutationObserver} obs 
   */
  const initNeonDreams = (disableGlow, obs) => {
    const tokensEl = document.querySelector('.vscode-tokens-styles');

    if (!tokensEl || !readyForReplacement(tokensEl, tokenReplacements)) {
      return;
    }

    var initialThemeStyles = themeStyleTag.innerText;
    
    var updatedThemeStyles = initialThemeStyles;
    
    if (!disableGlow) {
      /* replace neon red */
      updatedThemeStyles = updatedThemeStyles.replace(/color: #fe4450;/g, "color: #FF6666; text-shadow: 0 0 4px #fc1f2c[NEON_BRIGHTNESS], 0 0 14px #fc1f2c[NEON_BRIGHTNESS]; font-weight: 600;");
      /* replace neon pink */
      updatedThemeStyles = updatedThemeStyles.replace(/color: #ff7edb;/g, "color: #f5cfdd; text-shadow: 0 0 1px #ff073ecc, 0 0 3px #fff3;");
      /* replace yellow */
      updatedThemeStyles = updatedThemeStyles.replace(/color: #fede5d;/g, "color: #eeeeee; text-shadow: 0 0 2px #eaeaea, 0 0 6px #f39f05[NEON_BRIGHTNESS];");
      /* replace green */
      updatedThemeStyles = updatedThemeStyles.replace(/color: #72f1b8;/g, "color: #ccffdd; text-shadow: 0 0 2px #100c0f, 0 0 6px #257c55[NEON_BRIGHTNESS], 0 0 10px #218824[NEON_BRIGHTNESS];");
      /* replace blue */
      updatedThemeStyles = updatedThemeStyles.replace(/color: #36f9f6;/g, "color: #acffff; text-shadow: 0 0 6px #0399f9[NEON_BRIGHTNESS], 0 0 12px #66ffff[NEON_BRIGHTNESS]; font-weight: 600;");
      /* replace black */
      updatedThemeStyles = updatedThemeStyles.replace(/color: #010101;/g, "color: #99ffdd; text-shadow: 0 0 2px #ffffff[NEON_BRIGHTNESS];");
      /* replace purple */
      updatedThemeStyles = updatedThemeStyles.replace(/color: #020202;/g, "color: #dedede; text-shadow: 0 0 2px #f3ff05[NEON_BRIGHTNESS], 0 0 8px #ffdd05[NEON_BRIGHTNESS]; font-weight: bold;");
      /* replace plus 100 weight */
      updatedThemeStyles = updatedThemeStyles.replace(/color: ##e6e6e6;/g, "color: ##e6e6e6; font-weight: 500;");
    }

    /* append the remaining styles */
    updatedThemeStyles = `${updatedThemeStyles}[CHROME_STYLES]`;

    const newStyleTag = document.createElement('style');
    newStyleTag.setAttribute("id", "synthwave-84-theme-styles");
    newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '');
    document.body.appendChild(newStyleTag);
    
    console.log('SyntDark initialised!');
    
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
      for(let mutation of mutationsList) {
          if (mutation.type === 'attributes') {
            // only init if we're using a Synthwave 84 subtheme
            const isUsingSynthwave = document.querySelector('[class*="Stratorrider-synthwave-vscode-themes"]');
            // does the style div exist yet?
            const tokensLoaded = document.querySelector('.vscode-tokens-styles');
            // does it have content ?
            const tokenStyles = document.querySelector('.vscode-tokens-styles').innerText;

            // sometimes VS code takes a while to init the styles content, so stop this observer and add an observer for that
            if (isUsingSynthwave && tokensLoaded) {
              observer.disconnect();
              observer.observe(tokensLoaded, { childList: true });
            }
          }
          if (mutation.type === 'childList') {
            const isUsingSynthwave = document.querySelector('[class*="Stratorrider-synthwave-vscode-themes"]');
            const tokensLoaded = document.querySelector('.vscode-tokens-styles');
            const tokenStyles = document.querySelector('.vscode-tokens-styles').innerText;

            // Everything we need is ready, so initialise
            if (isUsingSynthwave && tokensLoaded && tokenStyles) {
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