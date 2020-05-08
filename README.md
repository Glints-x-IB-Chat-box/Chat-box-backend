# Chat Boxos

## contributor: Ahmad Fakrozy, River Huang, Frederick Chen, Intan Adela

- Database API-Schema

### Auth

| Method | endpoint          | Description                 |
| ------ | ----------------- | --------------------------- |
| POST   | `/users/register` | register with new user data |
| POST   | `/users/login`    | login with user data        |

### Users

| Method | endpoint               | Description |
| ------ | ---------------------- | ----------- |
| GET    | `/users/get`           | Get All     |
| GET    | `/users/get/:id`       | get by:id   |
| DELETE | `/users/delete/:id`    | delete data |
| PUT    | `/users/edit/:usersId` | edit users  |

### Chat

| Method | endpoint               | Description |
| ------ | ---------------------- | ----------- |
| GET    | `/chat/getchat`        | Get All     |
| POST   | `/chat/postchat`       | post chat   |
| DELETE | `/chat/deletechat/:id` | delete chat |
