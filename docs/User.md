## 1.Register User

POST api/users/register

Body Example:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Required Fields:
| Field    | Type   | Notes          |
| -------- | ------ | -------------- |
| name     | string | -              |
| email    | string | Must be unique |
| password | string | -              |
## 2.Login User

POST api/users/login

Body Example:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Required Fields:

| Field    | Type   | Notes          |
| -------- | ------ | -------------- |
| email    | string | - |
| password | string | -              |


## Notes:

Returns JWT token for authentication
Password is never returned in the response
