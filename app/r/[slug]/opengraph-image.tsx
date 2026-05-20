import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'SOR7ED Protocol';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Initialize Supabase client (Edge safe)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    
    // Fetch the link data
    const { data: link } = await supabase
        .from('rich_links')
        .select('*')
        .eq('slug', resolvedParams.slug)
        .single();

    const title = link?.title || 'SOR7ED Protocol';
    const description = link?.description || 'Field Intelligence Briefing';

    return new ImageResponse(
        (
            <div
                style={{
                    backgroundColor: '#000000',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '80px',
                    fontFamily: 'sans-serif', // Edge runtime has limited fonts unless loaded
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#FFE600', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '2px' }}>
                        SOR7ED // FIELD INTELLIGENCE
                    </span>
                    <h1 style={{ color: '#FFFFFF', fontSize: '64px', fontWeight: 'bold', margin: '0 0 20px 0', lineHeight: 1.1 }}>
                        {title}
                    </h1>
                    <p style={{ color: '#A0A0A0', fontSize: '28px', margin: 0, lineHeight: 1.4, maxWidth: '900px' }}>
                        {description}
                    </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFE600', marginRight: '10px' }} />
                        <span style={{ color: '#FFFFFF', fontSize: '20px' }}>Protocol Active</span>
                    </div>
                    <span style={{ color: '#FFE600', fontSize: '20px', fontWeight: 'bold' }}>sor7ed.com</span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
