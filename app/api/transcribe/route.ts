import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // TODO: call AI transcription service (e.g. Supabase Edge Function or OpenAI Whisper)
  return NextResponse.json({
    client_name: '',
    items: [{ description: '', quantity: 1, unit_price: 0, vat_rate: 20 }],
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    notes: '',
    voice_transcript: 'Transcription placeholder',
  });
}
