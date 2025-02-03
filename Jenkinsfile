pipeline {
    agent any

    tools {
        nodejs "NodeJS_18"
    }

    environment {
        NETLIFY_AUTH_TOKEN = credentials('netlify_token')
        NETLIFY_SITE_ID = 'f9daabf7-0eff-4d0d-ab08-10176b22621a'
        GITHUB_TOKEN = credentials('github_token') // Store GitHub token in Jenkins credentials
        REPO_URL = "https://github.com/Navateja-gogula/Netlify.git"
        MAIN_BRANCH = "main"
        PROD_BRANCH = "prod"
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    echo "🔄 Checking out code from GitHub..."
                    sh '''
                        rm -rf Netlify || true
                        git clone -b $MAIN_BRANCH $REPO_URL Netlify || { echo "❌ Git clone failed"; exit 1; }
                        echo "✅ Code checkout complete."
                    '''
                }
            }
        }

        stage('Verify Node.js & npm') {
            steps {
                script {
                    echo "🔍 Checking Node.js and npm versions..."
                    sh '''
                        which node || { echo "❌ Node.js not found! Install it on Jenkins."; exit 1; }
                        which npm || { echo "❌ npm not found! Install it on Jenkins."; exit 1; }
                        echo "✅ Node.js Version: $(node -v)"
                        echo "✅ npm Version: $(npm -v)"
                    '''
                }
            }
        }

        stage('Clean & Install Dependencies') {
            steps {
                script {
                    sh '''
                        echo "🧹 Cleaning old dependencies..."
                        cd Netlify
                        rm -rf node_modules package-lock.json
                        echo "📦 Installing dependencies..."
                        npm install || { echo "❌ Failed to install dependencies"; exit 1; }
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh '''
                        echo "🧪 Running test cases..."
                        cd Netlify
                        npm test || { echo "❌ Tests failed"; exit 1; }
                        echo "✅ All tests passed!"
                    '''
                }
            }
        }

        stage('Create Pull Request for Production Merge') {
            steps {
                script {
                    echo "📌 Creating pull request for merging main into prod..."
                    sh '''
                        cd Netlify
                        git checkout -b temp-merge-branch
                        
                        # Set GitHub credentials to authenticate
                        git config --global user.email "ngogula@anergroup.com"
                        git config --global user.name "Navateja-gogula"
                        
                        # Update the origin URL with the GitHub token
                        git remote set-url origin https://$GITHUB_TOKEN@github.com/Navateja-gogula/Netlify.git
                        
                        git push origin temp-merge-branch

                        PR_RESPONSE=$(curl -X POST -H "Authorization: token $GITHUB_TOKEN" \
                            -H "Accept: application/vnd.github.v3+json" \
                            https://api.github.com/repos/Navateja-gogula/Netlify/pulls \
                            -d '{
                                "title": "Merge main into prod",
                                "head": "temp-merge-branch",
                                "base": "prod",
                                "body": "Auto-generated pull request for merging main into prod."
                            }')

                        echo "✅ Pull request created. Please review and merge manually."
                    '''
                }
            }
        }

        stage('Wait for PR Merge') {
            steps {
                script {
                    echo "⏳ Waiting for PR merge into prod..."
                    def prMerged = false

                    // Check PR details periodically until merged
                    while (!prMerged) {
                        // Fetch the list of open PRs
                        def prList = sh(script: 'curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/Navateja-gogula/Netlify/pulls', returnStdout: true).trim()
                        def prInfo = readJSON text: prList

                        // Check if the PR has been merged
                        prInfo.each { pr ->
                            if (pr.state == 'closed' && pr.merged == true) {
                                prMerged = true
                                echo "✅ PR merged successfully!"
                            }
                        }

                        // If not merged, wait and retry
                        if (!prMerged) {
                            echo "⏳ PR not merged yet, waiting for 1 minute..."
                            sleep 60
                        }
                    }
                }
            }
        }

        stage('Deploy to Netlify after Merge') {
            steps {
                script {
                    echo "🚀 Deploying to Netlify after PR merge..."
                    sh '''
                        git checkout $PROD_BRANCH
                        git pull origin $PROD_BRANCH
                        npm install -g netlify-cli
                        cd Netlify
                        npx netlify deploy --dir=build --prod --auth=$NETLIFY_AUTH_TOKEN --site=$NETLIFY_SITE_ID || { echo "❌ Netlify deployment failed"; exit 1; }
                        echo "✅ Deployment to Netlify successful!"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "🎉 ✅ Deployment successful!"
        }
        failure {
            echo "❌ Deployment failed! Check logs for details."
        }
    }
}
