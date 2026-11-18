pipeline {
    agent any

    environment {
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
        IMAGE_NAME = 'cloudnova-website'
    }

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                      -t ${IMAGE_NAME}:${BUILD_NUMBER} .
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                    trivy --config "" image \
                      --scanners vuln \
                      --exit-code 1 \
                      --severity HIGH,CRITICAL \
                      ${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Load Image into Minikube') {
            steps {
                sh '''
                    sudo -n /usr/local/bin/jenkins-minikube-image-load \
                      ${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl set image \
                      deployment/cloudnova-web \
                      website=${IMAGE_NAME}:${BUILD_NUMBER} \
                      -n default
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    kubectl rollout status \
                      deployment/cloudnova-web \
                      -n default \
                      --timeout=180s

                    kubectl get deployment cloudnova-web -n default
                    kubectl get pods -l app=cloudnova-web -n default
                '''
            }
        }
    }

    post {
        success {
            echo 'CloudNova Kubernetes deployment successful!'
        }

        failure {
            echo 'Pipeline failed. Check the failed stage and Console Output.'
        }
    }
}
