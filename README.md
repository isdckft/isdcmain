# Introduction 
Demo poject. Azure-ben fut. Dockerizált legyen.
Komponensek:
isdcmain - Ez a project, Nyitóoldal, Java script, HTML. Dockerizált. Azure DEVOPS -> Azure K8S
isdcproject - Angular. Két része van. Van egy config mappa. Dockerizált, Azure DEVOPS- Helm Chartokkal, Azure KS
isdcbackend - Python, Django, Postgres SQL kell alá, még Dockerizálni kellene és átírni SQLLite-ra, mert drága a postrger

Első feladat a DEVOPS-ról áttérni githubra, mert drága a DEVOPS, pl. ,ost


# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references

# Build and Test
TODO: Describe and show how to build your code and run the tests. 
# alap package json létrehozása
npm init  
# szükséges modulok installálása

npm i --save  express
npm i --save  compile-sass
npm i --save  lodash
npm i --save  hbs
npm i --save  fs 
npm i --save  path
npm i --save  body-parser
npm i --save  mongodb


# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)

"# isdcmain" 
See here : http://www.isdckft.com
start: node server.js
"# isdcmain" 

## Make Docker image 
docker build -t isdckft/isdcmain .

## Docker RUN
docker run -p 4200:80 isdckft/isdcmain 