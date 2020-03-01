const paths = {
    pageLayouts: {
        input: 'src/layouts/**/{*.html,*shtml}',
        testing: 'test/_layouts/',
        watch: 'src/layouts/**/{*.html,*shtml}',
        links: 'src/layouts/partials/js_links.html',
        dist: 'dist/'
    },
    pages: {
        input: 'src/pages/**/*',
        exclude: 'src/pages/{_partials,_partials/**}',
        testing: 'test/',
        watch: 'src/pages/**/*.html',
        site: 'test/_site/**/*html',
        deploy: 'dist/'
    },
    includes: {
        input: 'src/includes/*.html',   
        testing: 'test/_includes/'
    },
    scripts: {
        input: 'src/scripts/**/*.js',
        exclude: 'src/scripts/exclude/*.js',
        inline: 'src/scripts/inline/*.js',
        outputInline: 'test/_includes',
        bower: 'src/scripts/bower_components/**/*.js',
        vendor: 'src/scripts/vendor/*.js',
        testing: 'test/scripts/',
        dist: 'dist/scripts/',
        admin: 'src/scripts/exclude/search_admin.js',
        search: 'src/scripts/exclude/search.js'
    },
    bower: {
        components: 'bower_components',
        json: 'bower.json',
        vendor: 'src/scripts/vendor/' 
    },
    styles: {
        input: 'src/sass/styles.scss',
        inputInline: 'src/sass/inline_styles/{blog_embedded_styles.scss,index_embeded_styles.scss,main_embedded_styles.scss,error_page.scss,search_page.scss}',
        outputInline: 'test/_includes',
        exclude: '!src/sass/partials/*.scss',
        testing: 'test/css/',
        dist: 'dist/css',
        watch: 'src/sass/**/*.scss'
    },
    remove: {
        input: 'test/css/*.css',
        exclude: '!test/css/styles.css'
    },
    images: {
        input: 'src/photos_in/{*.jpg,*.tiff,*.png}',
        output: 'src/photos_out/',
        testing: 'test/siteart/',
        dist: 'dist/siteart/'
    },
    svg: {
        input: 'src/svg/svg_in/*.svg',
        output: 'src/svg/'
    },
    fonts: {
        input: 'src/fonts/*.css',
        testing: 'test/fonts/',
        dist: 'dist/fonts/'
    },
    posts: {
        input: 'src/posts/**/*.markdown',
        output: 'test/_posts/'
    },
    collections: {
        input: 'src/collections/**/*.markdown',
        output: 'test/'
    },
    sitemap: {
        input: 'test/_site/sitemap.xml',
        output: 'dist/'
    },
    icons: {
        input: 'src/touch_icons/{*.ico,*.png}',
        output: 'dist/'
    }
}

// creates file names based on date
const date = new Date();
const dateString = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`
const cacheBustNames = {
    filename: `styles-${dateString}.css`,
    scriptname: `script-${dateString}.js`,
    searchname: `search-${dateString}.js`,
    adminname:`admin-${dateString}.js`
}

const googleAnalytics = 'UA-56763803-1';

export { paths, googleAnalytics, cacheBustNames }