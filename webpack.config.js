const path = require('path')

module.exports = {
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'mobile-scroll.js',
		library: 'mobile-scroll',
      	libraryTarget: 'commonjs2'
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