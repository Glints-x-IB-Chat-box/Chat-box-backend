# Chat Boxos

## contributor: Ahmad Fakrozy, River Huang, Frederick Chen, Intan Adela

- Database API-Schema

### Auth

| Method | endpoint          | Description                 |
| ------ | ----------------- | --------------------------- |
| POST   | `/users/register` | register with new user data |
| POST   | `/users/login`    | register with new user data |

| Field register  |
| --------------- |
| username        |
| email           |
| phoneNumber     |
| password        |
| confirmPassword |

| Field login                    |
| ------------------------------ |
| username / email / phoneNumber |
| password                       |

### Users

| Method | endpoint               | Description |
| ------ | ---------------------- | ----------- |
| GET    | `/users/get`           | get all     |
| GET    | `/users/get/:id`       | get by:id   |
| DELETE | `/users/delete/:id`    | delete data |
| PUT    | `/users/edit/:usersId` | edit users  |

| Field users |
| ----------- |
| username    |
| email       |
| image       |
| about       |
| phoneNumber |

### Chats

| Method | endpoint               | Description |
| ------ | ---------------------- | ----------- |
| GET    | `/chat/getchat`        | get all     |
| POST   | `/chat/postchat`       | post chat   |
| DELETE | `/chat/deletechat/:id` | delete chat |

| Chat field   |
| ------------ |
| senderUserId |
| targetUserId |
| message      |
| image        |

#### chat field

```javascript
"usersId": [
      "5eb256f023285e23e9acc781",
      "5eb25c5323285e23e9acc784"
    ],
    "_id": "5eb43a744831d42c20d243c1",
    "__v": 0,
    "messages": [
      {
        "status": "pending",
        "time": 1588869740608,
        "_id": "5eb43a746ddd16272266dcf9",
        "senderUserId": "5eb256f023285e23e9acc781",
        "message": "ini adalah pesan untuk chat test22"
      },
```

### Contact

| Method | endpoint               | Description |
| ------ | ---------------------- | ----------- |
| POST   | `/contacts/addcontact` | add contact |
| GET    | `/contacts/get`        | get all     |
| GET    | `/contacts/get/:id`    | get by:id   |
| DELETE | `/contacts/delete/:id` | delete data |

#### contact field

```javascript
"_id": "",
"userId": {
      "image": "",
      "about": "",
      "_id": "",
      "username": "",
      "email": "",
      "phoneNumber": ""
    },
```
