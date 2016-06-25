June-23-2016
---
Filed a bug with Node about vm module
https://github.com/nodejs/node/issues/7397

June-22-2016
---
So I realized that building an interpreter is every enlightening but I really want a compiler.
I thought of splitting the code based but decided not to at this point.
Maybe I will have another language that is interpreted



June-21-2016
---
I want Ein to be fairly similar to Clojurescript.
A subset really.
In order to do that Ein needs to become a compiled language instead of interpreted.

The main issue is how to I keep a REPL (since that is an important feature)?

That will be my main goal for Ein 0.0.2.

Cljs seems to pass a specific environment to the REPL section of code.
(See clojurescript/script/noderepljs)

It seems to open a socket to a running node.js server and communicates though the socket.
(See around line 52 in src/main/clojure/cljs/repl/node.clj)

First step is to spawn a new Node.js process

Nevermind! there is a VM build into node.js
