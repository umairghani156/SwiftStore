import prisma from "../DB/db.config.js";

export const createPostController = async (req, res) =>{
    const { userId , title, description } = req.body;
    try {
        if(!userId || !title || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newPost = await prisma.post.create({
            data:{
                title: title,
                description: description,
                userId: userId,
            }
        });

        if (newPost) {
            return res.status(201).json({ message: "Post created successfully" });
        } else {
            return res.status(400).json({ message: "Post not created" });
        }
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllPostsController = async ( req, res) =>{
    try {
        // const posts = await prisma.post.findMany({
        //     include:{
        //         user:true
        //     }
        // });
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc" // Newest posts first
            },
            select: {
                id: true,
                title: true,
                description: true,
                comments_count: true,
                createdAt: true, 
                user: {
                    select: {
                        id: true,
                        name: true 
                    }
                },
                comments: { 
                    take: 2,
                    orderBy:{
                        createdAt:"desc"
                    },
                    select: {
                        id: true,
                        comment: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        } else {
            return res.status(200).json({
                success: true,
                message: "Posts fetched successfully",
                posts: posts,
            });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getPostController = async (req, res) =>{
    const { id } = req.params;
    if(!id) {
        return res.status(400).json({ message: "Post ID is required" });
    }
    try {
        const post = await prisma.post.findUnique({
            where:{
                id: id,
            },
            select:{
                id: true,
                title: true,
                description: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                comments_count: true,
                createdAt: true,
                comments: {
                    select: {
                        id: true,
                        comment: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
            }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        } else {
            return res.status(200).json({
                success: true,
                message: "Post fetched successfully",
                post: post,
            });
        }
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const updatePostController = async (req, res) =>{
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        if(!id) {
            return res.status(400).json({ message: "Post ID is required" });
        };

        const postExists = await prisma.post.findUnique({
            where:{
                id: id,
            }
        });
        if (!postExists) {
            return res.status(404).json({ message: "Post not found" });
        };
        const post = await prisma.post.update({
            where:{
                id: id,
            },
            data:{
                title: title,
                description: description,
            },
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        } else {
            return res.status(200).json({
                success: true,
                message: "Post updated successfully",
                post: post,
            });
        }

       
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const deletePostController = async (req, res) =>{
    const { id } = req.params;
    if(!id) {
        return res.status(400).json({ message: "Post ID is required" });
    };
    try {
        const postExists = await prisma.post.findUnique({
            where:{
                id: id,
            }
        });
        if (!postExists) {
            return res.status(404).json({ message: "Post not found" });
        };
        const post = await prisma.post.delete({
            where:{
                id: id,
            }
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        } else {
            return res.status(200).json({
                success: true,
                message: "Post deleted successfully",
                post: post,
            });
        }
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllPossByUserController = async (req, res) =>{
    const {userId} = req.params;
    if(!userId) {
        return res.status(400).json({ message: "User ID is required" });
    };
    try {
        const user = await prisma.user.findUnique({
            where:{
                id: userId,
            }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        };
        const posts = await prisma.post.findMany({
            where:{
                userId: userId,
            },
            select:{
                id: true,
                title: true,
                description: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                comments_count: true,

                
            }
        });
        if (!posts) {
            return res.status(404).json({ message: "Posts not found" });
        } else {
            return res.status(200).json({
                success: true,
                message: "Posts fetched successfully",
                posts: posts,
            });
        }
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
