import { Notification } from "@prisma/client";

const mockNotifications: Notification[] = [
  {
    id: 1,
    message: "Notification 1",
    userId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    message: "Notification 2",
    userId: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    message: "Notification 3",
    userId: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default mockNotifications;
