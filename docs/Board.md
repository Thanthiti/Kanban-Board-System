## 1.Create Board

POST api/boards

Body Example:
```json
{
  "name": "Project Alpha"
}
```

Required Fields:

| Field | Type   | Notes      |
| ----- | ------ | ---------- |
| name  | string | Board name |


## 2.Update Board

PATCH api/boards/:boardId
Path Parameter:
| Name    | Type    | Required | Description     |
| ------- | ------- | -------- | --------------- |
| boardId | integer | ✅        | ID of the board |

Body Example:
```json
{
  "name": "Project Beta"
}
```

Optional Fields:
| Field | Type   | Notes      |
| ----- | ------ | ---------- |
| name  | string | Board name |



## 3.Add Member to Board

POST api/boards/:boardId/members

Description: Add one or more members to a board

Path Parameter:
| Name    | Type    | Required | Description     |
| ------- | ------- | -------- | --------------- |
| boardId | integer | ✅        | ID of the board |

Body Example:
```json
{
  "user_id": 2,
}
```

Required Fields:

| Field   | Type   | Notes                                   |
| ------- | ------ | --------------------------------------- |
| userIds | array  | IDs of users to add                     |
| role    | string | Role for the new members (member/admin) |


## Permissions:

Only board owner can add members
