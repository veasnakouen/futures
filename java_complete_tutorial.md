# Java: Complete Tutorial — Beginner to Master

> **Coverage:** Java Fundamentals → OOP → Collections → Generics → Concurrency → Streams/Lambdas → Design Patterns → Data Structures & Algorithms → Best Practices

---

## Table of Contents

1. [Introduction to Java](#1-introduction-to-java)
2. [Setting Up the Environment](#2-setting-up-the-environment)
3. [Java Basics](#3-java-basics)
4. [Control Flow](#4-control-flow)
5. [Arrays](#5-arrays)
6. [Methods](#6-methods)
7. [Object-Oriented Programming (OOP)](#7-object-oriented-programming-oop)
8. [Interfaces & Abstract Classes](#8-interfaces--abstract-classes)
9. [Exception Handling](#9-exception-handling)
10. [Java Collections Framework](#10-java-collections-framework)
11. [Generics](#11-generics)
12. [Functional Programming: Lambdas & Streams](#12-functional-programming-lambdas--streams)
13. [Concurrency & Multithreading](#13-concurrency--multithreading)
14. [File I/O & NIO](#14-file-io--nio)
15. [Design Patterns](#15-design-patterns)
16. [Data Structures (DSA)](#16-data-structures-dsa)
17. [Algorithms (DSA)](#17-algorithms-dsa)
18. [Java Memory Model & JVM Internals](#18-java-memory-model--jvm-internals)
19. [Modern Java (Java 11–21 Features)](#19-modern-java-java-1121-features)
20. [Best Practices & Clean Code](#20-best-practices--clean-code)

---

## 1. Introduction to Java

Java is a **statically typed, object-oriented, platform-independent** programming language created by James Gosling at Sun Microsystems in 1995.

### Key Characteristics

| Feature | Description |
|---|---|
| Platform Independent | "Write Once, Run Anywhere" via the JVM |
| Object-Oriented | Everything is an object (except primitives) |
| Strongly Typed | Variables must be declared with a type |
| Garbage Collected | Automatic memory management |
| Multithreaded | Built-in thread support |
| Secure | No pointers, bytecode verification |

### How Java Works

```
Source Code (.java)
       ↓  javac (compiler)
  Bytecode (.class)
       ↓  JVM (Java Virtual Machine)
  Machine Code (Platform-specific)
```

### JDK vs JRE vs JVM

- **JVM** – Java Virtual Machine: runs bytecode
- **JRE** – JVM + standard libraries (run programs)
- **JDK** – JRE + compiler + dev tools (develop programs)

---

## 2. Setting Up the Environment

### Install JDK

```bash
# macOS (Homebrew)
brew install openjdk@21

# Ubuntu/Debian
sudo apt install openjdk-21-jdk

# Windows: Download from https://adoptium.net
```

### Verify Installation

```bash
java -version
javac -version
```

### Your First Program

```java
// File: HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

```bash
javac HelloWorld.java   # Compile
java HelloWorld         # Run → Hello, World!
```

---

## 3. Java Basics

### 3.1 Variables & Data Types

#### Primitive Types

| Type | Size | Range | Example |
|---|---|---|---|
| `byte` | 1 byte | -128 to 127 | `byte b = 100;` |
| `short` | 2 bytes | -32,768 to 32,767 | `short s = 1000;` |
| `int` | 4 bytes | ~-2B to 2B | `int i = 42;` |
| `long` | 8 bytes | ~-9.2Q to 9.2Q | `long l = 99L;` |
| `float` | 4 bytes | 6-7 decimal digits | `float f = 3.14f;` |
| `double` | 8 bytes | 15-16 decimal digits | `double d = 3.14;` |
| `char` | 2 bytes | 0 to 65,535 (Unicode) | `char c = 'A';` |
| `boolean` | 1 bit | true/false | `boolean flag = true;` |

```java
// Variable declaration and initialization
int age = 25;
double salary = 75000.50;
char grade = 'A';
boolean isJavaDeveloper = true;
String name = "Veasna";  // String is a class, not a primitive

// var (type inference, Java 10+)
var message = "Hello";  // inferred as String
var count = 10;         // inferred as int
```

#### Constants

```java
final double PI = 3.14159;
final int MAX_SIZE = 100;
```

### 3.2 Type Casting

```java
// Widening (automatic, no data loss)
int i = 42;
long l = i;      // int → long
double d = i;    // int → double

// Narrowing (explicit, potential data loss)
double x = 9.99;
int y = (int) x;  // → 9 (truncated)

// String conversions
String s = String.valueOf(42);    // int → String
int n = Integer.parseInt("42");   // String → int
double dv = Double.parseDouble("3.14");
```

### 3.3 Operators

```java
// Arithmetic
int a = 10, b = 3;
System.out.println(a + b);   // 13
System.out.println(a - b);   // 7
System.out.println(a * b);   // 30
System.out.println(a / b);   // 3 (integer division)
System.out.println(a % b);   // 1 (remainder)

// Compound assignment
a += 5;   // a = a + 5
a -= 2;   // a = a - 2
a *= 3;   // a = a * 3
a /= 4;   // a = a / 4

// Increment / Decrement
int x = 5;
System.out.println(x++);  // 5 (post: use then increment)
System.out.println(++x);  // 7 (pre: increment then use)

// Comparison
System.out.println(a == b);   // false
System.out.println(a != b);   // true
System.out.println(a > b);    // true
System.out.println(a >= b);   // true

// Logical
boolean p = true, q = false;
System.out.println(p && q);   // false (AND)
System.out.println(p || q);   // true  (OR)
System.out.println(!p);       // false (NOT)

// Bitwise
System.out.println(5 & 3);    // 1  (AND)
System.out.println(5 | 3);    // 7  (OR)
System.out.println(5 ^ 3);    // 6  (XOR)
System.out.println(~5);       // -6 (NOT)
System.out.println(5 << 1);   // 10 (left shift)
System.out.println(5 >> 1);   // 2  (right shift)

// Ternary
int max = (a > b) ? a : b;
```

### 3.4 Strings

```java
String s1 = "Hello";
String s2 = "World";

// Common methods
s1.length();            // 5
s1.charAt(0);           // 'H'
s1.toUpperCase();       // "HELLO"
s1.toLowerCase();       // "hello"
s1.trim();              // removes whitespace
s1.contains("ell");     // true
s1.startsWith("He");    // true
s1.endsWith("lo");      // true
s1.indexOf("l");        // 2
s1.substring(1, 4);     // "ell"
s1.replace("l", "r");   // "Herro"
s1.split(",");          // returns String[]
String.join(", ", "a", "b", "c"); // "a, b, c"

// String comparison (always use .equals(), not ==)
String a = "Java";
String b = new String("Java");
System.out.println(a == b);       // false (reference)
System.out.println(a.equals(b));  // true  (content)
System.out.println(a.equalsIgnoreCase("java")); // true

// StringBuilder (mutable, efficient for concatenation)
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(", ");
sb.append("World");
sb.insert(5, "!");
sb.delete(5, 6);
sb.reverse();
String result = sb.toString();

// String formatting
String msg = String.format("Name: %s, Age: %d, Score: %.2f", "Veasna", 25, 98.5);
// Java 15+ text blocks
String json = """
    {
        "name": "Veasna",
        "age": 25
    }
    """;
```

---

## 4. Control Flow

### 4.1 if / else if / else

```java
int score = 85;

if (score >= 90) {
    System.out.println("A");
} else if (score >= 80) {
    System.out.println("B");
} else if (score >= 70) {
    System.out.println("C");
} else {
    System.out.println("F");
}
```

### 4.2 switch

```java
// Traditional switch
int day = 3;
switch (day) {
    case 1: System.out.println("Monday"); break;
    case 2: System.out.println("Tuesday"); break;
    case 3: System.out.println("Wednesday"); break;
    default: System.out.println("Other");
}

// Switch expression (Java 14+)
String dayName = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    default -> "Unknown";
};
```

### 4.3 Loops

```java
// for loop
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// while loop
int n = 0;
while (n < 5) {
    System.out.println(n);
    n++;
}

// do-while (executes at least once)
int x = 0;
do {
    System.out.println(x);
    x++;
} while (x < 5);

// enhanced for-each
int[] numbers = {1, 2, 3, 4, 5};
for (int num : numbers) {
    System.out.println(num);
}

// break and continue
for (int i = 0; i < 10; i++) {
    if (i == 5) break;     // exit loop
    if (i % 2 == 0) continue; // skip even
    System.out.println(i);    // prints 1, 3
}

// Labeled break (nested loops)
outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) break outer;
        System.out.println(i + "," + j);
    }
}
```

---

## 5. Arrays

```java
// Declaration and initialization
int[] arr1 = new int[5];           // default 0s
int[] arr2 = {1, 2, 3, 4, 5};
int[] arr3 = new int[]{10, 20, 30};

// Access and modify
arr1[0] = 100;
System.out.println(arr2[2]);  // 3
System.out.println(arr2.length); // 5

// 2D arrays
int[][] matrix = new int[3][3];
int[][] grid = {{1,2,3},{4,5,6},{7,8,9}};
System.out.println(grid[1][2]);  // 6

// Traverse 2D
for (int i = 0; i < grid.length; i++) {
    for (int j = 0; j < grid[i].length; j++) {
        System.out.print(grid[i][j] + " ");
    }
    System.out.println();
}

// java.util.Arrays utilities
import java.util.Arrays;
int[] nums = {5, 2, 8, 1, 9};
Arrays.sort(nums);                              // [1,2,5,8,9]
System.out.println(Arrays.toString(nums));      // [1, 2, 5, 8, 9]
int idx = Arrays.binarySearch(nums, 5);        // index of 5
int[] copy = Arrays.copyOf(nums, 3);           // [1, 2, 5]
int[] range = Arrays.copyOfRange(nums, 1, 4);  // [2, 5, 8]
Arrays.fill(nums, 0);                          // [0,0,0,0,0]
```

---

## 6. Methods

```java
public class Calculator {

    // Basic method
    public static int add(int a, int b) {
        return a + b;
    }

    // Method overloading (same name, different params)
    public static double add(double a, double b) {
        return a + b;
    }

    public static int add(int a, int b, int c) {
        return a + b + c;
    }

    // Varargs (variable arguments)
    public static int sum(int... numbers) {
        int total = 0;
        for (int n : numbers) total += n;
        return total;
    }

    // Recursion
    public static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    // Fibonacci (recursive)
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static void main(String[] args) {
        System.out.println(add(2, 3));           // 5
        System.out.println(add(2.5, 3.5));       // 6.0
        System.out.println(sum(1, 2, 3, 4, 5));  // 15
        System.out.println(factorial(5));         // 120
    }
}
```

---

## 7. Object-Oriented Programming (OOP)

OOP is built on four pillars: **Encapsulation, Inheritance, Polymorphism, Abstraction**.

### 7.1 Classes and Objects

```java
// Class definition
public class Person {
    // Fields (instance variables)
    private String name;
    private int age;
    private static int count = 0; // class-level variable

    // Constructor
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
        count++;
    }

    // No-arg constructor
    public Person() {
        this("Unknown", 0);  // calls the other constructor
    }

    // Getters and Setters (Encapsulation)
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) {
        if (age >= 0) this.age = age;  // validation
    }

    // Static method
    public static int getCount() { return count; }

    // Instance method
    public void greet() {
        System.out.println("Hi, I'm " + name + ", age " + age);
    }

    // toString override
    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }

    // equals override
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Person)) return false;
        Person other = (Person) obj;
        return age == other.age && name.equals(other.name);
    }

    // hashCode override (always override together with equals)
    @Override
    public int hashCode() {
        return java.util.Objects.hash(name, age);
    }
}

// Creating objects
public class Main {
    public static void main(String[] args) {
        Person p1 = new Person("Veasna", 25);
        Person p2 = new Person("Sophea", 30);

        p1.greet();
        System.out.println(p1);
        System.out.println(Person.getCount()); // 2

        p1.setAge(26);
        System.out.println(p1.equals(p2));     // false
    }
}
```

### 7.2 Encapsulation

Encapsulation hides internal state, exposing only what's necessary through controlled access.

```java
public class BankAccount {
    private String accountNumber;
    private double balance;

    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance >= 0 ? initialBalance : 0;
    }

    // No setter for balance — controlled via methods
    public double getBalance() { return balance; }
    public String getAccountNumber() { return accountNumber; }

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
        else throw new IllegalArgumentException("Deposit must be positive");
    }

    public void withdraw(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        if (amount > balance) throw new IllegalStateException("Insufficient funds");
        balance -= amount;
    }
}
```

### 7.3 Inheritance

```java
// Base class (superclass)
public class Animal {
    protected String name;
    protected int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void eat() {
        System.out.println(name + " is eating.");
    }

    public void sleep() {
        System.out.println(name + " is sleeping.");
    }

    public String getInfo() {
        return "Animal: " + name + ", Age: " + age;
    }
}

// Subclass (inherits Animal)
public class Dog extends Animal {
    private String breed;

    public Dog(String name, int age, String breed) {
        super(name, age);  // call parent constructor
        this.breed = breed;
    }

    // Overriding parent method
    @Override
    public String getInfo() {
        return super.getInfo() + ", Breed: " + breed;
    }

    // New method specific to Dog
    public void bark() {
        System.out.println(name + " says: Woof!");
    }
}

// Multi-level inheritance
public class GuideDog extends Dog {
    private String owner;

    public GuideDog(String name, int age, String breed, String owner) {
        super(name, age, breed);
        this.owner = owner;
    }

    public void guide() {
        System.out.println(name + " is guiding " + owner);
    }
}

// Usage
Dog dog = new Dog("Rex", 3, "Labrador");
dog.eat();       // inherited from Animal
dog.bark();      // own method
System.out.println(dog.getInfo()); // overridden method
```

### 7.4 Polymorphism

Polymorphism allows one interface to represent different underlying forms.

```java
// Runtime Polymorphism (Method Overriding)
public class Shape {
    public double area() { return 0; }
    public void draw() { System.out.println("Drawing a shape"); }
}

public class Circle extends Shape {
    private double radius;
    public Circle(double radius) { this.radius = radius; }

    @Override
    public double area() { return Math.PI * radius * radius; }

    @Override
    public void draw() { System.out.println("Drawing a circle"); }
}

public class Rectangle extends Shape {
    private double width, height;
    public Rectangle(double w, double h) { width = w; height = h; }

    @Override
    public double area() { return width * height; }

    @Override
    public void draw() { System.out.println("Drawing a rectangle"); }
}

// Polymorphic usage — parent reference, child object
Shape[] shapes = {new Circle(5), new Rectangle(4, 6), new Circle(3)};
for (Shape s : shapes) {
    s.draw();                          // dynamic dispatch
    System.out.println(s.area());      // calls correct overridden method
}

// Compile-time Polymorphism (Method Overloading)
public class Printer {
    public void print(int n)    { System.out.println("int: " + n); }
    public void print(double d) { System.out.println("double: " + d); }
    public void print(String s) { System.out.println("String: " + s); }
}

// instanceof check (Java 16+ pattern matching)
for (Shape s : shapes) {
    if (s instanceof Circle c) {
        System.out.println("Circle radius area = " + c.area());
    } else if (s instanceof Rectangle r) {
        System.out.println("Rectangle area = " + r.area());
    }
}
```

### 7.5 Access Modifiers

| Modifier | Same Class | Same Package | Subclass | Everywhere |
|---|---|---|---|---|
| `private` | ✅ | ❌ | ❌ | ❌ |
| (default) | ✅ | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ | ✅ |

### 7.6 Static Members

```java
public class MathUtils {
    public static final double PI = 3.14159;
    private static int callCount = 0;

    // Static method: belongs to class, not instance
    public static int square(int n) {
        callCount++;
        return n * n;
    }

    public static int getCallCount() { return callCount; }

    // Static initializer block
    static {
        System.out.println("MathUtils class loaded");
    }
}

// Call without creating object
System.out.println(MathUtils.PI);
System.out.println(MathUtils.square(5)); // 25
```

### 7.7 Nested & Inner Classes

```java
public class Outer {
    private int x = 10;

    // Non-static inner class
    class Inner {
        void display() {
            System.out.println("Outer x = " + x); // can access outer fields
        }
    }

    // Static nested class
    static class StaticNested {
        void display() {
            System.out.println("Static nested class");
            // cannot access x directly (no outer instance)
        }
    }

    // Local class (inside a method)
    void method() {
        class Local {
            void msg() { System.out.println("Local class"); }
        }
        new Local().msg();
    }

    // Anonymous class
    void anonymousExample() {
        Runnable r = new Runnable() {
            @Override
            public void run() {
                System.out.println("Anonymous class run");
            }
        };
        r.run();
    }
}

// Usage
Outer outer = new Outer();
Outer.Inner inner = outer.new Inner();
inner.display();

Outer.StaticNested nested = new Outer.StaticNested();
nested.display();
```

---

## 8. Interfaces & Abstract Classes

### 8.1 Abstract Classes

```java
// Abstract class: can have both abstract and concrete methods
public abstract class Vehicle {
    protected String brand;
    protected int year;

    public Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }

    // Abstract method: must be implemented by subclasses
    public abstract void startEngine();
    public abstract double fuelEfficiency();

    // Concrete method: shared behavior
    public void displayInfo() {
        System.out.println(brand + " (" + year + ")");
    }
}

public class Car extends Vehicle {
    private double mpg;

    public Car(String brand, int year, double mpg) {
        super(brand, year);
        this.mpg = mpg;
    }

    @Override
    public void startEngine() {
        System.out.println(brand + ": Vroom!");
    }

    @Override
    public double fuelEfficiency() { return mpg; }
}

public class ElectricCar extends Vehicle {
    private double range;

    public ElectricCar(String brand, int year, double range) {
        super(brand, year);
        this.range = range;
    }

    @Override
    public void startEngine() {
        System.out.println(brand + ": Silent start...");
    }

    @Override
    public double fuelEfficiency() { return range; }
}
```

### 8.2 Interfaces

```java
// Interface: pure contract (all methods public abstract by default)
public interface Drawable {
    void draw();          // abstract
    void resize(int pct); // abstract

    // Default method (Java 8+): provides default implementation
    default void display() {
        System.out.println("Displaying...");
        draw();
    }

    // Static method (Java 8+)
    static Drawable create(String type) {
        return type.equals("circle") ? new Circle(5) : new Rectangle(4, 6);
    }
}

public interface Colorable {
    void setColor(String color);
    String getColor();
}

// Multiple interface implementation
public class Circle implements Drawable, Colorable {
    private double radius;
    private String color;

    public Circle(double radius) { this.radius = radius; }

    @Override public void draw() { System.out.println("Drawing circle r=" + radius); }
    @Override public void resize(int pct) { radius *= (pct / 100.0); }
    @Override public void setColor(String c) { this.color = c; }
    @Override public String getColor() { return color; }
}

// Functional Interface (exactly one abstract method) → used with lambdas
@FunctionalInterface
public interface Transformer<T> {
    T transform(T input);
}

// Usage
Transformer<String> upper = s -> s.toUpperCase();
System.out.println(upper.transform("hello")); // HELLO
```

### 8.3 Abstract Class vs Interface

| | Abstract Class | Interface |
|---|---|---|
| Instantiation | No | No |
| Fields | Any type | Only `public static final` |
| Methods | Abstract + concrete | Abstract + default + static |
| Constructors | Yes | No |
| Extends/Implements | Can extend one class | Can implement many |
| When to use | Shared base + partial implementation | Contract / capability |

### 8.4 Enums

```java
public enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;

    public boolean isWeekend() {
        return this == SATURDAY || this == SUNDAY;
    }
}

// Enum with fields
public enum Planet {
    MERCURY(3.303e+23, 2.4397e6),
    VENUS  (4.869e+24, 6.0518e6),
    EARTH  (5.976e+24, 6.37814e6);

    private final double mass;
    private final double radius;
    static final double G = 6.67300E-11;

    Planet(double mass, double radius) {
        this.mass = mass;
        this.radius = radius;
    }

    double surfaceGravity() {
        return G * mass / (radius * radius);
    }
}

// Usage
Day today = Day.WEDNESDAY;
System.out.println(today.isWeekend()); // false

for (Day d : Day.values()) {
    System.out.println(d + " - Weekend: " + d.isWeekend());
}

// switch on enum
String type = switch (today) {
    case MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY -> "Weekday";
    case SATURDAY, SUNDAY -> "Weekend";
};
```

---

## 9. Exception Handling

### 9.1 Exception Hierarchy

```
Throwable
├── Error (JVM-level, don't catch: OutOfMemoryError, StackOverflowError)
└── Exception
    ├── Checked (must handle: IOException, SQLException)
    └── RuntimeException (unchecked: NullPointerException, ArrayIndexOutOfBoundsException)
```

### 9.2 Try-Catch-Finally

```java
public class ExceptionDemo {

    // Checked exception: must declare or handle
    public static void readFile(String path) throws java.io.IOException {
        java.io.FileReader reader = new java.io.FileReader(path);
        // read file...
        reader.close();
    }

    public static void main(String[] args) {
        // Basic try-catch
        try {
            int result = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Error: " + e.getMessage()); // / by zero
        }

        // Multiple catches
        try {
            String s = null;
            s.length();
        } catch (NullPointerException e) {
            System.out.println("Null pointer: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("General exception: " + e.getMessage());
        } finally {
            System.out.println("This always runs");
        }

        // Multi-catch (Java 7+)
        try {
            int[] arr = new int[5];
            arr[10] = 1;
        } catch (ArrayIndexOutOfBoundsException | NullPointerException e) {
            System.out.println("Array/null error: " + e.getMessage());
        }

        // Try-with-resources (auto-closes Closeable objects)
        try (java.io.BufferedReader br = new java.io.BufferedReader(
                new java.io.FileReader("file.txt"))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        } catch (java.io.IOException e) {
            System.out.println("IO Error: " + e.getMessage());
        }
    }
}
```

### 9.3 Custom Exceptions

```java
// Custom checked exception
public class InsufficientFundsException extends Exception {
    private double amount;

    public InsufficientFundsException(double amount) {
        super("Insufficient funds. Short by: " + amount);
        this.amount = amount;
    }

    public double getAmount() { return amount; }
}

// Custom unchecked exception
public class InvalidAgeException extends RuntimeException {
    public InvalidAgeException(int age) {
        super("Invalid age: " + age + ". Must be between 0 and 150.");
    }
}

// Usage
public class Bank {
    private double balance = 100.0;

    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(amount - balance);
        }
        balance -= amount;
    }
}

// Calling code
Bank bank = new Bank();
try {
    bank.withdraw(200);
} catch (InsufficientFundsException e) {
    System.out.println(e.getMessage());
    System.out.println("Short by: " + e.getAmount());
}
```

---

## 10. Java Collections Framework

```
Collection
├── List       → ArrayList, LinkedList, Vector
├── Set        → HashSet, LinkedHashSet, TreeSet
└── Queue      → LinkedList, PriorityQueue, ArrayDeque

Map            → HashMap, LinkedHashMap, TreeMap, Hashtable
```

### 10.1 List

```java
import java.util.*;

// ArrayList: dynamic array, fast random access
List<String> list = new ArrayList<>();
list.add("Java");
list.add("Python");
list.add("Go");
list.add(1, "Kotlin");      // insert at index
list.remove("Python");       // by value
list.remove(0);              // by index
list.set(0, "JavaScript");   // update
list.get(0);                 // access
list.size();                 // count
list.contains("Go");         // true/false
list.indexOf("Go");          // first occurrence
Collections.sort(list);      // sort
Collections.reverse(list);   // reverse
list.clear();                // remove all

// LinkedList: fast insert/delete at ends
LinkedList<Integer> ll = new LinkedList<>();
ll.addFirst(1);
ll.addLast(3);
ll.add(1, 2);
ll.removeFirst();
ll.removeLast();
ll.peek();       // view head without removing
ll.poll();       // remove head

// Immutable list (Java 9+)
List<String> immutable = List.of("a", "b", "c");
```

### 10.2 Set

```java
// HashSet: no duplicates, no order, O(1) operations
Set<String> set = new HashSet<>();
set.add("apple");
set.add("banana");
set.add("apple");    // duplicate ignored
set.size();          // 2
set.contains("banana"); // true
set.remove("apple");

// LinkedHashSet: insertion-order maintained
Set<String> linked = new LinkedHashSet<>();
linked.add("c");
linked.add("a");
linked.add("b");
// iteration order: c, a, b

// TreeSet: sorted order, O(log n) operations
TreeSet<Integer> tree = new TreeSet<>();
tree.add(5); tree.add(2); tree.add(8); tree.add(1);
// iteration order: 1, 2, 5, 8
tree.first();    // 1
tree.last();     // 8
tree.floor(4);   // 2 (greatest ≤ 4)
tree.ceiling(4); // 5 (smallest ≥ 4)
tree.headSet(5); // [1, 2]
tree.tailSet(5); // [5, 8]

// Set operations
Set<Integer> setA = new HashSet<>(Arrays.asList(1,2,3,4));
Set<Integer> setB = new HashSet<>(Arrays.asList(3,4,5,6));

Set<Integer> union = new HashSet<>(setA);
union.addAll(setB); // {1,2,3,4,5,6}

Set<Integer> intersection = new HashSet<>(setA);
intersection.retainAll(setB); // {3,4}

Set<Integer> difference = new HashSet<>(setA);
difference.removeAll(setB); // {1,2}
```

### 10.3 Map

```java
// HashMap: key-value pairs, O(1) avg, unordered
Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);
scores.put("Alice", 98);    // overwrites
scores.get("Alice");        // 98
scores.getOrDefault("Dave", 0); // 0 if not found
scores.containsKey("Bob");  // true
scores.containsValue(87);   // true
scores.remove("Bob");
scores.size();              // 1

// Iterate
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + " → " + entry.getValue());
}
scores.forEach((k, v) -> System.out.println(k + " → " + v));

// putIfAbsent, merge, computeIfAbsent
scores.putIfAbsent("Bob", 90);  // only adds if key absent
scores.merge("Alice", 5, Integer::sum);  // Alice = 98+5 = 103

// Compute word frequency
Map<String, Integer> freq = new HashMap<>();
String[] words = {"java", "is", "great", "java"};
for (String w : words) {
    freq.merge(w, 1, Integer::sum);
}
// {java=2, is=1, great=1}

// LinkedHashMap: insertion-order
Map<String, Integer> linked = new LinkedHashMap<>();

// TreeMap: sorted by key
Map<String, Integer> sorted = new TreeMap<>();
sorted.put("banana", 2);
sorted.put("apple", 1);
sorted.put("cherry", 3);
// iterates: apple, banana, cherry

// Immutable map (Java 9+)
Map<String, Integer> immutable = Map.of("a", 1, "b", 2);
```

### 10.4 Queue & Deque

```java
// Queue (FIFO)
Queue<String> queue = new LinkedList<>();
queue.offer("first");   // add to tail
queue.offer("second");
queue.peek();           // view head: "first"
queue.poll();           // remove head: "first"

// PriorityQueue (min-heap by default)
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(5); pq.offer(1); pq.offer(3);
pq.poll(); // 1 (smallest first)

// Max-heap
PriorityQueue<Integer> maxPQ = new PriorityQueue<>(Comparator.reverseOrder());

// Deque (double-ended queue)
Deque<String> deque = new ArrayDeque<>();
deque.addFirst("a");
deque.addLast("b");
deque.peekFirst(); // "a"
deque.pollLast();  // "b"

// Stack operations using Deque
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);  // addFirst
stack.push(2);
stack.peek();   // view top: 2
stack.pop();    // remove top: 2
```

### 10.5 Collections Utility Class

```java
List<Integer> nums = Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6);

Collections.sort(nums);               // ascending sort
Collections.sort(nums, Comparator.reverseOrder()); // descending
Collections.min(nums);                // minimum
Collections.max(nums);                // maximum
Collections.frequency(nums, 1);       // count of 1s: 2
Collections.reverse(nums);            // reverse
Collections.shuffle(nums);            // random shuffle
Collections.swap(nums, 0, 1);         // swap indices
Collections.fill(nums, 0);            // fill all with 0
Collections.unmodifiableList(nums);   // read-only view
Collections.synchronizedList(nums);   // thread-safe wrapper
```

---

## 11. Generics

Generics allow writing type-safe, reusable code.

```java
// Generic class
public class Box<T> {
    private T content;

    public Box(T content) { this.content = content; }
    public T getContent() { return content; }
    public void setContent(T content) { this.content = content; }

    @Override
    public String toString() { return "Box[" + content + "]"; }
}

Box<String> strBox = new Box<>("Hello");
Box<Integer> intBox = new Box<>(42);
System.out.println(strBox.getContent()); // Hello

// Generic method
public static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}
System.out.println(max(3, 7));       // 7
System.out.println(max("apple", "mango")); // mango

