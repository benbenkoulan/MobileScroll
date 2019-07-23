const path = require('path')

const resolve = dir => path.join(__dirname, './', dir);

module.exports = {
	entry: resolve('src/mobilescroll.js'),
	output: {
		path: resolve('dist'),
		filename: 'mobile-scroll.js',
		library: 'MobileScroll',
      	libraryTarget: 'umd',
      	umdNamedDefine: true
	},
	module: {
		rules: [{
			test: /\.js$/,
			use: 'babel-loader',
			exclude: /node_modules/
		}]
	},
	resolve: {
		extensions: ['.js']
	}
}