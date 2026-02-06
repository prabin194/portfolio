import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import sanitizeHtml from 'sanitize-html';

const contentDirectory = path.join(process.cwd(), '@content');

export async function getProjects() {
    const projectsDirectory = path.join(contentDirectory, 'projects');
    const fileNames = fs.readdirSync(projectsDirectory);

    const projects = await Promise.all(
        fileNames.map(async (fileName) => {
            const id = fileName.replace(/\.md$/, '');
            const fullPath = path.join(projectsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            // Parse markdown metadata and content
            const { data, content } = matter(fileContents);

            // Convert markdown to HTML
            const processedContent = await remark()
                .use(html)
                .process(content);
            const contentHtml = sanitizeHtml(processedContent.toString());

            return {
                id,
                contentHtml,
                title: data.title,
                description: data.description,
                date: data.date,
                updated: data.updated,
                stars: data.stars,
                repo: data.repo, // optional GitHub repo name or full slug
                homepage: data.homepage,
                language: data.language,
                tags: data.tags
            };
        })
    );

    // Sort projects by date
    return projects.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export async function getBlogs() {
    const blogDir = path.join(contentDirectory, 'blogs');
    const years = fs.readdirSync(blogDir)
        .filter(file => /^\d{4}$/.test(file)) // Only include year directories
        .sort((a, b) => Number(b) - Number(a)) // Sort years descending

    const blogPosts = []

    for (const year of years) {
        const yearPath = path.join(blogDir, year)
        const posts = fs.readdirSync(yearPath)
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const filePath = path.join(yearPath, file)
                const fileContent = fs.readFileSync(filePath, 'utf-8')
                const { data } = matter(fileContent)

                return {
                    title: data.title,
                    slug: file.replace('.md', ''),
                    date: data.date
                }
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        blogPosts.push({
            year,
            posts
        })
    }

    return blogPosts
}

export async function getLatestBlog() {
    const blogDir = path.join(contentDirectory, 'blogs');
    const years = fs.readdirSync(blogDir)
        .filter(file => /^\d{4}$/.test(file)) // Only include year directories
        .sort((a, b) => Number(b) - Number(a)) // Sort years descending

    const blogPosts = []

    for (const year of years) {
        const yearPath = path.join(blogDir, year)
        const posts = fs.readdirSync(yearPath)
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const filePath = path.join(yearPath, file)
                const fileContent = fs.readFileSync(filePath, 'utf-8')
                const { data } = matter(fileContent)

                return {
                    title: data.title,
                    slug: file.replace('.md', ''),
                    year: year,
                    date: data.date // Assuming date is in your frontmatter
                }
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        blogPosts.push(...posts)
    }

    return blogPosts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6)
}