// Multiple type parameters
public class Pair<K, V> {
    private K key;
    private V value;
    public Pair(K key, V value) { this.key = key; this.value = value; }
    public K getKey() { return key; }
    public V getValue() { return value; }
}

Pair<String, Integer> pair = new Pair<>("Alice", 95);

// Bounded type parameters
public static <T extends Number> double sum(List<T> list) {
    double total = 0;
    for (T t : list) total += t.doubleValue();
    return total;
}

// Wildcards
// ? extends T → upper bound (read-only)
public static double sumList(List<? extends Number> list) {
    return list.stream().mapToDouble(Number::doubleValue).sum();
}

// ? super T → lower bound (write-safe)
public static void addNumbers(List<? super Integer> list) {
    list.add(1); list.add(2);
}

// Generic interface
public interface Repository<T, ID> {
    T findById(ID id);
    List<T> findAll();
    void save(T entity);
    void delete(ID id);
}
```

---

## 12. Functional Programming: Lambdas & Streams

### 12.1 Lambda Expressions

```java
// Lambda: (parameters) -> expression or { block }
Runnable r = () -> System.out.println("Running!");
r.run();

// With parameters
Comparator<String> comp = (a, b) -> a.compareTo(b);

// With return
java.util.function.Function<Integer, Integer> square = x -> x * x;
System.out.println(square.apply(5)); // 25

