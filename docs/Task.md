Task API - Quick Reference
1️⃣ Create Task

POST api/tasks

Body Example:

{
  "title": "Test Task",
  "column_id": 4,
  "assigneeIds": [2,3],
  "tagIds": [1,5]
}


Required: title, column_id
Optional: description, position, dueDate, completedAt, assigneeIds, tagIds

Permissions:

Owner = Can update all fields

Assignee = Can update only tagIds

If a field is not provided = Its existing value will remain unchanged

2️⃣ Update Task

PATCH api/tasks/:id

Path Parameter:

Name	Type	Required	Description
id	integer	✅	ID of the task to update

Body Example:

{
  "title": "Updated Task",
  "column_id": 2,
  "assigneeIds": [4],
  "tagIds": [2,3]
}


Optional Fields:

title, description, column_id, position, dueDate, completedAt, assigneeIds, tagIds

Permissions:

Owner = Can update all fields

Assignee = Can update only tagIds

If a field is not provided = Its existing value will remain unchanged

Move Task

PATCH /tasks/:id/move

Description: Move a task to a different column or change its position within the same column

Path Parameter:

Name	Type	Required	Description
id	integer	✅	ID of the task to move

Body Example:

{
  "column_id": 3,
  "position": 2
}


Fields:

Field	Type	Required	Description
column_id	integer	✅	ID of the column to move the task to
position	integer	❌	New position of the task in the column (default = last position)

Permissions:

Owner = Can move task anywhere

Assignee = Cannot move task

If a field is not provided = Existing value remains