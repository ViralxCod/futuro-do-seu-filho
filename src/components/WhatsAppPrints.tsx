// Depoimentos reais em imagem (prints de WhatsApp + grade de avaliações).
// As imagens ficam em /public e são servidas pela raiz do site.
// ⚠️ Use apenas depoimentos REAIS autorizados — ver aviso em src/config.ts.

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

const imagens = [
  { src: `${BASE}/depoimentos-whatsapp.png`, alt: 'Conversas de mães no WhatsApp agradecendo pelo Mapa e pelo Manual' },
  { src: `${BASE}/depoimentos-reviews.png`, alt: 'Avaliações 5 estrelas de mães sobre o Manual da Mãe Presente' },
  { src: `${BASE}/depoimentos-prova-social.png`, alt: 'Depoimentos de mães nas redes sociais sobre O Ninho' },
]

export function WhatsAppPrints() {
  return (
    <div className="space-y-3">
      {imagens.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={img.alt}
          loading="lazy"
          className="w-full rounded-xl shadow-lg"
        />
      ))}
      <p className="text-center text-[10px] text-white/35">Depoimentos de clientes • dramatização baseada em relatos reais</p>
    </div>
  )
}
