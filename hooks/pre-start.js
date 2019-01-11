var fs = require('fs-extra');
var jsonConcat = require("json-concat");


var localizationSourceFilesEN = [
  "./src/assets/i18n/en/general.en.json",
  "./src/assets/i18n/en/auth.en.json",
  "./src/assets/i18n/en/products.en.json",
  "./src/assets/i18n/en/customer.en.json",
  "./src/assets/i18n/en/master.en.json",
  "./src/assets/i18n/en/role.en.json",
  "./src/assets/i18n/en/users.en.json",
  "./src/assets/i18n/en/permissions.en.json",
  "./src/assets/i18n/en/components.en.json",
  "./src/assets/i18n/en/menu.en.json"
];

var localizationSourceFilesFR = [
  "./src/assets/i18n/fr/general.fr.json",
  "./src/assets/i18n/fr/auth.fr.json",
  "./src/assets/i18n/fr/products.fr.json",
  "./src/assets/i18n/fr/customer.fr.json",
  "./src/assets/i18n/fr/master.fr.json",
  "./src/assets/i18n/fr/role.fr.json",
  "./src/assets/i18n/fr/users.fr.json",
  "./src/assets/i18n/fr/components.fr.json"
];

function mergeAndSaveJsonFiles(src, dest) {
  jsonConcat({ src: src, dest: dest },
    function (res) {
      console.log('Localization files successfully merged!');
    }
  );
}

function setEnvironment(configPath, environment) {
  fs.writeJson(configPath, {env: environment},
    function (res) {
      console.log('Environment variable set to ' + environment)
    }
  );
}

// Set environment variable to "development"
setEnvironment('./config/env.json', 'development');

// Merge all localization files into one
mergeAndSaveJsonFiles(localizationSourceFilesEN, "./src/assets/i18n/en.json");
mergeAndSaveJsonFiles(localizationSourceFilesFR, "./src/assets/i18n/fr.json");