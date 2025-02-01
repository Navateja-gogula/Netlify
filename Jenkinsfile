pipeline {
    agent any

    environment {
        NETLIFY_AUTH_TOKEN = credentials('netlify_token')
        NETLIFY_SITE_ID = 'f9daabf7-0eff-4d0d-ab08-10176b22621a' // Find this in Netlify dashboard
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/Navateja-gogula/Netlify.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Netlify') {
            steps {
                sh 'npx netlify-cli deploy --dir=build --prod --auth $NETLIFY_AUTH_TOKEN --site $NETLIFY_SITE_ID'
            }
        }
    }
}
