# Azure Learning Resources 🚀

Welcome to your comprehensive Azure learning toolkit! This repository contains everything you need to start learning Microsoft Azure from scratch, with hands-on examples, practical scripts, and structured learning paths.

## 📁 Repository Structure

```
azure-learning/
├── azure-learning-guide.md          # Complete learning guide and roadmap
├── azure-setup-scripts/             # Installation and setup scripts
│   ├── install-azure-cli.sh         # Azure CLI installation for Linux
│   └── azure-quickstart.sh          # Interactive Azure CLI tutorial
├── azure-projects/                  # Hands-on project examples
│   └── simple-web-app/
│       └── deploy-webapp.sh         # Deploy a web app to Azure
└── README.md                        # This file
```

## 🎯 Quick Start

### 1. Install Azure CLI
```bash
# Make the script executable and run it
chmod +x azure-setup-scripts/install-azure-cli.sh
./azure-setup-scripts/install-azure-cli.sh
```

### 2. Login to Azure
```bash
az login
```

### 3. Run the Interactive Tutorial
```bash
# Get hands-on experience with Azure CLI
./azure-setup-scripts/azure-quickstart.sh
```

### 4. Deploy Your First Web App
```bash
# Deploy a sample web application to Azure
./azure-projects/simple-web-app/deploy-webapp.sh
```

## 📚 Learning Resources

### 🎓 Phase 1: Foundation (Weeks 1-2)
- Read the complete [Azure Learning Guide](azure-learning-guide.md)
- Complete [Azure Fundamentals (AZ-900)](https://learn.microsoft.com/training/paths/az-900-describe-cloud-concepts/)
- Set up your Azure free account
- Familiarize yourself with the Azure portal

### 🛠️ Phase 2: Hands-on Practice (Weeks 3-8)
- Work through the practical scripts in this repository
- Deploy sample applications
- Explore core Azure services:
  - Virtual Machines
  - App Services
  - Storage Accounts
  - SQL Databases
  - Virtual Networks

### 🏗️ Phase 3: Real Projects (Weeks 9-16)
- Build and deploy full applications
- Implement security best practices
- Learn monitoring and optimization
- Prepare for Azure certifications

## 🔧 Prerequisites

- **Operating System**: Linux (Ubuntu/Debian/CentOS/RHEL)
- **Basic Knowledge**: 
  - Command line basics
  - Basic networking concepts
  - Basic web development (helpful but not required)
- **Tools Needed**:
  - Terminal/Shell access
  - Text editor (VS Code recommended)
  - Web browser

## 💰 Cost Management

### Azure Free Account Benefits:
- **$200 credit** for 30 days
- **12 months free** for popular services
- **Always free** services with monthly limits

### Cost-Saving Tips:
1. Always delete resources after testing
2. Use the free tier (F1) for App Services
3. Monitor your spending in the Azure portal
4. Set up billing alerts
5. Use Azure Cost Management tools

## 📖 Essential Azure Services to Learn

### Compute Services
- **Azure Virtual Machines**: Infrastructure as a Service
- **Azure App Service**: Platform as a Service for web apps
- **Azure Functions**: Serverless computing
- **Azure Container Instances**: Containerized applications

### Storage Services
- **Azure Storage Account**: Object storage, file shares, queues
- **Azure SQL Database**: Managed relational database
- **Azure Cosmos DB**: NoSQL database service

### Networking
- **Azure Virtual Network**: Private network in Azure
- **Azure Load Balancer**: Distribute traffic across resources
- **Azure Application Gateway**: Web traffic load balancer

### Security & Identity
- **Azure Active Directory**: Identity and access management
- **Azure Key Vault**: Secure storage for keys and secrets
- **Azure Security Center**: Security monitoring and recommendations

## 🎯 Certification Path

### Beginner
- **AZ-900**: Azure Fundamentals
  - Validates foundational knowledge of cloud services
  - Great starting point for non-technical roles

### Intermediate
- **AZ-104**: Azure Administrator Associate
  - Focus: Managing Azure subscriptions and resources
  - Prerequisites: 6+ months hands-on experience

- **AZ-204**: Azure Developer Associate
  - Focus: Developing solutions that use Azure services
  - Prerequisites: 1-2 years development experience

### Advanced
- **AZ-305**: Azure Solutions Architect Expert
  - Focus: Designing Azure solutions
  - Prerequisites: AZ-104 or AZ-204 + advanced experience

## 📝 Study Tips

1. **Hands-on Practice**: Use the free tier and build real projects
2. **Microsoft Learn**: Complete the official training modules
3. **Documentation**: Read Azure documentation regularly
4. **Community**: Join Azure communities and forums
5. **Practice Exams**: Use official Microsoft practice tests
6. **Real Projects**: Build a portfolio of Azure projects

## 🌐 Useful Links

### Official Resources
- [Azure Portal](https://portal.azure.com/)
- [Azure Documentation](https://docs.microsoft.com/azure/)
- [Microsoft Learn](https://learn.microsoft.com/azure/)
- [Azure Architecture Center](https://docs.microsoft.com/azure/architecture/)

### Community & Tools
- [Azure CLI Documentation](https://docs.microsoft.com/cli/azure/)
- [Azure PowerShell](https://docs.microsoft.com/powershell/azure/)
- [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)
- [Visual Studio Code Azure Extensions](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

### Practice & Learning
- [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/)
- [Microsoft Learn Sandbox](https://learn.microsoft.com/training/)
- [Azure DevTest Labs](https://azure.microsoft.com/services/devtest-lab/)

## 🤝 Contributing

Feel free to contribute to this learning resource by:
- Adding new scripts or examples
- Improving documentation
- Sharing learning tips and resources
- Reporting issues or suggestions

## ⚠️ Important Notes

1. **Always clean up resources** after testing to avoid unexpected charges
2. **Never commit secrets** or credentials to version control
3. **Use meaningful names** for resources to stay organized
4. **Monitor your Azure spending** regularly
5. **Follow security best practices** from day one

## 🆘 Getting Help

- **Azure Support**: Available in the Azure portal
- **Stack Overflow**: Tag your questions with `azure`
- **Microsoft Q&A**: [https://docs.microsoft.com/answers/](https://docs.microsoft.com/answers/)
- **Azure Community**: [https://techcommunity.microsoft.com/azure](https://techcommunity.microsoft.com/azure)

---

**Happy Learning!** 🎉

Start your Azure journey today and build the cloud skills that are in high demand. Remember, the best way to learn Azure is by doing - so don't just read about it, build with it!

*Last updated: January 2025*