// Common functional interfaces (java.util.function)
java.util.function.Predicate<String> isLong = s -> s.length() > 5;
java.util.function.Consumer<String> printer = s -> System.out.println(s);
java.util.function.Supplier<String> greeting = () -> "Hello!";
java.util.function.BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;

// Method references
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
names.forEach(System.out::println);          // instance method ref
names.sort(String::compareTo);               // instance method ref
names.stream().map(String::toUpperCase);     // instance method ref
java.util.function.Supplier<List<String>> s = ArrayList::new;  // constructor ref
```

### 12.2 Stream API

```java
import java.util.stream.*;

List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// filter → map → collect
List<Integer> evenSquares = numbers.stream()
    .filter(n -> n % 2 == 0)            // keep evens
    .map(n -> n * n)                    // square them
    .collect(Collectors.toList());       // [4, 16, 36, 64, 100]

// reduce
int sum = numbers.stream()
    .reduce(0, Integer::sum);            // 55

// Aggregate operations
long count = numbers.stream().filter(n -> n > 5).count(); // 5
int max = numbers.stream().mapToInt(Integer::intValue).max().getAsInt(); // 10
double avg = numbers.stream().mapToInt(Integer::intValue).average().getAsDouble(); // 5.5

// sorted, distinct, limit, skip
List<Integer> result = numbers.stream()
    .filter(n -> n > 3)
    .sorted(Comparator.reverseOrder())
    .limit(4)
    .collect(Collectors.toList()); // [10, 9, 8, 7]

