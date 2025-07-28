// app/api/designs/route.js
import { NextResponse } from "next/server";

// In a real application, you would use a database like PostgreSQL, MongoDB, etc.
// For this example, we'll use a simple in-memory storage
// You should replace this with your actual database implementation

let designs = []; // This is temporary - use a real database in production
let nextId = 1;

export async function GET() {
  try {
    // In a real app, you would query your database
    // const designs = await db.designs.findMany({ orderBy: { updated_at: 'desc' } });

    return NextResponse.json(designs);
  } catch (error) {
    console.error("Error fetching designs:", error);
    return NextResponse.json(
      { error: "Failed to fetch designs" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, components, metadata } = body;

    // Validate required fields
    if (!name || !components) {
      return NextResponse.json(
        { error: "Name and components are required" },
        { status: 400 }
      );
    }

    // Create new design
    const newDesign = {
      id: nextId++,
      name,
      components,
      metadata: {
        ...metadata,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // In a real app, you would save to your database
    // const savedDesign = await db.designs.create({ data: newDesign });

    designs.push(newDesign);

    return NextResponse.json(newDesign, { status: 201 });
  } catch (error) {
    console.error("Error creating design:", error);
    return NextResponse.json(
      { error: "Failed to create design" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, components, metadata } = body;

    // Validate required fields
    if (!id || !name || !components) {
      return NextResponse.json(
        { error: "ID, name and components are required" },
        { status: 400 }
      );
    }

    // Find existing design
    const existingDesignIndex = designs.findIndex((design) => design.id === id);
    if (existingDesignIndex === -1) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    // Update design
    const updatedDesign = {
      ...designs[existingDesignIndex],
      name,
      components,
      metadata: {
        ...designs[existingDesignIndex].metadata,
        ...metadata,
        updated: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    };

    // In a real app, you would update in your database
    // const updatedDesign = await db.designs.update({ where: { id }, data: updateData });

    designs[existingDesignIndex] = updatedDesign;

    return NextResponse.json(updatedDesign);
  } catch (error) {
    console.error("Error updating design:", error);
    return NextResponse.json(
      { error: "Failed to update design" },
      { status: 500 }
    );
  }
}
