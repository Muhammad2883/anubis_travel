import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Route } from '@/lib/types';
import routesFallback from '@/data/routes.json';

const dataFilePath = path.join(process.cwd(), 'data', 'routes.json');

export async function GET() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      const routes: Route[] = JSON.parse(fileData);
      return NextResponse.json({ success: true, routes });
    }
    return NextResponse.json({ success: true, routes: routesFallback as Route[] });
  } catch (error) {
    console.error('Error reading routes.json:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read routes', routes: routesFallback as Route[] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { routes } = body;

    if (!routes || !Array.isArray(routes)) {
      return NextResponse.json(
        { success: false, error: 'Invalid routes array provided' },
        { status: 400 }
      );
    }

    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(routes, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Routes updated and saved successfully',
      routes
    });
  } catch (error) {
    console.error('Error saving routes.json:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save routes' },
      { status: 500 }
    );
  }
}
