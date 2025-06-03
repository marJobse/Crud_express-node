# API RESTful de Frutas 🍎🍌🍍

## Sumario

- [API RESTful de Frutas 🍎🍌🍍](#api-restful-de-frutas-)
  - [Sumario](#sumario)
  - [Introducción](#introducción)
  - [Configuración](#configuración)
  - [Ejemplo `.env`](#ejemplo-env)
  - [Endpoints](#endpoints)
  - [Ejemplos de uso de los métodos HTTP](#ejemplos-de-uso-de-los-métodos-http)
    - [GET /frutas](#get-frutas)
    - [GET /frutas/:id](#get-frutasid)
    - [GET /frutas/nombre/:nombre](#get-frutasnombrenombre)
    - [GET /frutas/precio/:precio](#get-frutasprecioprecio)
    - [POST /frutas](#post-frutas)
    - [PUT /frutas/:id](#put-frutasid)
  - [Diagrama del sistema](#diagrama-del-sistema)

## Introducción

Esta API permite realizar operaciones CRUD sobre frutas almacenadas en una base de datos MongoDB.  
La URL base es:

```
http://localhost:3008/api/v1/
```

## Configuración

Para ejecutar el proyecto localmente:

1. Cloná este repositorio `git clone https://github.com/marJobse/Crud_express-node.git`
2. Instalá las dependencias con `npm install`
3. Definí el archivo `.env` con los siguientes datos:

## Ejemplo `.env`

```env
PORT=3008
MONGODB_URLSTRING=mongodb+srv://usuario:clave@cluster.mongodb.net/?retryWrites=true&w=majority
SECRET_KEY=clave_secreta
```

## Endpoints

| Método | Ruta                   | Descripción                     |
| ------ | ---------------------- | ------------------------------- |
| GET    | /frutas                | Lista todas las frutas          |
| GET    | /frutas/:id            | Devuelve una fruta por ID       |
| GET    | /frutas/nombre/:nombre | Busca frutas por nombre         |
| GET    | /frutas/precio/:precio | Busca frutas con precio ≥ valor |
| POST   | /frutas                | Agrega una nueva fruta          |
| PUT    | /frutas/:id            | Modifica una fruta existente    |
| DELETE | /frutas/:id            | Elimina una fruta por ID        |

## Ejemplos de uso de los métodos HTTP

### GET /frutas

```
http://localhost:3008/frutas
```

### GET /frutas/:id

```
http://localhost:3008/frutas/1
```

### GET /frutas/nombre/:nombre

```
http://localhost:3008/frutas/nombre/pera
```

### GET /frutas/precio/:precio

```
http://localhost:3008/frutas/precio/200
```

### POST /frutas

´´´http://localhost:3008/frutas
´´´
javascript
{
"id": 10,
"nombre": "mango",
"importe": 250
}

### PUT /frutas/:id

´´´http://localhost:3008/frutas/10
´´´

    javascript

{
"nombre": "mango maduro",
"importe": 280
}

````

### DELETE /frutas/:id

```http://localhost:3008/frutas/10
````

## Diagrama del sistema

```mermaid
graph TD
    A[Cliente Frontend] -->|Solicita| B[API REST Express]
    B -->|GET, POST, PUT, DELETE| C[Base de Datos MongoDB]
    B --> D[Middleware de Autenticación JWT]
    D --> E[auth.js y verifyToken.js]
```

---
