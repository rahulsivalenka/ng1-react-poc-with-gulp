const { execSync } = require('child_process')

const libs = {
  "browser-sync": "^2.13.0",
    // "connect-history-api-fallback": "^1.2.0",
    // "del": "^2.2.1",
    // "express-history-api-fallback": "^2.0.0",
    // "gulp": "^3.9.1",
    // "gulp-babel": "^6.1.2",
    // "gulp-cached": "^1.1.0",
    // "gulp-changed": "^1.3.0",
    // "gulp-chmod": "^1.3.0",
    // "gulp-coffee": "^2.3.2",
    // "gulp-concat": "^2.6.0",
    // "gulp-css-usage": "^2.0.2",
    // "gulp-eslint": "^3.0.1",
    // "gulp-filter": "^4.0.0",
    // "gulp-htmlmin": "^2.0.0",
    // "gulp-insert": "^0.5.0",
    // "gulp-jshint": "^2.0.1",
    // "gulp-less": "^3.1.0",
    // "gulp-less-dependents": "^1.1.1",
    // "gulp-ng-annotate": "^2.0.0",
    // "gulp-ng-html2js": "^0.2.2",
    // "gulp-notify": "^2.2.0",
    // "gulp-plumber": "^1.1.0",
    // "gulp-rename": "^1.2.2",
    // "gulp-replace-task": "^0.11.0",
    // "gulp-sourcemaps": "^2.0.0-alpha",
    // "gulp-uglify": "^1.5.4",
    // "gulp-util": "~3.0.7",
    // "gulp-watch": "^4.3.8",
    // "gulp-zip": "^3.2.0",
    // "jshint": "^2.9.4",
    // "jspm": "^0.16.55",
    // "notify-send": "^0.1.2",
    // "run-sequence": "^1.2.2",
    // "vinyl-paths": "^2.1.0"
}

Object.keys(libs).forEach((name) => {
  const version = libs[name];
  try {
    console.log(`Installing ${name}@${version}...`);
    execSync(`npm install ${name}@${version} --save-dev`, { stdio: 'inherit' });
    console.log('------------------DONE------------------');
  } catch(err) {
    console.error(`Failed to install ${name}@${version}:`, err);
  }
});
