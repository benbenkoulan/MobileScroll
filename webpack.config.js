const path = require('path')

module.exports = {
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'mobile-scroll.js',
		library: 'MobileScroll',
      	libraryTarget: 'umd'
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