// flatMap: flatten nested collections
List<List<Integer>> nested = Arrays.asList(
    Arrays.asList(1, 2), Arrays.asList(3, 4), Arrays.asList(5));
List<Integer> flat = nested.stream()
    .flatMap(Collection::stream)
    .collect(Collectors.toList()); // [1,2,3,4,5]

// Collectors
List<String> words = Arrays.asList("hello", "world", "java", "stream");

String joined = words.stream().collect(Collectors.joining(", ", "[", "]"));
// "[hello, world, java, stream]"

Map<Integer, List<String>> byLength = words.stream()
    .collect(Collectors.groupingBy(String::length));
// {5=[hello, world, stream], 4=[java]}  (approx)

Map<Boolean, List<String>> partitioned = words.stream()
    .collect(Collectors.partitioningBy(w -> w.length() > 4));

// Parallel stream (multi-threaded)
long parallelSum = numbers.parallelStream()
    .mapToLong(Integer::longValue)
    .sum();

// Stream from various sources
IntStream.range(1, 6);         // 1,2,3,4,5
IntStream.rangeClosed(1, 5);   // 1,2,3,4,5
Stream.of("a", "b", "c");
Stream.generate(Math::random).limit(5);
Stream.iterate(0, n -> n + 2).limit(5); // 0,2,4,6,8
```

### 12.3 Optional

```java
import java.util.Optional;

