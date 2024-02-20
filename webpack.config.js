module.exports = {
  entry: "./js/main",
  output: {
    filename: "./js/bundle.js",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: ["es2015", "react"],
        },
      },
    ],
  },
};
