Column API - Quick Reference
1️⃣ Create Column

POST api/columns

Body Example:

{
  "name": "To Do",
  "boardId": 1
}


Required Fields:

name (string)

board_id (integer)

2️⃣ Update Column

PATCH api/columns/:columnId

Path Parameter:

Name	Type	Required	Description
id	integer	✅	ID of the column to update

Body Example:

{
  "name": "In Progress"
}


Optional Fields:

name (string)