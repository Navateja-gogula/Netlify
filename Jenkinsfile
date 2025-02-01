pipeline {
    agent any

    environment {
        NETLIFY_AUTH_TOKEN = credentials('netlify_token')
        NETLIFY_SITE_ID = 'f9daabf7-0eff-4d0d-ab08-10176b22621a' // Your Netlify Site ID
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scmGit(branches: [[name: 'main']], 
                                    extensions: [], 
                                    userRemoteConfigs: [[url: 'https://github.com/Navateja-gogula/Netlify.git']])
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Installing dependencies..."
                    npm install
                '''
            }
        }

        stage('Build React App') {
            steps {
                sh '''
                    echo "Building the React application..."
                    npm run build
                '''
            }
        }

        stage('Deploy to Netlify') {
            steps {
                script {
                    sh '''
                        echo "Deploying to Netlify..."
                        npx netlify-cli deploy --dir=build --prod --auth $NETLIFY_AUTH_TOKEN --site $NETLIFY_SITE_ID
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
        }
        failure {
            echo "❌ Deployment failed! Check logs for details."
        }
    }
}
