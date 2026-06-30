const fs = require('fs');
const path = require('path');

const stockDir = 'd:/Download/FuturesSystem2023-Mar-22/mtp-stock-service/src/main/java/com/mtp/stock';
const backendDir = 'd:/Download/FuturesSystem2023-Mar-22/spring-backend/src/main/java/com/mtp/api';

// 1. Copy CloudinaryConfig
const cloudConfigSrc = path.join(backendDir, 'config/CloudinaryConfig.java');
const cloudConfigDest = path.join(stockDir, 'config/CloudinaryConfig.java');

fs.mkdirSync(path.dirname(cloudConfigDest), { recursive: true });
let cloudConfig = fs.readFileSync(cloudConfigSrc, 'utf8');
cloudConfig = cloudConfig.replace(/package com\.mtp\.api\.config;/, 'package com.mtp.stock.config;');
fs.writeFileSync(cloudConfigDest, cloudConfig, 'utf8');
console.log('Copied CloudinaryConfig.java');

// 2. Fix UserStub
const userStubPath = path.join(stockDir, 'models/stubs/UserStub.java');
if (fs.existsSync(userStubPath)) {
    let userStub = fs.readFileSync(userStubPath, 'utf8');
    userStub = userStub.replace(/@Table\(name = "Users"\)/, '@Table(name = "AspNetUsers")');
    userStub = userStub.replace(/@GeneratedValue\(strategy = GenerationType\.IDENTITY\)/, '@GeneratedValue(strategy = GenerationType.UUID)\n    @Column(name = "Id", length = 128, columnDefinition = "nvarchar(128)")');
    fs.writeFileSync(userStubPath, userStub, 'utf8');
    console.log('Fixed UserStub.java');
}

console.log('Startup fixes applied!');
