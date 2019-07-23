const path = require('path');
const webpack = require('webpack');
const resolve = dir => path.join(__dirname, './', dir);

const isMini = process.env.type === 'mini';

const config = {
	entry: resolve('src/mobilescroll.js'),
	output: {
		path: resolve('dist'),
		filename: isMini ? 'mobile.scroll.mini.js' : 'mobile.scroll.js',
		library: 'MobileScroll',
		libraryExport: 'default',
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
	},
	plugins: []
}

if (isMini) {
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({
		comments: false,
		compress: {
			warnings: false,
			keep_fargs: false,
			pure_funcs: [ 'console.log' ],
			toplevel: true
			
		}
	}));
}

module.exports = config;