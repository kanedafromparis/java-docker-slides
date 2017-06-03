'use strict'

let npm = run({
  sh: `npm install`,
  watch: 'package.json'
})

let mkdir = run({
  sh: 'mkdir -p target/classes/public'
})

let stylus = run({
  name: 'css',
  sh: './node_modules/.bin/stylus src/main/stylus -o target/classes/public/',
  watch: 'src/main/stylus/**/*.styl'
}).dependsOn(npm, mkdir)

let javascript = webpack({
  name: 'javascript',
  watch: ['src/main/javascript/**/*.js', 'webpack.config.js']
}).dependsOn(npm, mkdir)

let compile = maven({
  sh: 'mvn compile',
  watch: ['src/docs/**', 'src/main/java/**', 'src/main/resources/**', 'pom.xml']
})

let server = runServer({
  httpPort,
  sh: `java -cp target/classes Server ${httpPort}`
}).dependsOn(compile)

proxy(server, 8080).dependsOn(compile)
