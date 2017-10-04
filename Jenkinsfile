#!groovy

node {

    def GITHUB_USER = "madoos"
    def GITHUB_REPO = "sequelize-pg-stream"
    def GITHUB_BRANCH = env.BRANCH_NAME
    def GITHUB_TOKEN =  env.GITHUB_TOKEN
    def NPM_TOKEN = env.NPM_TOKEN
    def DOCKER_USER = env.DOCKER_USER
    def DOCKER_TOKEN = env.DOCKER_TOKEN

    stage("checkout SCM"){
      checkout scm
    }

    stage("Make Tests"){
      sh "./bin/CI/test-builder ${GITHUB_USER} ${GITHUB_REPO} ${GITHUB_BRANCH} ${GITHUB_TOKEN}"
    }

    stage("publish Reports"){
      publishHTML([
        allowMissing: false,
        alwaysLinkToLastBuild: false,
        keepAll: false, reportDir: "./report/coverage/lcov-report",
        reportFiles: "index.html",
        reportName: "Coverage Report"
      ])
      publishHTML([
        allowMissing: false,
        alwaysLinkToLastBuild: false,
        keepAll: false, reportDir: "./report/linter/",
        reportFiles: "index.html",
        reportName: "Linter Report"
      ])
    }

    if( env.BRANCH_NAME ==~ /.*release.*/ ){

        def PACKAGE_VERSION = sh (script: "./bin/CI/get-release ${GITHUB_BRANCH}", returnStdout: true)

        stage("Publish package"){
          sh "./bin/CI/npm-publisher ${GITHUB_USER} ${GITHUB_REPO} ${GITHUB_BRANCH} ${GITHUB_TOKEN} ${NPM_TOKEN} ${PACKAGE_VERSION}"
        }
    }
}
