'use strict'

var source = 'test/**/test_*.js'

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: [
                    source
                ]
            }
        },
        'mocha_istanbul': {
            coveralls: {
                src: [
                    source
                ], // multiple folders also works
                options: {
                    coverage: false, // this will make the grunt.event.on('coverage') event listener to be triggered
                    check: {
                        statements: 1,
                        branches: 1,
                        functions: 1,
                        lines: 1
                    },
                    root: './lib', // define where the cover task should consider the root of libraries that are covered by tests
                    reportFormats: ['cobertura', 'lcov'],
                    istanbulOptions: ['--include-all-sources']
                }
            }
        }
    })

    grunt.event.on('coverage', function (lcovFileContents, done) {
        // Check below on the section "The coverage event"
        done()
    })

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-mocha-test')
    grunt.loadNpmTasks('grunt-mocha-istanbul')

    // Default task.
    // grunt.registerTask('default', ['mochaTest'])
    grunt.registerTask('default', ['mocha_istanbul:coveralls'])

    // https://github.com/TooTallNate/node-time for time management

}
