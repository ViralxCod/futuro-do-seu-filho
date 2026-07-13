import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config'

/**
 * Cliente Supabase d'O Ninho. Fica `null` até você colar
 * SUPABASE_URL e SUPABASE_ANON_KEY em src/config.ts — nesse caso a
 * área de membros mostra uma tela de "configuração pendente".
 */
export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null

export interface Profile {
  id: string
  email: string
  nome: string | null
  whatsapp: string | null
  role: 'member' | 'admin'
  quiz_profile: 'A' | 'B' | 'C' | 'D' | null
  criado_em: string
}

export interface Product {
  id: string
  nome: string
  slug: string
  tipo: 'produto' | 'consulta'
  descricao: string | null
  preco: string | null
  checkout_url: string | null
  ativo: boolean
}

export interface Entitlement {
  id: string
  user_id: string
  product_id: string
  origem: 'compra' | 'manual'
  criado_em: string
}

export interface Purchase {
  id: string
  email: string
  produto: string
  valor: number | null
  gateway_id: string | null
  status: string
  criado_em: string
}

export interface Lead {
  id: string
  whatsapp: string
  nome: string | null
  origem: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  fbclid: string | null
  referrer: string | null
  landing_url: string | null
  status: 'lead' | 'comprou' | 'abandonou'
  opt_in: boolean
  opt_out: boolean
  criado_em: string
  comprou_em: string | null
}

export interface Envio {
  id: string
  lead_id: string | null
  whatsapp: string
  tipo: string
  canal: string
  mensagem: string | null
  status: string
  provider_id: string | null
  erro: string | null
  criado_em: string
}
