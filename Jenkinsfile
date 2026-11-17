
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
            echo 'CloudNova deployment failed. Check the console output.'
        }
    }
}
