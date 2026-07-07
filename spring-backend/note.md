To run your new Java Spring Boot project, follow these simple steps in your terminal:

1. Open your terminal in the backend folder
Make sure your terminal is inside the spring-backend directory:
```cmd
cd d:\Download\FuturesSystem2023-Mar-22\spring-backend
```
2. Run the project using Gradle
Run the following command. It will compile your code and start the web server:
```cmd
.\gradlew.bat bootRun
```
3. Open the frontend
Open your browser and go to:
```
http://localhost:5173/
```

### Lombok
If you are seeing errors about Lombok, you need to enable the Lombok plugin in IntelliJ IDEA:
```cmd
Settings/Preferences → Editor → Plugins → Marketplace
```
Search for "Lombok" and install it. Restart the IDE.

### Connect to H2 Database
Connect to the H2 database using the following credentials:
```cmd
Username: sa
Password: [PASSWORD]
URL: jdbc:h2:~/test
```
### Connect to PostgreSQL
Connect to the PostgreSQL database using the following credentials:
```cmd
Username: postgres
Password: [PASSWORD]
URL: jdbc:h2:~/test
```
### Connect to MySQL
Connect to the MySQL database using the following credentials:
```cmd
Username: root
Password: [PASSWORD]
URL: jdbc:mysql://localhost:3306/futures
```
### Connect to SQLServer
Connect to the SQLServer database using the following credentials:
```cmd
Username: sa
Password: [PASSWORD]
URL: jdbc:sqlserver://localhost:1433;databaseName=futures
```
### Connect to Oracle Database
Connect to the Oracle database using the following credentials:
```cmd
Username: sa
Password: [PASSWORD]
URL: jdbc:oracle:thin:sa/sa@localhost:1521/futures
```
### Connect to MongoDB
Connect to the MongoDB database using the following credentials:
```cmd
Username: sa
Password: [PASSWORD]
URL: jdbc:mongodb://localhost:27017/futures
``` 
### Connect to Redis
Connect to the Redis database using the following credentials:
```cmd
Username: sa
Password: [PASSWORD]
URL: jdbc:redis://localhost:6379/futures
```
### Connect to RabbitMQ
Connect to the RabbitMQ database using the following credentials:
```cmd
Username: sa
Password: [PASSWORD]
URL: jdbc:rabbitmq://localhost:5672/futures
```
### Connect to Docker
Connect to the Docker database using the following credentials:
```cmd
Username: sa
Password: [PASSWORD]
URL: jdbc:docker://localhost:5672/futures
```  
### Connect to Kafka
Connect to the Kafka database using the following credentials:
```cmd
Username: sa
Password: [PASSWORD]
URL: jdbc:kafka://localhost:9092/futures
```
### Connect to ElasticSearch
Connect to the ElasticSearch database using the following credentials:
```cmd
Username: sa
Password: [PASSWORD]
URL: jdbc:elasticsearch://localhost:9200/futures
```
### Connect to MinIO
Connect to the MinIO database using the following credentials:
```cmd
Username: sa
Password: [PASSWORD]
URL: jdbc:minio://localhost:9000/futures
```   
### Connect to MongoDB
Connect to the MongoDB database using the following credentials:
```cmd
Username: sa
Password: [PASSWORD]
URL: jdbc:mongodb://localhost:27017/futures
```    
### Connect to SQLite
Connect to the SQLite database using the following credentials:
```cmd
Username: sa
Password: [PASSWORD]
URL: jdbc:sqlite:futures.db
```
### Connect to Firebase
Connect to the Firebase database using the following credentials:
```cmd
Username: sa
Password: [PASSWORD]
URL: jdbc:firebase://localhost:5000/futures
```   

### KPI
```
KPI stands for Key Performance Indicator. It is a quantifiable metric used by organizations to evaluate success, track progress toward specific goals, and guide data-driven decision-making. Essentially, it measures how effectively a company, team, or individual is achieving their primary objectives.
```