// Avoid NullPointerException
Optional<String> name = Optional.of("Veasna");
Optional<String> empty = Optional.empty();
Optional<String> nullable = Optional.ofNullable(null);

name.isPresent();          // true
name.get();                // "Veasna"
empty.orElse("default");   // "default"
empty.orElseGet(() -> "computed"); // "computed"
name.map(String::toUpperCase);     // Optional["VEASNA"]
name.filter(n -> n.length() > 3);  // Optional["Veasna"]

// Chaining
String result = Optional.ofNullable(getUserName())
    .map(String::trim)
    .filter(s -> !s.isEmpty())
    .orElse("Anonymous");
```

---

## 13. Concurrency & Multithreading

### 13.1 Creating Threads

```java
// Method 1: Extend Thread
class MyThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(getName() + ": " + i);
        }
    }
}

// Method 2: Implement Runnable (preferred)
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " running");
    }
}

// Method 3: Lambda (Java 8+)
Thread t = new Thread(() -> System.out.println("Lambda thread"));
t.start();

// Thread methods
Thread thread = new Thread(new MyRunnable());
thread.setName("WorkerThread");
thread.setPriority(Thread.MAX_PRIORITY); // 1-10
thread.start();
thread.sleep(1000);   // sleep 1 second (static)
thread.join();        // wait for thread to finish
thread.interrupt();   // interrupt sleeping/waiting thread
thread.isAlive();     // check if running
```

### 13.2 Synchronization

```java
// Problem: Race condition
class Counter {
    private int count = 0;

