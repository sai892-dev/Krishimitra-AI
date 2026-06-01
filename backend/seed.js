const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a dummy author
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  
  const author = await prisma.user.upsert({
    where: { email: 'author@example.com' },
    update: {},
    create: {
      email: 'author@example.com',
      name: 'Jane Doe',
      password: hashedPassword,
    },
  });

  // Create sample posts
  const posts = [
    {
      title: 'The Future of Web Development in 2026',
      content: 'Web development is evolving faster than ever. With AI writing our boilerplates, what does the future hold for developers? In 2026, we are seeing a massive shift towards agentic coding assistants that can scaffold entire applications in minutes. However, the true value of a developer has shifted from writing syntax to designing robust architectures and understanding the deep business logic. \n\nFrameworks like React and Next.js continue to dominate the landscape, but the way we interact with them is completely different. AI handles the mundane, leaving us to focus on crafting premium user experiences and highly optimized backends.',
      authorId: author.id,
    },
    {
      title: 'Why Micro-Animations Matter',
      content: 'A static web page is a dead web page. Users expect digital environments that react to their presence. Micro-animations—subtle visual feedback when hovering, clicking, or scrolling—bridge the gap between human and machine. \n\nWhen designing your next app, consider adding a slight translate-Y on cards when hovered, or a soft glow on primary buttons. These tiny details transform a standard interface into a premium product that users love to interact with. Remember, it is not about making things jump around; it is about providing smooth, predictable feedback.',
      authorId: author.id,
    },
    {
      title: 'Mastering Full-Stack Architectures',
      content: 'Building a robust full-stack application requires a deep understanding of how data flows from the database to the client. Using a monorepo with tools like Prisma and Express makes backend development a breeze. \n\nOn the frontend, maintaining a strict separation of concerns between your API service layer, state management (like React Context), and presentation components is critical. When you organize your code logically, scaling from a weekend project to an enterprise app becomes a natural progression.',
      authorId: author.id,
    }
  ];

  for (const post of posts) {
    await prisma.post.create({
      data: post,
    });
  }

  console.log('Successfully seeded the database with a user and 3 posts.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
