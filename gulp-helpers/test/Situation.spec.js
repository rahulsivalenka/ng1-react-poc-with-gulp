import {expect} from 'chai';
import Situation from '../dist/Situation';

describe('situation', function() {
	describe('#isDevelopment()', function() {
		var sit;

		beforeEach(function() {
			delete process.env.SITUATION;
			sit = new Situation();
		});

		it('should be true', function() {
			expect(sit.isDevelopment()).to.equal(true);
		});

		it('should be false', function() {
			expect(sit.isProduction()).to.equal(false);
		});
	});

	describe('#isProduction()', function() {
		var sit;

		beforeEach(function() {
			process.env.SITUATION = 'production';
			sit = new Situation();
		});

		it('should be false', function() {
			expect(sit.isDevelopment()).to.equal(false);
		});

		it('should be true', function() {
			expect(sit.isProduction()).to.equal(true);
		});
	});

	describe('#isSandbox()', function() {
		var sit;

		beforeEach(function() {
			process.env.SITUATION = 'sandbox';
			sit = new Situation();
		});

		it('should be false', function() {
			expect(sit.isDevelopment()).to.equal(false);
		});

		it('should be true', function() {
			expect(sit.isSandbox()).to.equal(true);
		});
	});

	describe('#isDemo()', function() {
		var sit;

		beforeEach(function() {
			process.env.SITUATION = 'demo';
			sit = new Situation();
		});

		it('should be false', function() {
			expect(sit.isDevelopment()).to.equal(false);
		});

		it('should be true', function() {
			expect(sit.isDemo()).to.equal(true);
		});
	});
});
