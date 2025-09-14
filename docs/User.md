User API - Quick Reference
1️⃣ Register User

POST api/users/register

Body Example:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}


Required Fields:

name (string)

email (string, must be unique)

password (string)

2️⃣ Login User

POST api/users/login

Body Example:

{
  "email": "john@example.com",
  "password": "password123"
}


Required Fields:

email (string)

password (string)

Response Example:

{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}


Notes:

Returns JWT token for authentication

Password is never returned in the response