import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, customer_contact, package_name } = body;

    // Validasi input sederhana
    if (!customer_name || !customer_contact || !package_name) {
      return NextResponse.json(
        { message: 'Semua kolom wajib diisi!' },
        { status: 400 }
      );
    }

    // Insert data ke tabel 'orders' di Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name,
          customer_contact,
          package_name,
          status: 'new',
        },
      ])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Pesanan berhasil disimpan!', data },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}