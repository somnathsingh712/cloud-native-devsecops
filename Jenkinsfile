
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t cloudnova-website:${BUILD_NUMBER} .'
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                    trivy --config "" image \
                    --scanners vuln \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    cloudnova-website:${BUILD_NUMBER}
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                    docker rm -f cloudnova-container || true

                    docker run -d \
                      --name cloudnova-container \
                      --restart unless-stopped \
                      -p 80:80 \
                      cloudnova-website:${BUILD_NUMBER}
                '''
            }
        }
    }

    post {
        success {
            echo 'CloudNova deployment successful!'
        }
        failure {
            echo 'Pipeline failed. Check the failed stage and Console Output.'
        }
    }
}
