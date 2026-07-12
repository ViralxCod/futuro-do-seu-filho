// Depoimentos em formato de "print de WhatsApp" — avatar, hora, duplo check,
// textura de fundo do WhatsApp e um card com barrinha de áudio.
// ⚠️ Conteúdo fictício de exemplo — ver aviso em src/config.ts (socialProof):
// substitua por depoimentos REAIS autorizados antes de rodar tráfego.

interface Print {
  name: string
  time: string
  skin: string // tom do avatar
  text?: string
  audio?: string // duração do áudio (ex.: '0:42')
}

const prints: Print[] = [
  {
    name: 'Juliana M. · mãe da Alice (6)',
    time: '18:42',
    skin: '#e8b88a',
    text: 'O ponto cego era EXATAMENTE a frase que eu falo todo dia às 18h. Fiquei arrepiada. 😳',
  },
  {
    name: 'Renata S. · mãe do Miguel (4)',
    time: '21:17',
    skin: '#c68863',
    audio: '0:42',
  },
  {
    name: 'Patrícia L. · mãe do Davi (5)',
    time: '20:03',
    skin: '#9c6644',
    text: 'Fiz o Ritual dos 10 Minutos ontem depois da birra. Ele veio me abraçar sozinho. Chorei de novo — mas de alívio. 🙏',
  },
]

function Avatar({ skin }: { skin: string }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" className="shrink-0 rounded-full" aria-hidden="true">
      <circle cx="17" cy="17" r="17" fill="#6a7175" />
      <circle cx="17" cy="13" r="6" fill={skin} />
      <path d="M5 30 a12 10 0 0 1 24 0 Z" fill={skin} />
    </svg>
  )
}

function Checks() {
  return (
    <svg width="14" height="9" viewBox="0 0 16 10" fill="#53bdeb" aria-hidden="true">
      <path d="M11.07.65a.5.5 0 0 0-.7.08L5.7 6.6 3.63 4.6a.5.5 0 1 0-.7.72l2.47 2.38a.5.5 0 0 0 .74-.05L11.15 1.35a.5.5 0 0 0-.08-.7z" />
      <path d="M15.07.65a.5.5 0 0 0-.7.08L9.7 6.6l-.44-.42-.63.79.72.7a.5.5 0 0 0 .74-.06L15.15 1.35a.5.5 0 0 0-.08-.7z" />
    </svg>
  )
}

// Textura sutil de fundo estilo WhatsApp (doodle simplificado em SVG)
const WA_BG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><g fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1.4"><circle cx="16" cy="18" r="5"/><path d="M50 10 l8 8 M50 18 l8 -8"/><rect x="44" y="46" width="12" height="9" rx="2"/><path d="M12 52 q6 -8 12 0"/><circle cx="66" cy="66" r="4"/></g></svg>`,
  )

export function WhatsAppPrints() {
  return (
    <div className="space-y-3">
      {prints.map((p, i) => (
        <div key={i} className="rounded-xl bg-[#0b141a] p-3 shadow-lg" style={{ backgroundImage: `url("${WA_BG}")` }}>
          <div className="mb-2 flex items-center gap-2">
            <Avatar skin={p.skin} />
            <p className="text-[11px] font-bold text-[#8696a0]">{p.name}</p>
          </div>
          <div className="flex justify-end">
            <div className="relative max-w-[88%] rounded-lg rounded-tr-none bg-[#005c4b] px-3 pb-4 pt-2 text-[13px] leading-snug text-[#e9edef]">
              {p.audio ? (
                <span className="flex items-center gap-2 py-1 pr-10">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#aebac1" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <svg width="96" height="18" viewBox="0 0 96 18" aria-hidden="true">
                    {Array.from({ length: 24 }, (_, j) => {
                      const h = [6, 10, 14, 8, 12, 16, 9, 5][j % 8]
                      return <rect key={j} x={j * 4} y={(18 - h) / 2} width="2.2" height={h} rx="1" fill={j < 9 ? '#53bdeb' : '#aebac1'} />
                    })}
                  </svg>
                  <span className="text-[11px] text-[#aebac1]">{p.audio}</span>
                </span>
              ) : (
                p.text
              )}
              <span className="absolute bottom-1 right-2 flex items-center gap-1 text-[9px] text-[#8696a0]">
                {p.time}
                <Checks />
              </span>
            </div>
          </div>
        </div>
      ))}
      <p className="text-center text-[10px] text-white/35">Dramatização baseada em relatos reais</p>
    </div>
  )
}
