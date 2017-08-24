#!/usr/bin/env node

const program = require('commander');
const execSync = require('child_process').execSync;
const fs = require('fs');
const format = require("string-template");
const capitalize = require("capitalize");
const path = require('path');


program
  .version('0.0.1')
  .option('-M, --app_module [name]', 'Generate Fooll module [name]')
  .option('-a, --create_app [name]', 'Generate Fooll application [name]')
  .parse(process.argv);

if (program.app_module) {
  var moduleName = program.app_module;
  console.log('Generating app module:', moduleName);
  if (!fs.existsSync('app_modules')) {
    fs.mkdirSync('app_modules/');
  }
  var modulePath = 'app_modules/' + moduleName + '/';
  createDirectory(modulePath);
  var templateData = {
    name: capitalize(moduleName)
  }
  var moduleComponents = [
    'client/',
    'views/',
    'index.js',
  ];
  createCompos(moduleComponents, modulePath, templateData);
  console.log('Module %s generated', moduleName);
}

if (program.create_app) {
  var appName = program.create_app;
  console.log('Generating application:', appName);
  var appPath = appName + '/';
  createDirectory(appPath);
  var templateData = {
    name: appName
  }
  var appComponents = [
    'app.js',
    'public/',
    'package.json',
  ];
  createCompos(appComponents, appPath, templateData);
  console.log('Application %s generated', appName);
}

function getTemplate(component) {
  var templatePath = path.resolve(__dirname, 'templates', component);
  if (fs.existsSync(templatePath)) {
    return fs.readFileSync(templatePath, 'utf-8');
  } else {
    return null;
  }
}

function createDirectory(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  } else {
    console.error('Error: Directory %s already exists', directory);
  }
}

function createCompos(components, folderPath, templateData) {
  components.forEach(component => {
    var componentPath = folderPath + component;
    var command = /\w+\.\w+/g.test(component) ? 'touch' : 'mkdir';
    var template = getTemplate(component);
    var content = "";
    if (template) {
      content = format(template, templateData);
    }
    if (/\w+\.\w+/g.test(component)) {
      fs.writeFileSync(componentPath, content, 'utf-8');
    } else {
      fs.mkdirSync(componentPath);
    }
  });
}
