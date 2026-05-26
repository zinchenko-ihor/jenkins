pipeline {
    agent { label 'agent-1' }

    triggers {
        githubPush()
    }

    environment {
        IMAGE_NAME = 'my-app'
        CONTAINER_NAME = 'my-app-container'
        APP_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Install Docker') {
            steps {
                sh '''
            if command -v docker &> /dev/null; then
                echo "Docker already installed: $(docker --version)"
            else
                echo "Installing Docker..."
                sudo apt-get update -y
                sudo apt-get install -y ca-certificates curl
                sudo install -m 0755 -d /etc/apt/keyrings
                sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
                sudo chmod a+r /etc/apt/keyrings/docker.asc
                echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
                sudo apt-get update -y
                sudo apt-get install -y docker-ce docker-ce-cli containerd.io
                sudo usermod -aG docker ubuntu
                echo "Docker installed successfully"
            fi
        '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "Building Docker image..."
                    sudo docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .
                    sudo docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest
                    echo "Image built: ${IMAGE_NAME}:${BUILD_NUMBER}"
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    echo "Starting test container..."
                    sudo docker run -d \
                    --name ${CONTAINER_NAME}-test \
                    -p 3000:3000 \
                    ${IMAGE_NAME}:latest

                    echo "Waiting for app to start..."
                    sleep 5

                    echo "Running tests..."
                    sudo docker exec ${CONTAINER_NAME}-test node test.js

                    echo "Stopping test container..."
                    sudo docker stop ${CONTAINER_NAME}-test
                    sudo docker rm ${CONTAINER_NAME}-test
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    echo "Stopping old container if exists..."
                    sudo docker stop ${CONTAINER_NAME} || true
                    sudo docker rm ${CONTAINER_NAME} || true

                    echo "Starting new container..."
                    sudo docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${APP_PORT}:3000 \
                        ${IMAGE_NAME}:latest

                    echo "Container started successfully"
                    sudo docker ps | grep ${CONTAINER_NAME}
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Waiting for app..."
                    sleep 5

                    echo "=== Health Check ==="
                    curl -f http://localhost:${APP_PORT}/health || exit 1

                    echo "=== App Response ==="
                    curl -s http://localhost:${APP_PORT}/
                '''
            }
        }

        stage('Cleanup Old Images') {
            steps {
                sh '''
                    echo "Removing dangling images..."
                    sudo docker image prune -f
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded! App is running on port ${APP_PORT}"
        }
        failure {
            sh '''
                echo "❌ Pipeline failed! Cleaning up..."
                sudo docker stop ${CONTAINER_NAME}-test || true
                sudo docker rm ${CONTAINER_NAME}-test || true
            '''
        }
    }
}
