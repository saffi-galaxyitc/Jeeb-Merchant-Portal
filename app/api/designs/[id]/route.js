// app/api/designs/[id]/route.js
import { NextResponse } from "next/server";

// In-memory storage (same as above - in production use database)
let designs = [];

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const design = designs.find((d) => d.id === parseInt(id));

    if (!design) {
      return NextResponse.json(
        { success: false, error: "Design not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      design,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch design" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, components } = body;

    const designIndex = designs.findIndex((d) => d.id === parseInt(id));

    if (designIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Design not found" },
        { status: 404 }
      );
    }

    // Update design
    designs[designIndex] = {
      ...designs[designIndex],
      name: name || designs[designIndex].name,
      components: components || designs[designIndex].components,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      design: designs[designIndex],
      message: "Design updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update design" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const designIndex = designs.findIndex((d) => d.id === parseInt(id));

    if (designIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Design not found" },
        { status: 404 }
      );
    }

    const deletedDesign = designs.splice(designIndex, 1)[0];

    return NextResponse.json({
      success: true,
      design: deletedDesign,
      message: "Design deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete design" },
      { status: 500 }
    );
  }
}
