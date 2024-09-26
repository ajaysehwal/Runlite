"docker run --rm -v C:/Users/ajays/code/compyl:/app -w /app/server node:14 node app.js"  // javascript
"docker run --rm -v C:/Users/ajays/code/compyl:/app -w /app/server python:3.9-slim python script.py"  // python


//java
// for compile 
 "docker run --rm -v C:/Users/ajays/code/compyl:/app -w /app/server openjdk:17-slim javac Main.java"
// for run
"docker run --rm -v C:/Users/ajays/code/compyl:/app -w /app/server openjdk:17-slim java Main"



// c++
// for compile
"docker run --rm -v C:/Users/ajays/code/compyl:/app -w /app/server gcc g++ -o output main.cpp"

// for run
"docker run --rm -v C:/Users/ajays/code/compyl:/app -w /app/server gcc ./output"