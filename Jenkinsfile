pipeline {
    agent any
        options {
        skipDefaultCheckout() 
    }
    environment {
      
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        SPRING_IMAGE_NAME = 'ineskouki/events-project'
        SPRING_IMAGE_TAG = '1.0.0-snapshot'
        ANGULAR_IMAGE_NAME = 'ineskouki/eventsprojectfront'
        ANGULAR_IMAGE_TAG = 'latest'
    }

    stages {
        stage('Github checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/InesKouki/validationDevops.git'
            }
        }
        stage("Build Spring Boot Application") {
            steps {
                dir('eventsProject') {
                    sh "mvn clean package"
                }
            }
        }
        stage("Test Spring Boot Application") {
            steps {
                dir('eventsProject') {
                    sh "mvn test"
                }
            }
        }
        stage("Sonarqube Analysis and Quality Gate") {
            steps {
                dir('eventsProject') {
                    script {
                        withSonarQubeEnv('Sonarqube') {
                            sh "mvn sonar:sonar"
                        }
                        
                        def qualityGate = waitForQualityGate abortPipeline: false, credentialsId: 'sonarqube'
                        if (qualityGate.status != 'OK') {
                            error "Pipeline aborted due to Quality Gate failure: ${qualityGate.status}"
                        }
                    }
                }
            }
        }
        stage('Upload to Nexus'){
            steps{
                dir('eventsProject'){
                    script{
                        sh 'mvn deploy -DskipTests'
                    }
                }
            }
        }
        stage("Build and Push Spring Boot Docker Image") {
            steps {
                dir('eventsProject') {
                    script {
                        withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            sh '''
                                docker build -t ${SPRING_IMAGE_NAME}:${SPRING_IMAGE_TAG} .
                                echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                                docker push ${SPRING_IMAGE_NAME}:${SPRING_IMAGE_TAG}
                            '''
                        }
                    }
                }
            }
        }
        stage("Build and Push Angular App Docker Image") {
            steps {
                dir('eventsProjectFront') {
                    script {
                        withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            sh '''
                                docker build -t ${ANGULAR_IMAGE_NAME}:${ANGULAR_IMAGE_TAG} .
                                echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                                docker push ${ANGULAR_IMAGE_NAME}:${ANGULAR_IMAGE_TAG}
                            '''
                        }
                    }
                }
            }
        }
        stage("Deploy with Docker Compose") {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''
                            docker-compose down
                            docker-compose pull
                            docker-compose up -d
                        '''
                    }
                }
            }
        }
        stage('Deploying Grafana and Prometheus') {
            steps {
                dir('eventsProject') {
                    script {
                        def prometheusExists = sh(script: "docker inspect --type=container prometheus", returnStatus: true) == 0
                        def grafanaExists = sh(script: "docker inspect --type=container grafana", returnStatus: true) == 0

                        if (prometheusExists && grafanaExists) {
                            echo 'Prometheus and Grafana are already running. Skipping deployment.'
                        } else {
                            sh 'docker-compose -f docker-compose-monitoring.yml up -d'
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                def subject = "Success"
                def body = "Build has been successfully approved"
                def to = 'ines.kouki@esprit.tn'

                mail(
                    subject: subject,
                    body: body,
                    to: to
                )
            }
        }
        failure {
            script {
                def subject = "Build Failure - ${currentBuild.fullDisplayName}"
                def body = "The build has failed in the Jenkins pipeline. Please investigate and take appropriate action."
                def to = 'ines.kouki@esprit.tn'

                mail(
                    subject: subject,
                    body: body,
                    to: to
                )
            }
        }
    }
}
