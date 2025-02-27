// import { NextResponse } from "next/server";
// import prisma from "@/prisma/prisma"; // Ensure correct import path

// // ✅ Create New Blog Post
// export async function POST(req: Request) {
//   try {
//     const { post_title, post_content, category, tags } = await req.json();

//     if (!post_title || !post_content || !category || !tags) {
//       return NextResponse.json(
//         { error: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     const newBlogPost = await prisma.blogPost.create({
//       data: { post_name: post_title, post_title, post_content, category, tags },
//     });

//     return NextResponse.json(newBlogPost, { status: 201 });
//   } catch (error) {
//     console.error("Error creating blog post:", error);
//     return NextResponse.json(
//       { error: "Failed to create blog post" },
//       { status: 500 }
//     );
//   }
// }

// // ✅ Delete a Blog Post
// export async function DELETE(req: Request) {
//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return NextResponse.json(
//         { error: "Blog post ID is required" },
//         { status: 400 }
//       );
//     }

//     await prisma.blogPost.delete({
//       where: { id },
//     });

//     return NextResponse.json(
//       { message: "Blog post deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting blog post:", error);
//     return NextResponse.json(
//       { error: "Failed to delete blog post" },
//       { status: 500 }
//     );
//   }
// }

// // ✅ Update a Blog Post
// export async function PUT(req: Request) {
//   try {
//     const { id, post_title, post_content, category, tags } = await req.json();

//     if (!id || !post_title || !post_content || !category || !tags) {
//       return NextResponse.json(
//         { error: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     const updatedBlogPost = await prisma.blogPost.update({
//       where: { id },
//       data: { post_title, post_content, category, tags },
//     });

//     return NextResponse.json(updatedBlogPost, { status: 200 });
//   } catch (error) {
//     console.error("Error updating blog post:", error);
//     return NextResponse.json(
//       { error: "Failed to update blog post" },
//       { status: 500 }
//     );
//   }
// }

// // ✅ Fetch All Blog Posts
// export async function GET() {
//   try {
//     const blogPosts = await prisma.blogPost.findMany({
//       select: {
//         id: true,
//         post_title: true,
//         post_content: true,
//         category: true,
//         tags: true,
//         post_status: true,
//         createdAt: true,
//       },
//     });

//     return NextResponse.json(blogPosts, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching blog posts:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch blog posts" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma"; // Ensure correct import path

// ✅ Create New Blog Post
export async function POST(req: Request) {
  try {
    const { post_title, post_content, category, tags } = await req.json();

    if (!post_title || !post_content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    const newBlogPost = await prisma.blogPost.create({
      data: {
        post_name: post_title,
        post_title,
        post_content,
        category,
        tags: tags || "", // Ensure tags is optional and defaults to an empty string
      },
    });

    return NextResponse.json(newBlogPost, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

// ✅ Delete a Blog Post
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Blog post ID is required." },
        { status: 400 }
      );
    }

    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json(
      { message: "Blog post deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post." },
      { status: 500 }
    );
  }
}

// ✅ Update a Blog Post
export async function PUT(req: Request) {
  try {
    const { id, post_title, post_content, category, tags, post_status } =
      await req.json();

    if (!id || !post_title || !post_content || !category) {
      return NextResponse.json(
        { error: "ID, title, content, and category are required." },
        { status: 400 }
      );
    }

    // Process tags to ensure it's an array
    const processedTags = Array.isArray(tags)
      ? tags
      : tags?.split(",").map((tag: string) => tag.trim()) || [];

    const updatedBlogPost = await prisma.blogPost.update({
      where: { id },
      data: {
        post_title,
        post_content,
        category,
        tags: processedTags,
        post_status: post_status || "draft",
      },
    });

    return NextResponse.json(updatedBlogPost, { status: 200 });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post." },
      { status: 500 }
    );
  }
}

// ✅ Fetch All Blog Posts
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const authorId = searchParams.get("authorId");

    // Query filters
    const filters: any = {};
    if (category) filters.category = category;
    if (authorId) filters.post_author = parseInt(authorId);

    const blogPosts = await prisma.blogPost.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        post_title: true,
        post_content: true,
        category: true,
        tags: true,
        post_status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(blogPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts." },
      { status: 500 }
    );
  }
}
