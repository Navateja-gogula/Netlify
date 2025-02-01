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

        stage('Setup Node.js') {
            steps {
                script {
                    echo "Checking Node.js and npm versions..."
                    sh '''
                        if ! command -v node &> /dev/null
                        then
                            echo "❌ Node.js is not installed! Install it on Jenkins."
                            exit 1
                        fi
                        if ! command -v npm &> /dev/null
                        then
                            echo "❌ npm is not installed! Install it on Jenkins."
                            exit 1
                        fi
                        echo "✅ Node.js Version: $(node -v)"
                        echo "✅ npm Version: $(npm -v)"
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh '''
                        echo "Installing dependencies..."
                        npm install || { echo "❌ Failed to install dependencies"; exit 1; }
                    '''
                }
            }
        }

        stage('Build React App') {
            steps {
                script {
                    sh '''
                        echo "Building the React application..."
                        npm run build || { echo "❌ Build failed"; exit 1; }
                    '''
                }
            }
        }

        stage('Deploy to Netlify') {
            steps {
                script {
                    sh '''
                        echo "Deploying to Netlify..."
                        npx netlify-cli deploy --dir=build --prod --auth $NETLIFY_AUTH_TOKEN --site $NETLIFY_SITE_ID || { echo "❌ Netlify deployment failed"; exit 1; }
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
