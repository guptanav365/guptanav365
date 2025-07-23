#!/bin/bash

# Azure Quickstart Script
# This script demonstrates common Azure CLI operations for beginners

echo "🌟 Azure CLI Quickstart Guide"
echo "============================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if Azure CLI is installed
check_azure_cli() {
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI is not installed!"
        echo "Please run the install-azure-cli.sh script first."
        exit 1
    fi
    print_success "Azure CLI is installed"
}

# Function to check login status
check_login() {
    if ! az account show &> /dev/null; then
        print_warning "You are not logged in to Azure"
        echo "Please run 'az login' to authenticate"
        echo "Then run this script again"
        exit 1
    fi
    print_success "You are logged in to Azure"
}

# Function to show account information
show_account_info() {
    print_step "Current Azure Account Information"
    echo "================================"
    
    # Show current subscription
    SUBSCRIPTION_NAME=$(az account show --query "name" -o tsv)
    SUBSCRIPTION_ID=$(az account show --query "id" -o tsv)
    USER_NAME=$(az account show --query "user.name" -o tsv)
    
    echo "👤 User: $USER_NAME"
    echo "📋 Subscription: $SUBSCRIPTION_NAME"
    echo "🆔 Subscription ID: $SUBSCRIPTION_ID"
    echo ""
}

# Function to list available locations
list_locations() {
    print_step "Available Azure Regions (Top 10)"
    echo "==============================="
    az account list-locations --query "[?not_null(displayName)] | [0:10].{Region:name, DisplayName:displayName}" -o table
    echo ""
}

# Function to create a resource group
create_resource_group() {
    print_step "Creating a Resource Group"
    echo "========================="
    
    RESOURCE_GROUP="azure-learning-rg"
    LOCATION="eastus"
    
    echo "Creating resource group: $RESOURCE_GROUP in $LOCATION"
    
    if az group create --name $RESOURCE_GROUP --location $LOCATION &> /dev/null; then
        print_success "Resource group '$RESOURCE_GROUP' created successfully"
    else
        print_warning "Resource group '$RESOURCE_GROUP' already exists or creation failed"
    fi
    echo ""
}

# Function to create a storage account
create_storage_account() {
    print_step "Creating a Storage Account"
    echo "=========================="
    
    STORAGE_NAME="azurelearning$(date +%s)"  # Adding timestamp to make it unique
    RESOURCE_GROUP="azure-learning-rg"
    
    echo "Creating storage account: $STORAGE_NAME"
    
    if az storage account create \
        --name $STORAGE_NAME \
        --resource-group $RESOURCE_GROUP \
        --location eastus \
        --sku Standard_LRS \
        --kind StorageV2 &> /dev/null; then
        print_success "Storage account '$STORAGE_NAME' created successfully"
        echo "Storage account name: $STORAGE_NAME"
    else
        print_error "Failed to create storage account"
    fi
    echo ""
}

# Function to list resources
list_resources() {
    print_step "Listing Resources in Resource Group"
    echo "==================================="
    
    RESOURCE_GROUP="azure-learning-rg"
    
    if az group exists --name $RESOURCE_GROUP | grep -q "true"; then
        echo "Resources in '$RESOURCE_GROUP':"
        az resource list --resource-group $RESOURCE_GROUP --query "[].{Name:name, Type:type, Location:location}" -o table
    else
        print_warning "Resource group '$RESOURCE_GROUP' does not exist"
    fi
    echo ""
}

# Function to show useful Azure CLI commands
show_useful_commands() {
    print_step "Useful Azure CLI Commands"
    echo "========================="
    
    cat << 'EOF'
# Account Management
az login                                    # Login to Azure
az logout                                   # Logout from Azure
az account list                            # List all subscriptions
az account show                            # Show current subscription
az account set --subscription <id>        # Set active subscription

# Resource Groups
az group list                              # List all resource groups
az group create --name <name> --location <location>  # Create resource group
az group delete --name <name>              # Delete resource group
az group show --name <name>                # Show resource group details

# Virtual Machines
az vm list                                 # List all VMs
az vm create --resource-group <rg> --name <name> --image <image>  # Create VM
az vm start --resource-group <rg> --name <name>     # Start VM
az vm stop --resource-group <rg> --name <name>      # Stop VM
az vm delete --resource-group <rg> --name <name>    # Delete VM

# Storage
az storage account list                    # List storage accounts
az storage account create --name <name> --resource-group <rg>  # Create storage
az storage blob list --account-name <name> --container-name <container>  # List blobs

# Networking
az network vnet list                       # List virtual networks
az network vnet create --resource-group <rg> --name <name>  # Create VNet
az network nsg list                        # List network security groups

# Web Apps
az webapp list                             # List web apps
az webapp create --resource-group <rg> --plan <plan> --name <name>  # Create web app

# Help and Documentation
az --help                                  # General help
az <command> --help                        # Help for specific command
az find "keyword"                          # Find commands containing keyword

EOF
    echo ""
}

# Function to show next steps
show_next_steps() {
    print_step "Next Steps in Your Azure Learning Journey"
    echo "========================================"
    
    cat << 'EOF'
1. 🎓 Start with Azure Fundamentals (AZ-900)
   - Visit: https://learn.microsoft.com/training/paths/az-900-describe-cloud-concepts/

2. 🧪 Try hands-on labs
   - Microsoft Learn Sandbox: https://learn.microsoft.com/training/
   - Azure Quickstart Templates: https://azure.microsoft.com/resources/templates/

3. 🏗️ Build projects
   - Deploy a simple web app
   - Create a virtual machine
   - Set up a database

4. 📚 Study resources
   - Azure Documentation: https://docs.microsoft.com/azure/
   - Azure Architecture Center: https://docs.microsoft.com/azure/architecture/

5. 🎯 Plan your certification path
   - AZ-900: Azure Fundamentals
   - AZ-104: Azure Administrator
   - AZ-204: Azure Developer

6. 🤝 Join the community
   - Azure Community: https://techcommunity.microsoft.com/azure
   - Reddit r/AZURE: https://reddit.com/r/AZURE

EOF
    echo ""
}

# Function to cleanup resources (optional)
cleanup_resources() {
    print_step "Cleanup Resources (Optional)"
    echo "============================"
    
    read -p "Do you want to delete the demo resources created? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        RESOURCE_GROUP="azure-learning-rg"
        print_warning "Deleting resource group: $RESOURCE_GROUP"
        print_warning "This will delete ALL resources in the group!"
        
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if az group delete --name $RESOURCE_GROUP --yes --no-wait; then
                print_success "Resource group deletion initiated"
                echo "Note: Deletion may take a few minutes to complete"
            else
                print_error "Failed to delete resource group"
            fi
        else
            echo "Cleanup cancelled"
        fi
    else
        echo "Keeping demo resources"
        print_warning "Remember to delete them later to avoid charges!"
    fi
    echo ""
}

# Main execution
main() {
    check_azure_cli
    check_login
    show_account_info
    list_locations
    create_resource_group
    create_storage_account
    list_resources
    show_useful_commands
    show_next_steps
    cleanup_resources
    
    print_success "Azure quickstart completed!"
    echo "Happy learning! 🚀"
}

# Run the script
main