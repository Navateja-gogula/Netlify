pipeline {
    agent any

    environment {
        NETLIFY_AUTH_TOKEN = credentials('netlify_token')
        NETLIFY_SITE_ID = 'your-site-id' // Find this in Netlify dashboard
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-username/your-react-repo.git'
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
