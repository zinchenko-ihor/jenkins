pipeline {
    agent { docker { image 'ubuntu:latest' }}

    stages {
        stage('1-Build') {
            steps {
                echo 'Start Stage Build'
                echo 'Building.....'
                echo 'End of Stage Build'
            }
        }
    
        stage('2-Test') {
            steps {
                echo 'Start Stage Test'
                echo 'Testing.....'
                echo 'End of Stage Test'
            }
        }
    
        stage('3-Deploy') {
            steps {
                echo 'Start Stage Deploy'
                echo 'Deploying.....'
                echo 'End of Stage Deploy'
                sh 'cat /etc/os-release'
                
            }
        }
    }
    
}
