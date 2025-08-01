export type Database = {
  public: {
    Tables: {
      perfis: {
        Row: {
          id: string
          email: string
          nome_completo: string
          foto_url: string | null
          telefone: string | null
          cargo: 'admin' | 'medico' | 'assistente' | 'recepcionista'
          clinica_id: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id: string
          email: string
          nome_completo: string
          foto_url?: string | null
          telefone?: string | null
          cargo?: 'admin' | 'medico' | 'assistente' | 'recepcionista'
          clinica_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          email?: string
          nome_completo?: string
          foto_url?: string | null
          telefone?: string | null
          cargo?: 'admin' | 'medico' | 'assistente' | 'recepcionista'
          clinica_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
      }
      clinicas: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          endereco: string | null
          telefone: string | null
          email: string | null
          site: string | null
          logo_url: string | null
          configuracoes: any
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          endereco?: string | null
          telefone?: string | null
          email?: string | null
          site?: string | null
          logo_url?: string | null
          configuracoes?: any
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          endereco?: string | null
          telefone?: string | null
          email?: string | null
          site?: string | null
          logo_url?: string | null
          configuracoes?: any
          criado_em?: string
          atualizado_em?: string
        }
      }
      pacientes: {
        Row: {
          id: string
          clinica_id: string
          nome_completo: string
          email: string
          telefone: string
          data_nascimento: string
          genero: 'masculino' | 'feminino' | 'outro'
          cpf: string
          rg: string | null
          orgao_emissor: string | null
          uf_rg: string | null
          estado_civil: string | null
          profissao: string | null
          telefone_celular: string
          telefone_fixo: string | null
          cep: string
          logradouro: string
          numero: string
          complemento: string | null
          bairro: string
          cidade: string
          uf: string
          nome_emergencia: string | null
          parentesco_emergencia: string | null
          telefone_emergencia: string | null
          observacoes_emergencia: string | null
          tipo_sanguineo: string | null
          alergias_conhecidas: string[] | null
          medicamentos_uso: string[] | null
          historico_medico_detalhado: string | null
          observacoes_gerais: string | null
          foto_url: string | null
          qr_code: string | null
          data_ultima_consulta: string | null
          status_ativo: boolean
          whatsapp_id: string | null
          instagram_id: string | null
          ultimo_contato: string | null
          status: 'ativo' | 'inativo' | 'bloqueado'
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          clinica_id: string
          nome_completo: string
          email: string
          telefone: string
          data_nascimento: string
          genero: 'masculino' | 'feminino' | 'outro'
          cpf: string
          rg?: string | null
          orgao_emissor?: string | null
          uf_rg?: string | null
          estado_civil?: string | null
          profissao?: string | null
          telefone_celular: string
          telefone_fixo?: string | null
          cep: string
          logradouro: string
          numero: string
          complemento?: string | null
          bairro: string
          cidade: string
          uf: string
          nome_emergencia?: string | null
          parentesco_emergencia?: string | null
          telefone_emergencia?: string | null
          observacoes_emergencia?: string | null
          tipo_sanguineo?: string | null
          alergias_conhecidas?: string[] | null
          medicamentos_uso?: string[] | null
          historico_medico_detalhado?: string | null
          observacoes_gerais?: string | null
          foto_url?: string | null
          qr_code?: string | null
          data_ultima_consulta?: string | null
          status_ativo?: boolean
          whatsapp_id?: string | null
          instagram_id?: string | null
          ultimo_contato?: string | null
          status?: 'ativo' | 'inativo' | 'bloqueado'
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          clinica_id?: string
          nome_completo?: string
          email?: string
          telefone?: string
          data_nascimento?: string
          genero?: 'masculino' | 'feminino' | 'outro'
          cpf?: string
          rg?: string | null
          orgao_emissor?: string | null
          uf_rg?: string | null
          estado_civil?: string | null
          profissao?: string | null
          telefone_celular?: string
          telefone_fixo?: string | null
          cep?: string
          logradouro?: string
          numero?: string
          complemento?: string | null
          bairro?: string
          cidade?: string
          uf?: string
          nome_emergencia?: string | null
          parentesco_emergencia?: string | null
          telefone_emergencia?: string | null
          observacoes_emergencia?: string | null
          tipo_sanguineo?: string | null
          alergias_conhecidas?: string[] | null
          medicamentos_uso?: string[] | null
          historico_medico_detalhado?: string | null
          observacoes_gerais?: string | null
          foto_url?: string | null
          qr_code?: string | null
          data_ultima_consulta?: string | null
          status_ativo?: boolean
          whatsapp_id?: string | null
          instagram_id?: string | null
          ultimo_contato?: string | null
          status?: 'ativo' | 'inativo' | 'bloqueado'
          criado_em?: string
          atualizado_em?: string
        }
      }
      consultas: {
        Row: {
          id: string
          clinica_id: string
          paciente_id: string
          medico_id: string
          titulo: string
          descricao: string | null
          data_consulta: string
          duracao_minutos: number
          status: 'agendada' | 'confirmada' | 'concluida' | 'cancelada' | 'faltou'
          google_calendar_event_id: string | null
          lembrete_enviado: boolean
          observacoes: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          clinica_id: string
          paciente_id: string
          medico_id: string
          titulo: string
          descricao?: string | null
          data_consulta: string
          duracao_minutos?: number
          status?: 'agendada' | 'confirmada' | 'concluida' | 'cancelada' | 'faltou'
          google_calendar_event_id?: string | null
          lembrete_enviado?: boolean
          observacoes?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          clinica_id?: string
          paciente_id?: string
          medico_id?: string
          titulo?: string
          descricao?: string | null
          data_consulta?: string
          duracao_minutos?: number
          status?: 'agendada' | 'confirmada' | 'concluida' | 'cancelada' | 'faltou'
          google_calendar_event_id?: string | null
          lembrete_enviado?: boolean
          observacoes?: string | null
          criado_em?: string
          atualizado_em?: string
        }
      }
      conversas: {
        Row: {
          id: string
          clinica_id: string
          paciente_id: string
          plataforma: 'whatsapp' | 'instagram'
          id_conversa_plataforma: string
          status: 'ativa' | 'fechada' | 'escalada'
          atribuida_para: string | null
          ultima_mensagem_em: string
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          clinica_id: string
          paciente_id: string
          plataforma: 'whatsapp' | 'instagram'
          id_conversa_plataforma: string
          status?: 'ativa' | 'fechada' | 'escalada'
          atribuida_para?: string | null
          ultima_mensagem_em?: string
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          clinica_id?: string
          paciente_id?: string
          plataforma?: 'whatsapp' | 'instagram'
          id_conversa_plataforma?: string
          status?: 'ativa' | 'fechada' | 'escalada'
          atribuida_para?: string | null
          ultima_mensagem_em?: string
          criado_em?: string
          atualizado_em?: string
        }
      }
      mensagens: {
        Row: {
          id: string
          conversa_id: string
          tipo_remetente: 'paciente' | 'ia' | 'humano' | 'sistema'
          remetente_id: string | null
          conteudo: string
          tipo_mensagem: 'texto' | 'imagem' | 'audio' | 'documento' | 'localizacao'
          metadados: any
          id_mensagem_plataforma: string | null
          gerada_por_ia: boolean
          confianca_ia: number | null
          criado_em: string
        }
        Insert: {
          id?: string
          conversa_id: string
          tipo_remetente: 'paciente' | 'ia' | 'humano' | 'sistema'
          remetente_id?: string | null
          conteudo: string
          tipo_mensagem?: 'texto' | 'imagem' | 'audio' | 'documento' | 'localizacao'
          metadados?: any
          id_mensagem_plataforma?: string | null
          gerada_por_ia?: boolean
          confianca_ia?: number | null
          criado_em?: string
        }
        Update: {
          id?: string
          conversa_id?: string
          tipo_remetente?: 'paciente' | 'ia' | 'humano' | 'sistema'
          remetente_id?: string | null
          conteudo?: string
          tipo_mensagem?: 'texto' | 'imagem' | 'audio' | 'documento' | 'localizacao'
          metadados?: any
          id_mensagem_plataforma?: string | null
          gerada_por_ia?: boolean
          confianca_ia?: number | null
          criado_em?: string
        }
      }
      documentos_pacientes: {
        Row: {
          id: string
          paciente_id: string
          clinica_id: string
          nome_arquivo: string
          tipo_arquivo: string
          tamanho_arquivo: number
          url_arquivo: string
          categoria: 'exame' | 'receita' | 'atestado' | 'laudo' | 'outros'
          descricao: string | null
          data_documento: string | null
          criado_por: string
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          paciente_id: string
          clinica_id: string
          nome_arquivo: string
          tipo_arquivo: string
          tamanho_arquivo: number
          url_arquivo: string
          categoria?: 'exame' | 'receita' | 'atestado' | 'laudo' | 'outros'
          descricao?: string | null
          data_documento?: string | null
          criado_por: string
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          paciente_id?: string
          clinica_id?: string
          nome_arquivo?: string
          tipo_arquivo?: string
          tamanho_arquivo?: number
          url_arquivo?: string
          categoria?: 'exame' | 'receita' | 'atestado' | 'laudo' | 'outros'
          descricao?: string | null
          data_documento?: string | null
          criado_por?: string
          criado_em?: string
          atualizado_em?: string
        }
      }
      pacientes_historico: {
        Row: {
          id: string
          paciente_id: string
          operacao: 'INSERT' | 'UPDATE' | 'DELETE'
          dados_anteriores: any | null
          dados_novos: any | null
          usuario_id: string | null
          timestamp: string
        }
        Insert: {
          id?: string
          paciente_id: string
          operacao: 'INSERT' | 'UPDATE' | 'DELETE'
          dados_anteriores?: any | null
          dados_novos?: any | null
          usuario_id?: string | null
          timestamp?: string
        }
        Update: {
          id?: string
          paciente_id?: string
          operacao?: 'INSERT' | 'UPDATE' | 'DELETE'
          dados_anteriores?: any | null
          dados_novos?: any | null
          usuario_id?: string | null
          timestamp?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
