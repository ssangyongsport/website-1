import { AuthorData } from "@utils/mdx";
import { z } from "zod";
import { blogAuthors } from "../config";

const authors = Object.keys(blogAuthors) as [string, ...string[]];

export const AuthorEnum = z.enum(authors);

/**
 * Must be able to serizalize
 */
export const BlogFrontMatterSchema = z.object({
    title: z.string({ description: "The title of blog" }).min(1).max(100),
    description: z
        .string({ description: "Blog description" })
        .max(1000)
        .optional(),
    date: z.string({ description: "Release date of the blog" }).refine(
        (s) => !Number.isNaN(Date.parse(s)),
        (v) => ({ message: `Invalid date time ${v}` })
    ),
    image: z.string({ description: "Blog image" }).optional(),
    tags: z.array(z.string()),
    authors: z
        .union([AuthorEnum, z.array(AuthorEnum)])
        .transform<AuthorData[]>((rel) => {
            return (Array.isArray(rel) ? rel : [rel]).map(
                (author) => blogAuthors[author]
            );
        }),
    theme: z
        .enum(["raw", "default"], {
            description: "Use raw theme to disable layout injection",
        })
        .optional(),
    enableLayout: z
        .boolean({ description: "Enable the new layout (beta)" })
        .optional(),
});

export type BlogFrontMatter = z.infer<typeof BlogFrontMatterSchema>;

/**
 * Must be able to serizalize
 */
export const BlogPageSchema = z.object({
    frontMatter: BlogFrontMatterSchema,
    name: z.string(),
    route: z.string(),
    kind: z.literal("MdxPage"),
    meta: z.any().optional(),
    locale: z.string().optional(),
});

export type BlogPage = z.infer<typeof BlogPageSchema>;
