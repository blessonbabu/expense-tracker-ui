var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, "/bin"),
        historyApiFallback: true,
        compress: true,
        port: 6070,
        host: 'dev.expensetracker.com',
        hot: true,
    },
    entry: {
        'main': [
            'font-awesome-webpack!./src/theme/font-awesome.config.js',
            __dirname + '/src/app.js',
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(scss|css)$/,
                loader: 'style-loader!css-loader?modules&importLoaders=2&sourceMap&localIdentName=[path][name]-[local]!autoprefixer-loader?browsers=last 2 version!sass-loader?outputStyle=expanded&sourceMap',
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader?name=[name].[ext]&publicPath=/images/',
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff&outputPath=fonts/" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?outputPath=fonts/" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" },
        ]
    },
    node: {
        fs: "empty"
    },
    resolve: {
        alias: {
            'reactDateTimeStyles': path.join(__dirname, './node_modules/react-datetime/css/react-datetime.css'),
            'reactBigDateStyles': path.join(__dirname, './node_modules/react-big-calendar/lib/css/react-big-calendar.css'),
        },
        modules: [path.resolve(__dirname, "src"), "node_modules", path.resolve(__dirname, "bin")],
        extensions: ['.json', '.js', '.jsx'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.ejs',
            filename: 'index.html',
        }),
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __SERVER__: false,
            __DEVELOPMENT__: true,
            __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
        })
    ],
    output: {
        filename: 'static/main.js',
        path: path.resolve(__dirname, 'bin'),
        publicPath: '/',
    },
};
