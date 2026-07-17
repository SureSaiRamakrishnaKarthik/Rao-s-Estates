import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const supabase = await createClient();
    
    const { error } = await supabase.from('leads').insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message || '',
      source: data.source || 'website',
      project_id: data.project_id || null,
      status: 'new'
    });

    if (error) {
      console.error('Supabase error inserting lead:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Success' });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}