import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Init client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Nama, Email, dan Pesan wajib diisi!' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, message }]);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Pesan berhasil dikirim!', data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: 'Terjadi kesalahan server.' },
      { status: 500 }
    );
  }
}