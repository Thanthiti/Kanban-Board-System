
## 1.Create Task
POST api/tasks

Body Example:

```json
{
  "title": "Test Task",
  "column_id": 4,
  "assigneeIds": [2,3],
  "tagIds": [1,5]
}
```

| Field       | Type    | Required / Optional | Notes                       |
| ----------- | ------- | ------------------- | --------------------------- |
| title       | string  | Required            | Task title                  |
| column\_id  | integer | Required            | ID of the column            |
| description | string  | Optional            | Task description            |
| position    | integer | Optional            | Position within the column  |
| dueDate     | date    | Optional            | Task due date               |
| completedAt | date    | Optional            | Task completion date        |
| assigneeIds | array   | Optional            | Array of user IDs to assign |
| tagIds      | array   | Optional            | Array of tag IDs            |


### Permissions

Owner = Can update all fields

Assignee = Can update only tagIds

If a field is not provided = Its existing value will remain unchanged

## 2.Update Task

PATCH api/tasks/:id

Body Example:
```json
{
  "title": "Updated Task",
  "column_id": 2,
  "assigneeIds": [4],
  "tagIds": [2,3]
}
```

Optional Fields:

| Name        | Type    | Required | Description                                     |
| ----------- | ------- | -------- | ----------------------------------------------- |
| title       | string  | ❌        | Task title (if not provided, remains unchanged) |
| column\_id  | integer | ❌        | Column ID to move the task (optional)           |
| description | string  | ❌        | Task description                                |
| position    | integer | ❌        | Position within the column                      |
| dueDate     | date    | ❌        | Task due date                                   |
| completedAt | date    | ❌        | Completion date                                 |
| assigneeIds | array   | ❌        | Array of user IDs to assign                     |
| tagIds      | array   | ❌        | Array of tag IDs                                |


### Permissions:

Owner = Can update all fields

Assignee = Can update only tagIds

If a field is not provided = Its existing value will remain unchanged

### 3.Move Task

PATCH /tasks/:id/move

Description: Move a task to a different column or change its position within the same column


Body Example:
```json
{
  "column_id": 3,
  "position": 2
}
```

| Field      | Type    | Required | Description                                                      |
| ---------- | ------- | -------- | ---------------------------------------------------------------- |
| column\_id | integer | ✅        | ID of the column to move the task to                             |
| position   | integer | ❌        | New position of the task in the column (default = last position) |


### Permissions:

Owner = Can move task anywhere

Assignee = Cannot move task

If a field is not provided = Existing value remains
