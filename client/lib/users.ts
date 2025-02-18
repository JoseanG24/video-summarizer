import { db } from "@/lib/prisma";
import { User } from "@prisma/client";

export async function createUser(data: User) {
  try {
    const user = await db.user.create({ data });
    return { user };
  } catch (error) {
    return { error };
  }
}

export async function getUserById({
  id,
  clerkUserId,
}: {
  id?: string;
  clerkUserId?: string;
}) {
  try {
    if (!id && !clerkUserId) {
      throw new Error("id or clerk user id is required");
    }

    const query = id ? { id } : { clerkUserId };

    const user = await db.user.findUnique({ where: query });
    return { user };
  } catch (error) {
    return { error };
  }
}

export async function updateUserId(id: string, data: Partial<User>) {
  try {
    const user = await db.user.update({
      where: { id },
      data,
    });

    return { user };
  } catch (error) {
    return { error };
  }
}
