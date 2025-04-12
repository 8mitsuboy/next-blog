import { prisma } from "@/lib/prisma";

export async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getPost(id: string) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function searchPosts(search: string) {
  // URLに含まれるエンコードされた日本語（検索キーワード）を元の日本語に戻す
  const decodedSearch = decodeURIComponent(search);
  // 検索キーワードに含まれる全角空白を半角空白になおす(trimは文字列の先頭と末尾の空白を削除)
  const normalizedSearch = decodedSearch.replace(/[\s　]+/g, " ").trim();
  const searchWords = normalizedSearch.split(" ").filter(Boolean);

  // すべての検索キーワードのうち、それぞれがタイトルまたは内容に含まれていること
  const filters = searchWords.map((word) => ({
    OR: [{ title: { contains: word } }, { content: { contains: word } }],
  }));

  return await prisma.post.findMany({
    where: {
      AND: filters,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