    // synchronized method
    public synchronized void increment() {
        count++;
    }

    // synchronized block (finer control)
    public void decrement() {
        synchronized (this) {
            count--;
        }
    }

    public int getCount() { return count; }
}

// Using volatile (visibility, not atomicity)
class Flag {
    private volatile boolean running = true;
    public void stop() { running = false; }
    public boolean isRunning() { return running; }
}

// Atomic classes (thread-safe without locks)
import java.util.concurrent.atomic.*;
AtomicInteger atomicInt = new AtomicInteger(0);
atomicInt.incrementAndGet();     // thread-safe ++
atomicInt.compareAndSet(1, 2);   // CAS operation
```

### 13.3 Executor Framework

```java
import java.util.concurrent.*;

// Thread pool
ExecutorService executor = Executors.newFixedThreadPool(4);

for (int i = 0; i < 10; i++) {
    final int taskId = i;
    executor.submit(() -> {
        System.out.println("Task " + taskId + " on " + Thread.currentThread().getName());
    });
}
executor.shutdown();
executor.awaitTermination(5, TimeUnit.SECONDS);

// Callable: like Runnable but returns a value
Callable<Integer> callable = () -> {
    Thread.sleep(1000);
    return 42;
};

Future<Integer> future = executor.submit(callable);
Integer result = future.get(); // blocks until done

// CompletableFuture (Java 8+): async, non-blocking
CompletableFuture<String> cf = CompletableFuture
    .supplyAsync(() -> fetchData())         // async task
    .thenApply(data -> processData(data))   // transform
    .thenApply(String::toUpperCase)
    .exceptionally(ex -> "Error: " + ex.getMessage());

cf.thenAccept(System.out::println);

// Combine futures
CompletableFuture<String> f1 = CompletableFuture.supplyAsync(() -> "Hello");
CompletableFuture<String> f2 = CompletableFuture.supplyAsync(() -> " World");
CompletableFuture<String> combined = f1.thenCombine(f2, (a, b) -> a + b);
System.out.println(combined.get()); // Hello World
```

### 13.4 Locks & Conditions

```java
import java.util.concurrent.locks.*;

ReentrantLock lock = new ReentrantLock();
Condition condition = lock.newCondition();

// Explicit lock
lock.lock();
try {
    // critical section
} finally {
    lock.unlock(); // always unlock
}

// ReadWriteLock (multiple readers, exclusive writer)
ReadWriteLock rwLock = new ReentrantReadWriteLock();
rwLock.readLock().lock();
try { /* read */ } finally { rwLock.readLock().unlock(); }

rwLock.writeLock().lock();
try { /* write */ } finally { rwLock.writeLock().unlock(); }
```

### 13.5 Concurrent Collections

```java
// Thread-safe collections
ConcurrentHashMap<String, Integer> cmap = new ConcurrentHashMap<>();
CopyOnWriteArrayList<String> cowList = new CopyOnWriteArrayList<>();
BlockingQueue<String> queue = new LinkedBlockingQueue<>(10);

// Producer-Consumer pattern
queue.put("item");      // blocks if full
String item = queue.take(); // blocks if empty
```

---

## 14. File I/O & NIO

### 14.1 Traditional I/O

```java
import java.io.*;

// Writing a file
try (BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))) {
    writer.write("Hello, File!");
    writer.newLine();
    writer.write("Second line");
}

// Reading a file
try (BufferedReader reader = new BufferedReader(new FileReader("output.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}

// Byte streams
try (FileInputStream fis = new FileInputStream("image.png");
     FileOutputStream fos = new FileOutputStream("copy.png")) {
    byte[] buffer = new byte[1024];
    int bytesRead;
    while ((bytesRead = fis.read(buffer)) != -1) {
        fos.write(buffer, 0, bytesRead);
    }
}
```

### 14.2 NIO (New I/O) — Java 7+

```java
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.util.List;

Path path = Paths.get("data.txt");

// Write
Files.writeString(path, "Hello NIO!", StandardCharsets.UTF_8);
Files.write(path, List.of("line1", "line2"));

// Read
String content = Files.readString(path);
List<String> lines = Files.readAllLines(path);
byte[] bytes = Files.readAllBytes(path);

// Files utility methods
Files.exists(path);
Files.isDirectory(path);
Files.createDirectory(Paths.get("newDir"));
Files.createDirectories(Paths.get("a/b/c"));
Files.copy(path, Paths.get("copy.txt"), StandardCopyOption.REPLACE_EXISTING);
Files.move(path, Paths.get("renamed.txt"));
Files.delete(path);
Files.size(path);

// Stream lines (large files)
try (var stream = Files.lines(path)) {
    stream.filter(l -> l.contains("Java"))
          .forEach(System.out::println);
}

// Walk directory tree
Files.walk(Paths.get("src"))
     .filter(p -> p.toString().endsWith(".java"))
     .forEach(System.out::println);
```

---

## 15. Design Patterns

### 15.1 Creational Patterns

```java
// ── Singleton ──────────────────────────────────────────────────
public class Singleton {
    private static volatile Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}

// ── Builder ────────────────────────────────────────────────────
public class User {
    private final String name;     // required
    private final String email;    // required
    private final String phone;    // optional
    private final String address;  // optional

    private User(Builder builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.phone = builder.phone;
        this.address = builder.address;
    }

    public static class Builder {
        private final String name;
        private final String email;
        private String phone;
        private String address;

        public Builder(String name, String email) {
            this.name = name;
            this.email = email;
        }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public User build() { return new User(this); }
    }
}

User user = new User.Builder("Veasna", "v@email.com")
    .phone("012-345-678")
    .address("Phnom Penh")
    .build();

// ── Factory Method ─────────────────────────────────────────────
public interface Logger {
    void log(String message);
}
public class ConsoleLogger implements Logger {
    public void log(String msg) { System.out.println("[CONSOLE] " + msg); }
}
public class FileLogger implements Logger {
    public void log(String msg) { /* write to file */ }
}
public class LoggerFactory {
    public static Logger create(String type) {
        return switch (type) {
            case "console" -> new ConsoleLogger();
            case "file"    -> new FileLogger();
            default -> throw new IllegalArgumentException("Unknown: " + type);
        };
    }
}
```

### 15.2 Structural Patterns

```java
// ── Decorator ──────────────────────────────────────────────────
public interface Coffee {
    String getDescription();
    double getCost();
}
public class SimpleCoffee implements Coffee {
    public String getDescription() { return "Coffee"; }
    public double getCost() { return 1.0; }
}
public abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;
    public CoffeeDecorator(Coffee coffee) { this.coffee = coffee; }
}
public class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee c) { super(c); }
    public String getDescription() { return coffee.getDescription() + ", Milk"; }
    public double getCost() { return coffee.getCost() + 0.25; }
}
public class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee c) { super(c); }
    public String getDescription() { return coffee.getDescription() + ", Sugar"; }
    public double getCost() { return coffee.getCost() + 0.10; }
}

