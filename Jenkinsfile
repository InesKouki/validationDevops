pipeline {
   agent any
   tools {
       jdk 'JAVA_HOME'
       maven 'M2_HOME'
   }

   environment {
       MAVEN_CREDENTIALS_ID = 'jenkins-nexus'
       MAVEN_REPO_URL = 'http://192.168.33.10:8081/repository/Jenkins-repository/'
       DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
       IMAGE_NAME = 'ineskouki/events-project'
       IMAGE_TAG = '1.0.0-SNAPSHOT'
   }
   
   stages {
       stage("Cleanup Workspace") {
           steps {
               cleanWs()
           }
       }
       stage('Checkout from SCM') {
           steps {
               git branch: 'master', url: 'https://github.com/InesKouki/validationDevops.git'
           }
       }
       stage("Build Application") {
           steps {
               sh "mvn clean package"
           }
       }
       stage("Test Application") {
           steps {
               sh "mvn test"
           }
       }
       stage("Sonarqube Analysis") {
           steps {
               script {
                   withSonarQubeEnv('Sonarqube') {
                       sh "mvn sonar:sonar"
                   }
               }
           }
       }
       stage("Quality Gate") {
           steps {
               script {
                   waitForQualityGate abortPipeline: false, credentialsId: 'sonarqube'
               }
           }
       }
       stage("Deploy to Nexus") {
           steps {
               script {
                   withCredentials([usernamePassword(credentialsId: env.MAVEN_CREDENTIALS_ID, usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                       sh """
                           mvn deploy:deploy-file \
                           -DgroupId=tn.esprit \
                           -DartifactId=eventsProject \
                           -Dversion=1.0-SNAPSHOT \
                           -Dpackaging=jar \
                           -Dfile=target/eventsProject-1.0.0-SNAPSHOT.jar \
                           -DrepositoryId=deploymentRepo \
                           -Durl=${env.MAVEN_REPO_URL} \
                           -Dusername=$USERNAME \
                           -Dpassword=$PASSWORD
                       """
                   }
               }
           }
       }
       stage("Build Docker Image") {
           steps {
               script {
                   withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                       sh '''
                           docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                       '''
                   }
               }
           }
       }
       stage("Push Docker Image") {
           steps {
               script {
                   withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                       sh '''
                           echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                           docker push ${IMAGE_NAME}:${IMAGE_TAG}
                       '''
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