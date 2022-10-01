import plumber from 'gulp-plumber';
import cache from 'gulp-cached';
import changed from 'gulp-changed';
import rename from 'gulp-rename';
import replace from 'gulp-replace-task';
import chmod from 'gulp-chmod';
import _isUndefined from 'lodash/isUndefined';
import _forEach from 'lodash/forEach';

class CopyTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('CopyTask: src is missing from configuration!');
		}

		if (_isUndefined(this.options.dest)) {
			throw new Error('CopyTask: dest is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			let chain = gulp.src(options.src)
				.pipe(cache(options.taskName))
				.pipe(plumber());

			if (options.changed) {
				chain = chain.pipe(changed(options.dest, options.changed));
			}

			if (options.replace) {
				chain = chain.pipe(replace(options.replace));
			}

			if (options.rename) {
				chain = chain.pipe(rename(options.rename));
			}

			if (!_isUndefined(options.chmod)) {
				chain = chain.pipe(chmod(options.chmod));
			}

			chain = chain.pipe(gulp.dest(options.dest));

			_forEach(options.globalBrowserSyncs, (bs) => {
				chain = chain.pipe(bs.stream());
			});

			return chain;
		});
	}
}

module.exports = CopyTask;
