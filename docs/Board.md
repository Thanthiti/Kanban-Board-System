1️⃣ Create Board

POST api/boards

Body Example:

{
  "name": "Project Alpha"
}


Required Fields:

name (string)

2️⃣ Update Board

PATCH api/boards/:boardId

Path Parameter:

Name	Type	Required	Description
id	integer	✅	ID of the board to update

Body Example:

{
  "name": "Project Beta"
}


Optional Fields:

name (string)

Board API - Add Member
Add Member to Board

POST api/boards/:boardId/members

Description: Add one or more members to a board

Path Parameter:

Name	Type	Required	Description
boardId	integer	✅	ID of the board

Body Example:

{
  "user_id": 2,
}


Required Fields:

userIds (array of integers) → IDs of users to add

role (string) → role for the new members, e.g., "member" or "admin"

Permissions:

Only board owner can add members