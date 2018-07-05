# HungryRabbit

Prototype WebSocket Multiplayer Game

Mobile Player : https://hungry-rabbit.herokuapp.com
Game Dashboard : https://hungry-rabbit.herokuapp.com/dashboard

# Installation

### Development

* `npm install`
* `npm run dev` runs the development environment using webpack-dev-server + hot reload

### Deployment

* `npm run dist` builds the production distribution package for JS, CSS and other assets
* `npm run start` start-up script

# Requests And Responses


### Connect User

###### Request
```js
socket.connect({HOST}, data)
```
```json
{
  "name": "Nyan"
}
```

### Query User

###### Request
```js
socket.emit('query', data)
```
```json
data = {
  "type": "user"
}
```
###### Response
```js
socket.on('query', callback)
```
```json
{
  "type": "user",
  "data": {
    "name": "Nyan"
  }
}
```

### Query Instance
###### Request
```js
socket.emit('query', data)
```
```json
data = {
  "type": "instance",
  "id"  : "QWERTY"
}
```
###### Response
```js
socket.on('query', callback)
```
```json
{
  "type": "instance",
  "data": {
    "id"    : "QWERTY",
    "status": "waiting",
    "users" : []
  }
}
```

### Join Instance
###### Request
```js
socket.emit('join', data)
```
```json
data = {
  "id": "QWERTY"
}
```
###### Response
```js
socket.on('query', data)
```

### Speak Instance
###### Request
```js
socket.emit('speak', data)
```
```json
data = {
  "message": "Hello!"
}
```
###### Response
```js
socket.on('speak', callback)
```
```json
{
  "name"  : "Nyan",
  "message: "Hello!"
}
```

### Act Instance
###### Request
```js
socket.emit('action', data)
```
```json
data = {
  "action": "tap"
}
```
###### Response
```js
socket.on('action', callback)
```
```json
{
  "name"  : "Nyan",
  "action": "tap"
}
```

### Leave Instance
###### Request
```js
socket.emit('leave', data)
```
```json
data: {
  "id": "QWERTY"
}
```
###### Response
```js
socket.on('query', data)
```