Coffee myCoffee = new SugarDecorator(new MilkDecorator(new SimpleCoffee()));
System.out.println(myCoffee.getDescription()); // Coffee, Milk, Sugar
System.out.println(myCoffee.getCost());        // 1.35

// ── Adapter ────────────────────────────────────────────────────
public interface MediaPlayer { void play(String file); }
public class MP3Player { public void playMP3(String file) { System.out.println("Playing MP3: " + file); } }
public class MP4Adapter implements MediaPlayer {
    private MP3Player player;
    public MP4Adapter(MP3Player p) { this.player = p; }
    public void play(String file) { player.playMP3(file); }
}
```

### 15.3 Behavioral Patterns

```java
// ── Observer ───────────────────────────────────────────────────
import java.util.*;
public interface Observer {
    void update(String event, Object data);
}
public class EventBus {
    private Map<String, List<Observer>> listeners = new HashMap<>();

    public void subscribe(String event, Observer observer) {
        listeners.computeIfAbsent(event, k -> new ArrayList<>()).add(observer);
    }
    public void publish(String event, Object data) {
        listeners.getOrDefault(event, List.of()).forEach(o -> o.update(event, data));
    }
}

// ── Strategy ───────────────────────────────────────────────────
public interface SortStrategy {
    void sort(int[] arr);
}
public class BubbleSort implements SortStrategy {
    public void sort(int[] arr) { /* bubble sort */ }
}
public class QuickSort implements SortStrategy {
    public void sort(int[] arr) { /* quicksort */ }
}
public class Sorter {
    private SortStrategy strategy;
    public Sorter(SortStrategy strategy) { this.strategy = strategy; }
    public void setStrategy(SortStrategy strategy) { this.strategy = strategy; }
    public void sort(int[] arr) { strategy.sort(arr); }
}

// ── Command ────────────────────────────────────────────────────
public interface Command { void execute(); void undo(); }
public class TextEditor {
    private StringBuilder text = new StringBuilder();
    private Deque<Command> history = new ArrayDeque<>();

    public void executeCommand(Command cmd) {
        cmd.execute();
        history.push(cmd);
    }
    public void undo() {
        if (!history.isEmpty()) history.pop().undo();
    }
}
```

---

## 16. Data Structures (DSA)

### 16.1 Linked List (Manual Implementation)

```java
public class LinkedList<T> {
    private static class Node<T> {
        T data;
        Node<T> next;
        Node(T data) { this.data = data; }
    }

    private Node<T> head;
    private int size;

    public void addFirst(T data) {
        Node<T> node = new Node<>(data);
        node.next = head;
        head = node;
        size++;
    }

    public void addLast(T data) {
        Node<T> node = new Node<>(data);
        if (head == null) { head = node; size++; return; }
        Node<T> curr = head;
        while (curr.next != null) curr = curr.next;
        curr.next = node;
        size++;
    }

    public T removeFirst() {
        if (head == null) throw new NoSuchElementException();
        T data = head.data;
        head = head.next;
        size--;
        return data;
    }

    public void reverse() {
        Node<T> prev = null, curr = head, next;
        while (curr != null) {
            next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        head = prev;
    }

    // Detect cycle (Floyd's algorithm)
    public boolean hasCycle() {
        Node<T> slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }

    public int size() { return size; }
}
```

### 16.2 Stack

```java
public class Stack<T> {
    private Object[] data;
    private int top = -1;
    private int capacity;

    public Stack(int capacity) {
        this.capacity = capacity;
        data = new Object[capacity];
    }

    public void push(T item) {
        if (top == capacity - 1) throw new RuntimeException("Stack overflow");
        data[++top] = item;
    }

    @SuppressWarnings("unchecked")
    public T pop() {
        if (isEmpty()) throw new RuntimeException("Stack underflow");
        return (T) data[top--];
    }

    @SuppressWarnings("unchecked")
    public T peek() {
        if (isEmpty()) throw new RuntimeException("Empty stack");
        return (T) data[top];
    }

    public boolean isEmpty() { return top == -1; }
    public int size() { return top + 1; }
}

// Application: balanced parentheses
public static boolean isBalanced(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') stack.push(c);
        else if (c == ')' || c == ']' || c == '}') {
            if (stack.isEmpty()) return false;
            char top = stack.pop();
            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{')) return false;
        }
    }
    return stack.isEmpty();
}
```

### 16.3 Binary Tree

```java
public class BinaryTree {
    static class Node {
        int val;
        Node left, right;
        Node(int val) { this.val = val; }
    }

    Node root;

    // Insertions (BST)
    public void insert(int val) { root = insertRec(root, val); }
    private Node insertRec(Node node, int val) {
        if (node == null) return new Node(val);
        if (val < node.val) node.left = insertRec(node.left, val);
        else if (val > node.val) node.right = insertRec(node.right, val);
        return node;
    }

    // Traversals
    public void inorder(Node node) {              // Left → Root → Right
        if (node == null) return;
        inorder(node.left);
        System.out.print(node.val + " ");
        inorder(node.right);
    }

    public void preorder(Node node) {             // Root → Left → Right
        if (node == null) return;
        System.out.print(node.val + " ");
        preorder(node.left);
        preorder(node.right);
    }

    public void postorder(Node node) {            // Left → Right → Root
        if (node == null) return;
        postorder(node.left);
        postorder(node.right);
        System.out.print(node.val + " ");
    }

    // BFS Level-order traversal
    public void levelOrder() {
        if (root == null) return;
        Queue<Node> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            Node node = q.poll();
            System.out.print(node.val + " ");
            if (node.left != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
        }
    }

    // Height of tree
    public int height(Node node) {
        if (node == null) return 0;
        return 1 + Math.max(height(node.left), height(node.right));
    }

    // Search in BST
    public boolean search(int val) { return searchRec(root, val); }
    private boolean searchRec(Node node, int val) {
        if (node == null) return false;
        if (val == node.val) return true;
        return val < node.val ? searchRec(node.left, val) : searchRec(node.right, val);
    }
}
```

### 16.4 Graph

```java
import java.util.*;

public class Graph {
    private int vertices;
    private List<List<Integer>> adjList;

    public Graph(int v) {
        vertices = v;
        adjList = new ArrayList<>();
        for (int i = 0; i < v; i++) adjList.add(new ArrayList<>());
    }

    public void addEdge(int u, int v) {
        adjList.get(u).add(v);
        adjList.get(v).add(u); // undirected
    }

