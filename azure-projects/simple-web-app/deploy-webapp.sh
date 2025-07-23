#!/bin/bash

# Deploy Simple Web App to Azure App Service
# This script creates and deploys a basic web application

echo "🚀 Deploying Simple Web App to Azure"
echo "===================================="

# Configuration variables
RESOURCE_GROUP="webapp-demo-rg"
LOCATION="eastus"
APP_SERVICE_PLAN="webapp-demo-plan"
WEB_APP_NAME="mywebapp-$(date +%s)"  # Unique name with timestamp
SKU="F1"  # Free tier

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Azure CLI is installed and user is logged in
check_prerequisites() {
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI is not installed!"
        exit 1
    fi
    
    if ! az account show &> /dev/null; then
        print_error "You are not logged in to Azure. Run 'az login' first."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Create sample HTML file
create_sample_app() {
    print_step "Creating sample web application"
    
    mkdir -p webapp-content
    
    cat > webapp-content/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Azure Web App</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .logo {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .info {
            background: rgba(255, 255, 255, 0.2);
            padding: 1rem;
            border-radius: 10px;
            margin-top: 2rem;
        }
        .timestamp {
            font-size: 0.9rem;
            opacity: 0.7;
            margin-top: 1rem;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        .feature {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">☁️</div>
        <h1>Welcome to Azure!</h1>
        <p>Your web application is running successfully on Azure App Service</p>
        
        <div class="info">
            <h3>🎉 Deployment Successful!</h3>
            <p>This is a sample web application deployed to Azure App Service using Azure CLI.</p>
        </div>
        
        <div class="features">
            <div class="feature">
                <h4>🚀 Scalable</h4>
                <p>Auto-scale based on demand</p>
            </div>
            <div class="feature">
                <h4>🔒 Secure</h4>
                <p>Built-in security features</p>
            </div>
            <div class="feature">
                <h4>🌍 Global</h4>
                <p>Deploy worldwide</p>
            </div>
        </div>
        
        <div class="timestamp">
            Deployed on: <span id="deployTime"></span>
        </div>
    </div>
    
    <script>
        document.getElementById('deployTime').textContent = new Date().toLocaleString();
    </script>
</body>
</html>
EOF
    
    cat > webapp-content/web.config << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <defaultDocument>
      <files>
        <clear />
        <add value="index.html" />
      </files>
    </defaultDocument>
  </system.webServer>
</configuration>
EOF
    
    print_success "Sample web application created"
}

# Create resource group
create_resource_group() {
    print_step "Creating resource group: $RESOURCE_GROUP"
    
    if az group create --name $RESOURCE_GROUP --location $LOCATION --output none; then
        print_success "Resource group created successfully"
    else
        print_warning "Resource group already exists or creation failed"
    fi
}

# Create App Service plan
create_app_service_plan() {
    print_step "Creating App Service plan: $APP_SERVICE_PLAN"
    
    if az appservice plan create \
        --name $APP_SERVICE_PLAN \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --sku $SKU \
        --output none; then
        print_success "App Service plan created successfully"
    else
        print_error "Failed to create App Service plan"
        exit 1
    fi
}

# Create web app
create_web_app() {
    print_step "Creating web app: $WEB_APP_NAME"
    
    if az webapp create \
        --name $WEB_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --plan $APP_SERVICE_PLAN \
        --output none; then
        print_success "Web app created successfully"
    else
        print_error "Failed to create web app"
        exit 1
    fi
}

# Deploy application
deploy_app() {
    print_step "Deploying application files"
    
    # Create a zip file
    cd webapp-content
    zip -r ../webapp.zip . > /dev/null
    cd ..
    
    if az webapp deployment source config-zip \
        --resource-group $RESOURCE_GROUP \
        --name $WEB_APP_NAME \
        --src webapp.zip \
        --output none; then
        print_success "Application deployed successfully"
    else
        print_error "Failed to deploy application"
        exit 1
    fi
    
    # Clean up zip file
    rm -f webapp.zip
}

# Get web app URL
get_web_app_url() {
    WEB_APP_URL=$(az webapp show \
        --name $WEB_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --query "defaultHostName" \
        --output tsv)
    
    echo ""
    print_success "Deployment completed!"
    echo "🌐 Your web app is available at: https://$WEB_APP_URL"
    echo ""
}

# Show management commands
show_management_commands() {
    print_step "Useful Management Commands"
    echo "========================="
    
    cat << EOF
# View web app details
az webapp show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP

# View web app logs
az webapp log tail --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP

# Stop the web app
az webapp stop --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP

# Start the web app
az webapp start --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP

# Scale the web app (requires higher SKU)
az appservice plan update --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --sku P1V2

# Delete the web app
az webapp delete --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP

# Delete entire resource group (removes all resources)
az group delete --name $RESOURCE_GROUP --yes --no-wait

EOF
    echo ""
}

# Cleanup function
cleanup() {
    print_step "Cleanup Options"
    echo "==============="
    
    echo "To clean up resources and avoid charges:"
    echo "1. Delete just the web app:"
    echo "   az webapp delete --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"
    echo ""
    echo "2. Delete the entire resource group (recommended):"
    echo "   az group delete --name $RESOURCE_GROUP --yes"
    echo ""
    
    read -p "Would you like to delete the resources now? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Deleting resource group: $RESOURCE_GROUP"
        if az group delete --name $RESOURCE_GROUP --yes --no-wait; then
            print_success "Resource group deletion initiated"
            echo "Note: Deletion may take a few minutes to complete"
        else
            print_error "Failed to delete resource group"
        fi
    else
        print_warning "Resources kept. Remember to delete them later!"
    fi
}

# Main execution
main() {
    check_prerequisites
    create_sample_app
    create_resource_group
    create_app_service_plan
    create_web_app
    deploy_app
    get_web_app_url
    show_management_commands
    cleanup
    
    echo ""
    print_success "Web app deployment tutorial completed! 🎉"
    echo "Visit the URL above to see your web app in action."
}

# Run the script
main