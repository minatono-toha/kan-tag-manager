module.exports = {
  content: [
    './index.html', // 必要に応じてファイルパスを追加
    './src/**/*.{vue,js,ts,jsx,tsx}', // src内のすべてのVueファイルを対象に
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '10px',
      },
    },
  },
  plugins: [],
}
