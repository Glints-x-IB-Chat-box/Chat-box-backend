# Chat Boxos

## Contributor: Ahmad Fakrozy, River Huang, Frederick Chen, Intan Adela

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

| Method | endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| GET    | `/users/get`           | get all                        |
| GET    | `/users/get/:id`       | get by:id                      |
| DELETE | `/users/delete/:id`    | delete data                    |
| PUT    | `/users/edit/:usersId` | edit users ( Fields: username, |
|        |                        | about, image,                  |
|        |                        | password, confirmPassword )    |

| Field users |
| ----------- |
| username    |
| email       |
| image       |
| about       |
| phoneNumber |
| contacts    |

### Chats

| Method | endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| GET    | `/chat/getchat`            | get all             |
| GET    | `/chat/getbyid/:chatId`    | get by Id           |
| GET    | `/gettarget/:targetUserId` | get by targetUserId |
| POST   | `/chat/postchat`           | post chat           |
| DELETE | `/chat/deletechat/:id`     | delete chat         |

| Chat field   |
| ------------ |
| senderUserId |
| targetUserId |
| messages     |
| images       |
| documents    |
| createdAt    |
| updatedAt    |

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
            "status": "pending",  //enum [pending, sent, delivered,read] default: pending
            "images": ["images.jpg"],
            "documents": [
                "CSS_My_Site_End_Results.pdf",
                "connections (1).html"
            ],
            "_id": "5eb6a992ba2c8a4cb19f153b",
            "senderUserId": "5eb25c5323285e23e9acc784",
            "message": "ini adalah pesan untuk frederick",
            "updatedAt": "2020-05-18T14:41:42.536Z",
            "createdAt": "2020-05-18T14:41:42.536Z"
        },
```

### Contact

| Method | endpoint                   | Description       |
| ------ | -------------------------- | ----------------- |
| POST   | `/contacts/addcontact`     | add contact       |
| GET    | `/contacts/get`            | get all           |
| GET    | `/contacts/get/:contactId` | get contact by Id |
| GET    | `/contacts/searchcontact`  | search contact    |
| DELETE | `/contacts/delete/:id`     | delete data       |

#### contact field

```javascript
"userContactId": {
      "image": "", //default icon empty image
      "about": "",
      "_id": "",
      "username": "",
      "email": "",
      "phoneNumber": ""
    },
```
