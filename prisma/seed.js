const prisma = require("../src/config/db");
const bcrypt = require("bcryptjs");

async function main() {
  // --- 1. Users ---
  const password1 = await bcrypt.hash("password123", 10);
  const password2 = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.upsert({
    where: { email: "dream@example.com" },
    update: {},
    create: {
      name: "dream",
      email: "dream@example.com",
      password: password1,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "arm@example.com" },
    update: {},
    create: {
      name: "arm",
      email: "arm@example.com",
      password: password2,
    },
  });

  // --- 2. Board ---
  const board = await prisma.board.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Project Kanban",
      owner_id: user1.id,
    },
  });

  // --- 3. Board Members ---
  await prisma.boardUser.upsert({
    where: { board_id_user_id: { board_id: board.id, user_id: user1.id } },
    update: {},
    create: {
      board_id: board.id,
      user_id: user1.id,
      role: "OWNER",
    },
  });

  await prisma.boardUser.upsert({
    where: { board_id_user_id: { board_id: board.id, user_id: user2.id } },
    update: {},
    create: {
      board_id: board.id,
      user_id: user2.id,
      role: "MEMBER",
    },
  });

  // --- 4. Columns ---
  const todoColumn = await prisma.column.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "To Do",
      board_id: board.id,
    },
  });

  const doingColumn = await prisma.column.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Doing",
      board_id: board.id,
    },
  });

  const doneColumn = await prisma.column.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Done",
      board_id: board.id,
    },
  });

  // --- 5. Tags ---
  const defaultTags = ["BUG", "FEATURE", "DOCUMENTATION", "IMPROVEMENT"];

  // สร้าง tags ถ้ายังไม่มี (idempotent)
  await prisma.tag.createMany({
    data: defaultTags.map((name) => ({ name })),
    skipDuplicates: true,
  });

  const tags = await prisma.tag.findMany({
    where: { name: { in: defaultTags } },
  });
  const tagMap = {};
  tags.forEach((t) => (tagMap[t.name] = t));

  // --- 6. Tasks ---
const task1 = await prisma.task.create({
  data: {
    title: "Fix login bug",
    description: "User cannot login with special characters",
    column_id: todoColumn.id,
    position: 1,
    dueDate: new Date("2025-09-20"),
    assignees: {
      create: [
        { user_id: user1.id, role: "OWNER" },
        { user_id: user2.id, role: "MEMBER" },
      ],
    },
    tags: {
      create: [{ tag_id: tagMap["BUG"].id }],
    },
  },
});

const task2 = await prisma.task.create({
  data: {
    title: "Implement new feature",
    description: "Add new dashboard chart",
    column_id: doingColumn.id,
    position: 1,
    dueDate: new Date("2025-09-25"),
    assignees: {
      create: [{ user_id: user2.id, role: "OWNER" }],
    },
    tags: {
      create: [{ tag_id: tagMap["FEATURE"].id }],
    },
  },
});
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
