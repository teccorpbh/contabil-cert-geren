export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          cliente_id: string | null
          created_at: string
          data_agendamento: string
          id: string
          pedido_segura: string
          status: Database["public"]["Enums"]["status_agendamento"]
          updated_at: string
          user_id: string
          venda_id: string
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          data_agendamento: string
          id?: string
          pedido_segura: string
          status?: Database["public"]["Enums"]["status_agendamento"]
          updated_at?: string
          user_id: string
          venda_id: string
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          data_agendamento?: string
          id?: string
          pedido_segura?: string
          status?: Database["public"]["Enums"]["status_agendamento"]
          updated_at?: string
          user_id?: string
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      certificados: {
        Row: {
          cliente: string
          created_at: string
          dias_vencimento: number | null
          documento: string
          id: string
          preco_custo: number | null
          status: Database["public"]["Enums"]["status_certificado"]
          tipo: string
          updated_at: string
          user_id: string
          validade: string
          venda_id: string
        }
        Insert: {
          cliente: string
          created_at?: string
          dias_vencimento?: number | null
          documento: string
          id?: string
          preco_custo?: number | null
          status?: Database["public"]["Enums"]["status_certificado"]
          tipo: string
          updated_at?: string
          user_id: string
          validade: string
          venda_id: string
        }
        Update: {
          cliente?: string
          created_at?: string
          dias_vencimento?: number | null
          documento?: string
          id?: string
          preco_custo?: number | null
          status?: Database["public"]["Enums"]["status_certificado"]
          tipo?: string
          updated_at?: string
          user_id?: string
          validade?: string
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificados_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          cpf_cnpj: string
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          nome_razao_social: string
          numero: string | null
          status: Database["public"]["Enums"]["status_geral"]
          telefone: string | null
          tipo_pessoa: Database["public"]["Enums"]["tipo_pessoa"]
          updated_at: string
          user_id: string
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf_cnpj: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          nome_razao_social: string
          numero?: string | null
          status?: Database["public"]["Enums"]["status_geral"]
          telefone?: string | null
          tipo_pessoa: Database["public"]["Enums"]["tipo_pessoa"]
          updated_at?: string
          user_id: string
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf_cnpj?: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          nome_razao_social?: string
          numero?: string | null
          status?: Database["public"]["Enums"]["status_geral"]
          telefone?: string | null
          tipo_pessoa?: Database["public"]["Enums"]["tipo_pessoa"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      comissoes: {
        Row: {
          created_at: string
          data_pagamento: string | null
          id: string
          indicador_id: string | null
          observacoes: string | null
          percentual: number
          status: Database["public"]["Enums"]["status_comissao"]
          updated_at: string
          user_id: string
          valor: number
          venda_id: string
          vendedor_id: string | null
        }
        Insert: {
          created_at?: string
          data_pagamento?: string | null
          id?: string
          indicador_id?: string | null
          observacoes?: string | null
          percentual: number
          status?: Database["public"]["Enums"]["status_comissao"]
          updated_at?: string
          user_id: string
          valor: number
          venda_id: string
          vendedor_id?: string | null
        }
        Update: {
          created_at?: string
          data_pagamento?: string | null
          id?: string
          indicador_id?: string | null
          observacoes?: string | null
          percentual?: number
          status?: Database["public"]["Enums"]["status_comissao"]
          updated_at?: string
          user_id?: string
          valor?: number
          venda_id?: string
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comissoes_indicador_id_fkey"
            columns: ["indicador_id"]
            isOneToOne: false
            referencedRelation: "indicadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comissoes_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comissoes_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_a_pagar: {
        Row: {
          certificado_id: string | null
          comissao_id: string | null
          created_at: string
          data_emissao: string
          data_pagamento: string | null
          data_vencimento: string
          descricao: string
          fornecedor: string
          id: string
          observacoes: string | null
          status: Database["public"]["Enums"]["status_conta_pagar"]
          tipo: Database["public"]["Enums"]["tipo_conta"]
          updated_at: string
          user_id: string
          valor: number
          venda_id: string | null
        }
        Insert: {
          certificado_id?: string | null
          comissao_id?: string | null
          created_at?: string
          data_emissao?: string
          data_pagamento?: string | null
          data_vencimento: string
          descricao: string
          fornecedor: string
          id?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_conta_pagar"]
          tipo?: Database["public"]["Enums"]["tipo_conta"]
          updated_at?: string
          user_id: string
          valor: number
          venda_id?: string | null
        }
        Update: {
          certificado_id?: string | null
          comissao_id?: string | null
          created_at?: string
          data_emissao?: string
          data_pagamento?: string | null
          data_vencimento?: string
          descricao?: string
          fornecedor?: string
          id?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_conta_pagar"]
          tipo?: Database["public"]["Enums"]["tipo_conta"]
          updated_at?: string
          user_id?: string
          valor?: number
          venda_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contas_a_pagar_certificado_id_fkey"
            columns: ["certificado_id"]
            isOneToOne: false
            referencedRelation: "certificados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_a_pagar_comissao_id_fkey"
            columns: ["comissao_id"]
            isOneToOne: false
            referencedRelation: "comissoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_a_pagar_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      indicadores: {
        Row: {
          created_at: string
          data_cadastro: string
          email: string
          id: string
          nome: string
          percentual_comissao: number
          status: Database["public"]["Enums"]["status_indicador"]
          telefone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_cadastro?: string
          email: string
          id?: string
          nome: string
          percentual_comissao?: number
          status?: Database["public"]["Enums"]["status_indicador"]
          telefone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_cadastro?: string
          email?: string
          id?: string
          nome?: string
          percentual_comissao?: number
          status?: Database["public"]["Enums"]["status_indicador"]
          telefone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vendas: {
        Row: {
          asaas_payment_id: string | null
          boleto_url: string | null
          cliente: string
          cliente_id: string | null
          created_at: string
          custo: number | null
          data: string
          data_vencimento: string | null
          id: string
          indicador_id: string | null
          invoice_url: string | null
          nosso_numero: string | null
          pedido_segura: string
          responsavel: string
          status: Database["public"]["Enums"]["status_venda"]
          status_pagamento: Database["public"]["Enums"]["status_pagamento"]
          updated_at: string
          user_id: string
          valor: number
          vendedor_id: string | null
        }
        Insert: {
          asaas_payment_id?: string | null
          boleto_url?: string | null
          cliente: string
          cliente_id?: string | null
          created_at?: string
          custo?: number | null
          data?: string
          data_vencimento?: string | null
          id?: string
          indicador_id?: string | null
          invoice_url?: string | null
          nosso_numero?: string | null
          pedido_segura: string
          responsavel: string
          status?: Database["public"]["Enums"]["status_venda"]
          status_pagamento?: Database["public"]["Enums"]["status_pagamento"]
          updated_at?: string
          user_id: string
          valor: number
          vendedor_id?: string | null
        }
        Update: {
          asaas_payment_id?: string | null
          boleto_url?: string | null
          cliente?: string
          cliente_id?: string | null
          created_at?: string
          custo?: number | null
          data?: string
          data_vencimento?: string | null
          id?: string
          indicador_id?: string | null
          invoice_url?: string | null
          nosso_numero?: string | null
          pedido_segura?: string
          responsavel?: string
          status?: Database["public"]["Enums"]["status_venda"]
          status_pagamento?: Database["public"]["Enums"]["status_pagamento"]
          updated_at?: string
          user_id?: string
          valor?: number
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_indicador_id_fkey"
            columns: ["indicador_id"]
            isOneToOne: false
            referencedRelation: "indicadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      vendedores: {
        Row: {
          created_at: string
          data_cadastro: string
          email: string
          id: string
          nome: string
          percentual_comissao: number
          status: Database["public"]["Enums"]["status_geral"]
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_cadastro?: string
          email: string
          id?: string
          nome: string
          percentual_comissao?: number
          status?: Database["public"]["Enums"]["status_geral"]
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_cadastro?: string
          email?: string
          id?: string
          nome?: string
          percentual_comissao?: number
          status?: Database["public"]["Enums"]["status_geral"]
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      status_agendamento: "Agendado" | "Realizado" | "Cancelado" | "Reagendado"
      status_certificado: "Emitido" | "Pendente" | "Cancelado"
      status_comissao: "Paga" | "Pendente" | "A Receber"
      status_conta_pagar: "Pendente" | "Pago" | "Vencido" | "Cancelado"
      status_geral: "Ativo" | "Inativo"
      status_indicador: "Ativo" | "Inativo"
      status_pagamento: "Pendente" | "Pago" | "Vencido"
      status_venda: "Pendente" | "Emitido" | "Cancelado"
      tipo_conta:
        | "Certificado"
        | "Fornecedor"
        | "Despesa Operacional"
        | "Outros"
        | "Comissao"
      tipo_pessoa: "PF" | "PJ"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      status_agendamento: ["Agendado", "Realizado", "Cancelado", "Reagendado"],
      status_certificado: ["Emitido", "Pendente", "Cancelado"],
      status_comissao: ["Paga", "Pendente", "A Receber"],
      status_conta_pagar: ["Pendente", "Pago", "Vencido", "Cancelado"],
      status_geral: ["Ativo", "Inativo"],
      status_indicador: ["Ativo", "Inativo"],
      status_pagamento: ["Pendente", "Pago", "Vencido"],
      status_venda: ["Pendente", "Emitido", "Cancelado"],
      tipo_conta: [
        "Certificado",
        "Fornecedor",
        "Despesa Operacional",
        "Outros",
        "Comissao",
      ],
      tipo_pessoa: ["PF", "PJ"],
    },
  },
} as const
