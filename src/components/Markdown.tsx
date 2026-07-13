import type { ReactNode } from 'react'

// Renderizador de Markdown leve e sem dependências, suficiente para os
// entregáveis: títulos, listas, tabelas, citações, régua, negrito/itálico/code.

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const t = m[0]
    if (t.startsWith('**')) out.push(<strong key={k++}>{t.slice(2, -2)}</strong>)
    else if (t.startsWith('`'))
      out.push(
        <code key={k++} className="rounded bg-cocoa/10 px-1 py-0.5 text-[0.9em] text-cocoa">
          {t.slice(1, -1)}
        </code>,
      )
    else out.push(<em key={k++}>{t.slice(1, -1)}</em>)
    last = m.index + t.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

const cells = (line: string) =>
  line
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim())

export function Markdown({ md }: { md: string }) {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // linha em branco
    if (!line.trim()) {
      i++
      continue
    }

    // régua
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push(<hr key={key++} className="my-6 border-cocoa/15" />)
      i++
      continue
    }

    // título
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      const lvl = h[1].length
      const txt = inline(h[2])
      const cls =
        lvl === 1
          ? 'mt-2 mb-4 font-headline text-[26px] font-bold leading-tight text-cocoa'
          : lvl === 2
            ? 'mt-7 mb-3 font-headline text-[20px] font-bold text-cocoa'
            : 'mt-5 mb-2 text-[16px] font-bold text-cocoa'
      const Tag = (`h${Math.min(lvl, 6)}` as unknown) as keyof JSX.IntrinsicElements
      blocks.push(
        <Tag key={key++} className={cls}>
          {txt}
        </Tag>,
      )
      i++
      continue
    }

    // tabela: linha com | seguida de linha separadora |---|
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?[\s:-]+\|[\s:|-]*$/.test(lines[i + 1])) {
      const header = cells(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        rows.push(cells(lines[i]))
        i++
      }
      blocks.push(
        <div key={key++} className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr>
                {header.map((c, j) => (
                  <th key={j} className="border border-cocoa/20 bg-cocoa/5 px-3 py-2 text-left font-bold text-cocoa">
                    {inline(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((c, ci) => (
                    <td key={ci} className="border border-cocoa/15 px-3 py-2 align-top text-cocoa">
                      {inline(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }

    // citação
    if (/^>\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      blocks.push(
        <blockquote key={key++} className="my-4 border-l-4 border-gold/60 bg-gold/5 px-4 py-2 text-[15px] italic text-cocoa">
          {buf.map((b, bi) => (
            <p key={bi}>{inline(b)}</p>
          ))}
        </blockquote>,
      )
      continue
    }

    // lista não ordenada
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''))
        i++
      }
      blocks.push(
        <ul key={key++} className="my-3 list-disc space-y-1.5 pl-6 text-[15px] leading-relaxed text-cocoa">
          {items.map((it, ii) => (
            <li key={ii}>{inline(it)}</li>
          ))}
        </ul>,
      )
      continue
    }

    // lista ordenada
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''))
        i++
      }
      blocks.push(
        <ol key={key++} className="my-3 list-decimal space-y-1.5 pl-6 text-[15px] leading-relaxed text-cocoa">
          {items.map((it, ii) => (
            <li key={ii}>{inline(it)}</li>
          ))}
        </ol>,
      )
      continue
    }

    // parágrafo (linhas consecutivas)
    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6})\s/.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim()) &&
      !/^>\s?/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !lines[i].includes('|')
    ) {
      para.push(lines[i])
      i++
    }
    if (para.length) {
      blocks.push(
        <p key={key++} className="my-3 text-[15px] leading-relaxed text-cocoa">
          {inline(para.join(' '))}
        </p>,
      )
    } else {
      i++ // linha não reconhecida (ex.: sozinha com |) — evita loop
    }
  }

  return <article className="markdown">{blocks}</article>
}
