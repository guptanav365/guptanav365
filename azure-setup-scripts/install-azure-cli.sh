#!/bin/bash

# Azure CLI Installation Script for Linux
# This script installs the Azure CLI on Ubuntu/Debian and CentOS/RHEL systems

echo "🚀 Starting Azure CLI Installation..."

# Function to detect the Linux distribution
detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    elif type lsb_release >/dev/null 2>&1; then
        OS=$(lsb_release -si)
        VER=$(lsb_release -sr)
    else
        OS=$(uname -s)
        VER=$(uname -r)
    fi
}

# Function to install Azure CLI on Ubuntu/Debian
install_ubuntu_debian() {
    echo "📦 Installing Azure CLI on Ubuntu/Debian..."
    
    # Update package index
    sudo apt-get update
    
    # Install required packages
    sudo apt-get install -y ca-certificates curl apt-transport-https lsb-release gnupg
    
    # Download and install Microsoft signing key
    curl -sL https://packages.microsoft.com/keys/microsoft.asc |
        gpg --dearmor |
        sudo tee /etc/apt/trusted.gpg.d/microsoft.gpg > /dev/null
    
    # Add Azure CLI software repository
    AZ_REPO=$(lsb_release -cs)
    echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ $AZ_REPO main" |
        sudo tee /etc/apt/sources.list.d/azure-cli.list
    
    # Update repository information and install Azure CLI
    sudo apt-get update
    sudo apt-get install -y azure-cli
}

# Function to install Azure CLI on CentOS/RHEL
install_centos_rhel() {
    echo "📦 Installing Azure CLI on CentOS/RHEL..."
    
    # Import Microsoft repository key
    sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
    
    # Add Azure CLI repository
    sudo sh -c 'echo -e "[azure-cli]
name=Azure CLI
baseurl=https://packages.microsoft.com/yumrepos/azure-cli
enabled=1
gpgcheck=1
gpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/azure-cli.repo'
    
    # Install Azure CLI
    sudo yum install -y azure-cli
}

# Function to install via curl (universal method)
install_curl() {
    echo "📦 Installing Azure CLI via curl..."
    curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
}

# Main installation logic
main() {
    detect_distro
    
    echo "🔍 Detected OS: $OS"
    
    case "$OS" in
        "Ubuntu"* | "Debian"*)
            install_ubuntu_debian
            ;;
        "CentOS"* | "Red Hat"* | "Fedora"*)
            install_centos_rhel
            ;;
        *)
            echo "⚠️  Unsupported distribution. Trying universal curl method..."
            install_curl
            ;;
    esac
    
    # Verify installation
    if command -v az &> /dev/null; then
        echo "✅ Azure CLI installed successfully!"
        echo "📝 Version: $(az version -o tsv --query '"azure-cli"')"
        echo ""
        echo "🎯 Next steps:"
        echo "1. Run 'az login' to authenticate with Azure"
        echo "2. Run 'az account list' to see your subscriptions"
        echo "3. Run 'az account set --subscription <subscription-id>' to set active subscription"
        echo ""
        echo "📚 Quick help: 'az --help' or visit https://docs.microsoft.com/cli/azure/"
    else
        echo "❌ Installation failed. Please check the error messages above."
        exit 1
    fi
}

# Run the installation
main