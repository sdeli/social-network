function use (optionsObj) {
     for (key in optionsObj) {
         if (key === 'fourOfourPage') {
            this.usedOptions.fourOfourPage = optionsObj[key];
         }
     }
}

module.exports = use;