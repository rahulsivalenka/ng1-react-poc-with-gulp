const del = require('del');
const gulp = require('gulp');
const gulpHelpers = require('./gulp-helpers/dist').default;
const { Builder } = require('jspm');


let taskMaker = gulpHelpers.taskMaker(gulp);
let situation = gulpHelpers.situation();
let _ = gulpHelpers.framework('_');
let runSequence = gulpHelpers.framework('run-sequence');

let minify = !situation.isDevelopment();

let expireHeaders = (proxyRes) => {
	if (proxyRes.req.path.indexOf('.map') !== -1 || proxyRes.req.path.indexOf('/js') !== -1) {
		proxyRes.headers['expires'] = 'Thu, 01 Dec 1983 20:00:00 GMT';
		proxyRes.headers['cache-control'] = 'public, max-age=0, no-cache, no-store';
	}
	if (proxyRes.req.path.indexOf('jspm_packages') !== -1) {
		proxyRes.headers['expires'] = 'Thu, 01 Dec 2021 20:00:00 GMT';
		proxyRes.headers['cache-control'] = 'public, max-age=3600';
	}
};

let browserSyncConfig = {
	open: false,
	ui: false,
	notify: false,
	ghostMode: false,
	logFileChanges: true,
	files: ['dist/css/*.css'],
	startPath: '/index.html',
	port: 3000,
	proxy: {
		target: '0.0.0.0:8000',
		proxyRes: [expireHeaders],
		middleware: function (req, res, next) {
			hostHeader = req.headers.host;
			next();
		},
		proxyReq: [
			(proxyReq) => {
				proxyReq.setHeader('Host', hostHeader);
			}
		]
	}
};

browserSyncConfig = {
	server: {
		baseDir: './',
		files: ['dist/**/*.js'],
	}
}

let babelCompilerOptions = {
	presets: ["es2015"],
	plugins: ['transform-react-jsx', 'transform-es2015-modules-systemjs', ['transform-runtime', { 'polyfill': false, 'regenerator': false }]]
	// presets: ["preset-env"]
	// "optional": [
	// 	"runtime",
	// 	"optimisation.modules.system"
	// ],
	// "stage": 0
};

let bundles = [
  {
    name: 'app',
    index: './src/app/app.js',
    output: './app/',
    hasBundle: true,
    minify: minify,
    del: true,
  },
  {
    name: 'react',
    index: './src/react/index.js',
    output: './react/',
    hasBundle: true,
    minify: minify,
    del: true,
  }
];

const path = {
  source: 'src/**/*.js',
	sourceCss: 'src/**/*.css',
  output: './dist',
  src: './src',
	clean: ['dist'],
}

taskMaker.defineTask('clean', {taskName: 'clean', src: path.clean});
// taskMaker.defineTask('less', {taskName: 'less-css', src: path.less_css, dest: 'target/css', watchTask: true, notify: true, sourcemaps: !situation.isDevelopment()});
taskMaker.defineTask('copy', {taskName: 'css-css', src: path.sourceCss, dest: path.output});
taskMaker.defineTask('babel', {taskName: 'babel', src: path.source, dest: path.output, ngAnnotate: true, compilerOptions: babelCompilerOptions, watchTask: true, notify: true});
// taskMaker.defineTask('ngHtml2Js', {taskName: 'ngHtml2Js', src: path.templates, dest: path.output, watchTask: true, minimize: minimizeOptions });
// taskMaker.defineTask('copy', {taskName: 'config', src: path.configJson, dest: path.output, rename: 'config.json', changed: {extension: '.json'}, watchTask: true, replace: configReplace});
taskMaker.defineTask('copy', {taskName: 'copy-css', src: 'target/css/**/*.css*', dest: path.output + '/css'});
taskMaker.defineTask('browserSync', {taskName: 'browserSync', config: browserSyncConfig});

let bundler = (bundle) => {
	let builder = new Builder();
	return builder.buildStatic(`src/${bundle.name}/app`, `${path.output}/js/${bundle.name}/${bundle.name}-bundle.js`,
		{minify: bundle.minify, sourceMaps: false, uglify: {beautify: {ascii_only: true}}, runtime: false});
};

let cacheBustTasks = [];
bundles.forEach((bundle) => {
	if (bundle.hasBundle) {
		gulp.task('bundle-' + bundle.name, () => {
			return bundler(bundle);
		});
	}

	let taskName = `cache-bust-${bundle.name}`;
	let delTaskName = `${taskName}-del`;
	cacheBustTasks.push(taskName);
	taskMaker.defineTask('clean', {taskName: delTaskName, src: `${path.output}/${bundle.output}`});
	let taskOptions = {taskName: taskName, src: bundle.index, dest: `${path.output}/${bundle.output}` , watchTask: true};
	if (bundle.del) {
		taskOptions.taskDeps = [delTaskName];
	}
	taskMaker.defineTask('copy', taskOptions);
});

gulp.task('compile', (callback) => {
	return runSequence(cacheBustTasks.concat(['babel', 'css-css']), callback);
});

// console.log(
//   {
//     gulp, gulpHelpers
//   }
// )


gulp.task('recompile', (callback) => {
	del.sync(path.output + '/js');
	del.sync(path.output + '/css');
	// del.sync(path.output + '/jspm_packages');
	// del.sync(path.output + '/jspm.browser.js');
	// del.sync(path.output + '/jspm.config.js');

	return runSequence('clean', 'compile', callback);
});

gulp.task('deploy', (callback) => {
	if (!situation.isDevelopment()) {
		let bundleTasks = _.reduce(bundles, (tasks, bundle) => {
			if (bundle.hasBundle) {
				tasks.push('bundle-' + bundle.name);
			}
			return tasks;
		}, []);

		return runSequence('recompile',
			bundleTasks,
			'copy-css',
			callback);
	} else {
		return runSequence('recompile', callback);
	}
});




gulp.task('run', (callback) => {
	let sequences = [
		'deploy',
		// 'watch-less-css',
		'watch-babel',
		// 'watch-ngHtml2Js',
		// 'watch-config'
	];

	bundles.forEach((bundle) => {
		sequences.push(`watch-cache-bust-${bundle.name}`);
	});

	return runSequence(sequences, ['browserSync'], callback);
});

gulp.task('default', ['run']);