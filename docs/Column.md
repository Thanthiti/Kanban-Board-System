
## 1.Create Column

POST api/columns

Body Example:
```json
{
  "name": "To Do",
  "boardId": 1
}
```
Required Fields:
| Field     | Type    | Required | Description                           |
| --------- | ------- | -------- | ------------------------------------- |
| name      | string  | ✅        | Name of the column                    |
| boardId | integer | ✅        | ID of the board the column belongs to |


## 2.Update Column

PATCH api/columns/:columnId

Path Parameter:

Body Example:
```json
{
  "name": "In Progress"
}
```
Required Fields:
| Name | Type    | Required | Description                |
| ---- | ------- | -------- | -------------------------- |
| id   | integer | ✅        | ID of the column to update |


