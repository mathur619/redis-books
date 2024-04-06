"use server";

import { client } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createBook(formData) {
  const { title, rating, author, blurb } = Object.fromEntries(formData);

  const id = Math.floor(Math.random() * 10000);

  const isUnique = await client.zAdd(
    "books",
    {
      value: title,
      score: id,
    },
    {
      NX: true,
    }
  );

  if (!isUnique) {
    return { error: "That book has already been added!" };
  }

  await client.hSet(`books:${id}`, {
    title,
    rating,
    author,
    blurb,
  });
  redirect("/");
}
