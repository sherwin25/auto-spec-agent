import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // We execute a lightweight query to ensure Supabase considers this "activity"
    // Fetching the current user session is a good generic verification
    const { error } = await supabase.auth.getSession();
    
    if (error) {
       console.error('Supabase keep-alive error:', error);
       return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      status: 'alive', 
      timestamp: new Date().toISOString(),
      message: 'Supabase checked successfully'
    });
  } catch (err) {
    return NextResponse.json({ status: 'error', error: String(err) }, { status: 500 });
  }
}
