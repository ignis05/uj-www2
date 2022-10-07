# installs dependencies, builds both applications and launches server

cd website
npm i
npm run build

cd ../server
npm i
npm run build
cd dist
node index.js
