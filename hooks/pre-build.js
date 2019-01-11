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

var localizationSourceFilesHR = [
  "./src/assets/i18n/hr/general.hr.json",
  "./src/assets/i18n/hr/auth.hr.json",
  "./src/assets/i18n/hr/products.hr.json",
  "./src/assets/i18n/hr/customer.hr.json",
  "./src/assets/i18n/hr/components.hr.json"
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

// Set environment variable to "production"
setEnvironment('./src/config/env.json', 'production');

// Merge all localization files into one
mergeAndSaveJsonFiles(localizationSourceFilesEN, "./src/assets/i18n/en.json");
mergeAndSaveJsonFiles(localizationSourceFilesHR, "./src/assets/i18n/hr.json");