    // BFS (Breadth-First Search)
    public void bfs(int start) {
        boolean[] visited = new boolean[vertices];
        Queue<Integer> queue = new LinkedList<>();
        visited[start] = true;
        queue.offer(start);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            System.out.print(node + " ");
            for (int neighbor : adjList.get(node)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }
    }

    // DFS (Depth-First Search)
    public void dfs(int start) {
        boolean[] visited = new boolean[vertices];
        dfsRec(start, visited);
    }

    private void dfsRec(int node, boolean[] visited) {
        visited[node] = true;
        System.out.print(node + " ");
        for (int neighbor : adjList.get(node)) {
            if (!visited[neighbor]) dfsRec(neighbor, visited);
        }
    }

    // Detect cycle in undirected graph
    public boolean hasCycle() {
        boolean[] visited = new boolean[vertices];
        for (int i = 0; i < vertices; i++) {
            if (!visited[i] && hasCycleUtil(i, visited, -1)) return true;
        }
        return false;
    }

    private boolean hasCycleUtil(int v, boolean[] visited, int parent) {
        visited[v] = true;
        for (int n : adjList.get(v)) {
            if (!visited[n]) {
                if (hasCycleUtil(n, visited, v)) return true;
            } else if (n != parent) return true;
        }
        return false;
    }
}
```

### 16.5 Heap (Priority Queue)

```java
// Min-Heap from scratch
public class MinHeap {
    private int[] heap;
    private int size;

    public MinHeap(int capacity) {
        heap = new int[capacity];
        size = 0;
    }

    public void insert(int val) {
        heap[size++] = val;
        heapifyUp(size - 1);
    }

    public int extractMin() {
        int min = heap[0];
        heap[0] = heap[--size];
        heapifyDown(0);
        return min;
    }

    private void heapifyUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (heap[i] < heap[parent]) {
                swap(i, parent);
                i = parent;
            } else break;
        }
    }

    private void heapifyDown(int i) {
        while (true) {
            int left = 2 * i + 1, right = 2 * i + 2, smallest = i;
            if (left < size && heap[left] < heap[smallest]) smallest = left;
            if (right < size && heap[right] < heap[smallest]) smallest = right;
            if (smallest == i) break;
            swap(i, smallest);
            i = smallest;
        }
    }

    private void swap(int i, int j) {
        int t = heap[i]; heap[i] = heap[j]; heap[j] = t;
    }

    public int size() { return size; }
}
```

### 16.6 Hash Map (Manual)

```java
public class HashMap<K, V> {
    private static final int DEFAULT_CAPACITY = 16;
    private static final double LOAD_FACTOR = 0.75;
    private Object[][] buckets;
    private int size;

    @SuppressWarnings("unchecked")
    public HashMap() { buckets = new Object[DEFAULT_CAPACITY][2]; }

    private int hash(K key) {
        return Math.abs(key.hashCode() % buckets.length);
    }

    public void put(K key, V value) {
        int idx = hash(key);
        buckets[idx][0] = key;
        buckets[idx][1] = value;
        size++;
    }

    @SuppressWarnings("unchecked")
    public V get(K key) {
        int idx = hash(key);
        if (buckets[idx][0] != null && buckets[idx][0].equals(key)) {
            return (V) buckets[idx][1];
        }
        return null;
    }

    public int size() { return size; }
}
```

---

## 17. Algorithms (DSA)

### 17.1 Sorting Algorithms

```java
public class SortingAlgorithms {

    // Bubble Sort — O(n²)
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break; // already sorted
        }
    }

    // Selection Sort — O(n²)
    public static void selectionSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            int temp = arr[minIdx]; arr[minIdx] = arr[i]; arr[i] = temp;
        }
    }

    // Insertion Sort — O(n²) avg, O(n) best
    public static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i], j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    // Merge Sort — O(n log n)
    public static void mergeSort(int[] arr, int left, int right) {
        if (left >= right) return;
        int mid = (left + right) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }

    private static void merge(int[] arr, int l, int m, int r) {
        int n1 = m - l + 1, n2 = r - m;
        int[] L = new int[n1], R = new int[n2];
        System.arraycopy(arr, l, L, 0, n1);
        System.arraycopy(arr, m + 1, R, 0, n2);
        int i = 0, j = 0, k = l;
        while (i < n1 && j < n2) arr[k++] = L[i] <= R[j] ? L[i++] : R[j++];
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }

    // Quick Sort — O(n log n) avg, O(n²) worst
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high], i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            }
        }
        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
        return i + 1;
    }

    // Heap Sort — O(n log n)
    public static void heapSort(int[] arr) {
        int n = arr.length;
        for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
            heapify(arr, i, 0);
        }
    }

    private static void heapify(int[] arr, int n, int i) {
        int largest = i, l = 2*i+1, r = 2*i+2;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest != i) {
            int t = arr[i]; arr[i] = arr[largest]; arr[largest] = t;
            heapify(arr, n, largest);
        }
    }
}
```

### 17.2 Searching Algorithms

```java
// Linear Search — O(n)
public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++)
        if (arr[i] == target) return i;
    return -1;
}

// Binary Search (sorted array) — O(log n)
public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2; // avoids overflow
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// Recursive binary search
public static int binarySearchRec(int[] arr, int target, int left, int right) {
    if (left > right) return -1;
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return binarySearchRec(arr, target, mid + 1, right);
    return binarySearchRec(arr, target, left, mid - 1);
}
```

### 17.3 Dynamic Programming

```java
// Fibonacci with memoization (top-down)
Map<Integer, Long> memo = new HashMap<>();
public long fibMemo(int n) {
    if (n <= 1) return n;
    if (memo.containsKey(n)) return memo.get(n);
    long result = fibMemo(n - 1) + fibMemo(n - 2);
    memo.put(n, result);
    return result;
}

// Fibonacci tabulation (bottom-up) — O(n)
public long fibDP(int n) {
    if (n <= 1) return n;
    long[] dp = new long[n + 1];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}

// 0/1 Knapsack — O(n * W)
public int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i-1][w]; // skip item
            if (weights[i-1] <= w) {
                dp[i][w] = Math.max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1]);
            }
        }
    }
    return dp[n][capacity];
}

// Longest Common Subsequence — O(m * n)
public int lcs(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i-1) == s2.charAt(j-1)) dp[i][j] = dp[i-1][j-1] + 1;
            else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}

// Coin Change (minimum coins) — O(amount * coins.length)
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
```

### 17.4 Algorithm Complexity Cheat Sheet

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |
| Binary Search | O(1) | O(log n) | O(log n) | O(1) |
| BFS/DFS | — | O(V+E) | O(V+E) | O(V) |

---

## 18. Java Memory Model & JVM Internals

### JVM Architecture

```
┌───────────────────────────────────────────────────┐
│                      JVM                          │
│  ┌─────────────────────────────────────────────┐  │
│  │            Runtime Data Areas               │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │
│  │  │  Method  │  │   Heap   │  │  Stack   │  │  │
│  │  