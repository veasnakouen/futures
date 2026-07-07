Viewed PosGrpcClientController.java:31-39
Ran command: `.\gradlew.bat bootRun`
Viewed build.gradle:1-52

It looks like you just tried to run `.\gradlew.bat bootRun` inside the `mtp-grpc-stubs` directory! 

The reason it failed is because **`mtp-grpc-stubs` is not a runnable Spring Boot application.** It's just a shared library that compiles the `.proto` files into Java classes for your other microservices to use. Since it doesn't have a main application class or the Spring Boot plugin, the `bootRun` task doesn't exist for it.

If your goal was to rebuild those gRPC stubs and make them available to the POS and Stock services, you should run this command instead (inside the `mtp-grpc-stubs` directory):

```powershell
.\gradlew.bat clean build publishToMavenLocal
```

This will compile the stubs and publish them to your local Maven repository (`~/.m2`), allowing your other services to pick up any changes you've made to the proto files!