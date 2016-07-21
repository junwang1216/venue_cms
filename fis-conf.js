fis.set('project.ignore', [
    '/**/node_modules/**'
]);

fis.match('::package', {
    postpackager: fis.plugin('loader')
});

fis.match('*.styl', {
    useHash: true,
    parser: fis.plugin('stylus2'),
    optimizer: fis.plugin('clean-css'),
    rExt: '.css'
});

fis.match('*.css', {
    useHash: true,
    optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
    useHash: true,
    optimizer: fis.plugin('png-compressor')
});

fis.match('*.jpg', {
    useHash: true
});

fis.match('/public/**/*.js', {
    useHash: true,
    optimizer: fis.plugin('uglify-js')
});

//deploy the static resource
fis.match('/public/**', {
    deploy: fis.plugin('local-deliver', {
        to: 'dist'
    })
});
fis.match('/views/**', {
    deploy: fis.plugin('local-deliver', {
        to: 'dist'
    })
});