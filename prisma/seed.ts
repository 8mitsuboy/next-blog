import "tsconfig-paths/register";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

async function main() {
  // クリーンアップ
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 12);

  // ダミー画像URL
  const dummyImages = [
    "https://picsum.photos/seed/post1/600/400",
    "https://picsum.photos/seed/post2/600/400",
  ];

  // ユーザー作成
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      password: hashedPassword,
      posts: {
        create: [
          // なぜauthorIdを入力していないのか？ publishedとは何か？
          {
            title: "初めてのブログ投稿",
            content: "これは最初のブログ投稿です。",
            topImage: dummyImages[0],
            published: true,
          },
          {
            title: "2つ目ののブログ投稿",
            content: "これは2つ目のブログ投稿です。",
            topImage: dummyImages[1],
            published: true,
          },
        ],
      },
    },
  });
  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
