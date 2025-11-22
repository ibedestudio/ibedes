import type { APIRoute } from 'astro';
import type { ArticleFrontmatter } from '../../lib/types';
import { articles } from '../../lib/list';

export const GET: APIRoute = async ({ params }) => {
    const { slug } = params;

    // Find the article
    const article = articles.find((a: ArticleFrontmatter) => a.filename === `/blog/${slug}`);

    if (!article) {
        return new Response('Article not found', { status: 404 });
    }

    // Generate SVG OG image
    const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&amp;display=swap');
          
          .bg { fill: #f5f5f5; }
          .dark-bg { fill: #171717; }
          .border { stroke: #171717; stroke-width: 4; fill: none; }
          .title { 
            font-family: 'Press Start 2P', monospace; 
            font-size: 42px; 
            fill: #171717;
            line-height: 1.4;
          }
          .meta { 
            font-family: 'Press Start 2P', monospace; 
            font-size: 18px; 
            fill: #525252;
          }
          .accent { fill: #10b981; }
          .pattern {
            fill: none;
            stroke: #e5e5e5;
            stroke-width: 2;
          }
        </style>
      </defs>
      
      <!-- Background -->
      <rect class="bg" width="1200" height="630"/>
      
      <!-- Grid pattern -->
      ${Array.from({ length: 12 }, (_, i) =>
        `<line class="pattern" x1="${i * 100}" y1="0" x2="${i * 100}" y2="630"/>`
    ).join('')}
      ${Array.from({ length: 7 }, (_, i) =>
        `<line class="pattern" x1="0" y1="${i * 90}" x2="1200" y2="${i * 90}"/>`
    ).join('')}
      
      <!-- Border -->
      <rect class="border" x="30" y="30" width="1140" height="570" rx="0"/>
      
      <!-- Accent bar -->
      <rect class="accent" x="30" y="30" width="20" height="570"/>
      
      <!-- Content -->
      <g transform="translate(100, 120)">
        <!-- Title (word wrap) -->
        ${wrapText(article.title, 900, 42, 60).map((line, i) =>
        `<text class="title" x="0" y="${i * 70}">${escapeXml(line)}</text>`
    ).join('')}
        
        <!-- Meta info -->
        <text class="meta" x="0" y="${wrapText(article.title, 900, 42, 60).length * 70 + 80}">
          ${article.time} min read • ${new Date(article.timestamp).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}
        </text>
      </g>
      
      <!-- Logo/Branding -->
      <text class="meta" x="100" y="580">ibedes.my.id</text>
    </svg>
  `;

    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
};

// Helper function to wrap text
function wrapText(text: string, maxWidth: number, fontSize: number, maxLines: number = 3): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    // Approximate character width (for Press Start 2P font)
    const charWidth = fontSize * 0.6;
    const maxCharsPerLine = Math.floor(maxWidth / charWidth);

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;

        if (testLine.length <= maxCharsPerLine) {
            currentLine = testLine;
        } else {
            if (currentLine) {
                lines.push(currentLine);
            }
            currentLine = word;

            if (lines.length >= maxLines - 1) {
                break;
            }
        }
    }

    if (currentLine && lines.length < maxLines) {
        // Add ellipsis if text was truncated
        if (words.length > lines.join(' ').split(' ').length + currentLine.split(' ').length) {
            currentLine += '...';
        }
        lines.push(currentLine);
    }

    return lines;
}

// Helper function to escape XML special characters
function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Generate static paths for all articles
export function getStaticPaths() {
    return articles.map((article: ArticleFrontmatter) => ({
        params: { slug: article.filename.replace('/blog/', '') },
    }));
}
