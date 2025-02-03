pipeline {
    agent any

    environment {
        NETLIFY_AUTH_TOKEN = credentials('netlify_token')
        NETLIFY_SITE_ID = 'f9daabf7-0eff-4d0d-ab08-10176b22621a'
        GITHUB_TOKEN = credentials('github_token') // Store GitHub token in Jenkins credentials
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Merge Main into Prod') {
            when {
                branch 'prod'
            }
            steps {
                script {
                    echo "🔄 Merging main into prod branch..."
                    sh '''
                        git config --global user.email "ngogula@anergroup.com"
                        git config --global user.name "Navateja-gogula"
                        
                        # Fetch the latest changes
                        git fetch origin
                        
                        # Switch to prod branch
                        git checkout prod
                        
                        # Merge main into prod
                        git merge origin/main --no-ff -m "Merge main into prod"
                        
                        # Push changes to prod
                        git push origin prod
                    '''
                    echo "✅ Successfully merged main into prod!"
                }
            }
        }

        stage('Deploy to Netlify') {
            when {
                branch 'prod'
            }
            steps {
                sh '''
                    echo "🚀 Deploying to Netlify..."
                    npx netlify deploy --dir=build --auth=$NETLIFY_AUTH_TOKEN --site=$NETLIFY_SITE_ID
                '''
                echo "✅ Deployment to Netlify successful!"
            }
        }
    }

    post {
        success {
            echo '🎉 ✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed. Check logs for details.'
        }
    }
}
