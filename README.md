# aragalaya.online

this is the public repository for the aragalaya.online project, an open-source collective effort to support the aragalaya movement in sri lanka.

development environment:
https://aragalaya-online.web.app

production environment: (currently beta)
https://aragalaya.online

you can see our kanban board here,
https://trello.com/b/6ArJOe4u/aragalayaonline-kanban-board

join our discord:
https://discord.gg/dzrYm7BuDT

feel free to contact us at contact@aragalaya.online

### getting started

if you'd like to contribute, follow the below steps to set up your development environment

### software requirements

Node 18.x LTS (https://nodejs.org/en/download/)

#### get the files

```
git clone git@github.com:x-o1d/aragalaya-online.git
```

#### setup editor

install the 'Svelte for VS Code' plugin for VS Code
while any text editor should work, the official VS Code plugin provides a lot more feature

#### start dev server

go to the project root directory in a terminal and run the below commands

```
npm install
npm run dev
```

#### troubleshooting

if you run into any build issues you can try the following:

1. check node is version 18, since sveltkit 405 node 16 is no longer compatible
2. delete node_modules folder and rerun npm install
3. comment line 98 `builder.writeStatic(publicDir)` of node_modules => svelte-adapter-firebase => index.js  (this will be fixed by sveltkit-firebase-adapter 14.2)

#### start dev server with localhost backend

```
npm run setup:emulators
npm run dev:backend
npm run dev:localhost
```

now you will have a local version of the project running on localhost:3000

feel free to hack around and send us a pr!


