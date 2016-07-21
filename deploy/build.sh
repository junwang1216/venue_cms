#!/bin/sh

#脚本的工作目录是上面一层，所以不用cd ..
#cd ..

set -e
rm -rf dist public-dist views-dist

# install the modules
npm install

rm -rf public/style/**/*.css

# build the stylus
node_modules/stylus/bin/stylus public/style/**/**/*.styl

# build the static and templates
node_modules/fis3/bin/fis.js release

mv dist/public public-dist
mv dist/views views-dist

cp -rf public/images public-dist/
cp -f public/favicon.ico public-dist/favicon.ico
