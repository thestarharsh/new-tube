//Script for creating seed categories

import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
    "Vehicles",
    "Comedy",
    "Education",
    "Gaming",
    "Entertainment",
    "Film",
    "Style",
    "Music",
    "News",
    "People",
    "Animals",
    "Science",
    "Technology",
    "Sports",
    "Travel",
];

async function main() {
    console.log("Seeding categories...");

    try {
        const values = categoryNames.map((name) => ({
            name,
            description: `Videos related to ${name.toLowerCase()} category`,
        }));

        await db.insert(categories).values(values);

        console.log("Categories seeded successfully!");
    } catch (error) {
        console.error("Error seeding categories:", error);
    }
}

main();
