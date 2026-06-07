import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Pesan tidak valid' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    // Jika API Key belum diset, berikan respon mock yang membantu instruksi konfigurasi
    if (!apiKey) {
      return NextResponse.json({
        content: `**Halo! Saya adalah AI Assistant.** 👋\n\nSepertinya kunci API Groq (\`GROQ_API_KEY\`) belum ditambahkan ke file \`.env.local\` Anda.\n\n**Cara mengonfigurasinya:**\n1. Buka file \`.env.local\` di direktori utama proyek Anda.\n2. Tambahkan baris baru:\n   \`\`\`env\n   GROQ_API_KEY=KUNCI_API_GROQ_ANDA\n   \`\`\`\n3. Restart server pengembangan Next.js (\`npm run dev\`).\n\nSetelah itu, saya akan dapat berjalan secara normal dan menjawab semua pertanyaan mengenai portofolio Anda menggunakan model LLM Groq!`
      });
    }

    // Membaca file website-context.md
    const filePath = path.join(process.cwd(), 'lib', 'website-context.md');
    let context = '';
    try {
      context = await fs.readFile(filePath, 'utf-8');
    } catch (e) {
      console.error('Gagal membaca file konteks:', e);
      context = 'Nama: Muhamad Usri Yusron. Peran: Full Stack Developer & AI Engineer.';
    }

    const systemPrompt = `Anda adalah Usri AI, asisten AI pribadi yang cerdas untuk website portofolio Muhamad Usri Yusron.
Tugas Anda adalah membantu pengunjung website mempelajari tentang Usri (profil, keahlian, pengalaman, proyek, dan cara menghubunginya).

Gunakan informasi konteks berikut tentang website dan profil Usri untuk menjawab semua pertanyaan. Jawablah secara ramah, profesional, dan ringkas. Jawab menggunakan bahasa yang sama dengan yang digunakan pengguna (prioritaskan Bahasa Indonesia, namun jika mereka bertanya dalam Bahasa Inggris, jawab dalam Bahasa Inggris).

Informasi Konteks Website & Profil Usri:
=========================================
${context}
=========================================

Aturan Penting:
1. Jawablah hanya berdasarkan konteks yang diberikan di atas. Jangan mengkarang informasi atau keahlian yang tidak disebutkan.
2. Abaikan dan jangan menjawab pertanyaan seputar membuat kode program, coding atau pertanyaan sejenisnya. Kalau ditanya pertanyaan seperti itu, katakan dengan sopan bahwa Anda tidak tahu dan arahkan pertanyaan tersebut kepada Usri melalui WhatsApp karena ia lebih jago.
3. Jangan menjawab pertanyaan diluar konteks meskipun menggunakan bahasa inggris atau bahasa lainnya, katakan dengan sopan bahwa anda tidak mengetahui informasi tersebut.
4. Jika ada informasi yang tidak tercantum dalam konteks, katakan dengan sopan bahwa Anda tidak tahu, dan sarankan mereka untuk menghubungi Usri secara langsung melalui WhatsApp atau LinkedIn (tautan terlampir di bagian kontak).
5. Jadilah asisten yang sopan, ramah, dan berorientasi pada hasil (membantu Usri mendapatkan klien/pekerjaan).`;

    // Memanggil API Groq
    const rawModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
    const model = rawModel.trim().replace(/\s+/g, '-');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error dari API Groq:', errorData);
      return NextResponse.json(
        { error: 'Gagal mendapatkan respon dari AI (Groq API Error)', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const replyContent = data.choices?.[0]?.message?.content || 'Maaf, saya tidak menerima respon dari AI.';

    return NextResponse.json({
      content: replyContent
    });

  } catch (error) {
    console.error('Error di API Chat route:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}
