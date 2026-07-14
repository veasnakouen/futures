const fs = require('fs');
const path = require('path');

const dirs = [
  'spring-backend', 'mtp-stock-service', 'mtp-report-service', 'mtp-billing-service',
  'mtp-auth-service', 'mtp-clinic-service', 'mtp-hotel-service', 'mtp-pos-service',
  'mtp-school-service', 'mtp-api-gateway', 'mtp-discovery-server'
];

const optimizationProps = `
# Performance Optimizations
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false
spring.jpa.open-in-view=false
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000
`;

dirs.forEach(dir => {
  const propFile = path.join(__dirname, dir, 'src', 'main', 'resources', 'application.properties');

  if (fs.existsSync(propFile)) {
    let content = fs.readFileSync(propFile, 'utf8');
    content = content.replace(/spring\.jpa\.show-sql\s*=\s*true/g, 'spring.jpa.show-sql=false');
    content = content.replace(/spring\.jpa\.properties\.hibernate\.format_sql\s*=\s*true/g, 'spring.jpa.properties.hibernate.format_sql=false');
    content = content.replace(/spring\.jpa\.open-in-view\s*=\s*true/g, 'spring.jpa.open-in-view=false');

    if (!content.includes('spring.datasource.hikari.maximum-pool-size') && content.includes('spring.datasource')) {
      content += '\n' + optimizationProps;
    } else if (!content.includes('spring.jpa.show-sql')) {
      // if it's just a simple properties without JPA, don't append JPA stuff if not needed, but it doesn't hurt.
    }
    fs.writeFileSync(propFile, content);
    console.log('Optimized: ' + propFile);
  }
});
