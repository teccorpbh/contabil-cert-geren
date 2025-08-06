export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      certificados: {
        Row: {
          cliente: string
          created_at: string
          dias_vencimento: number | null
          documento: string
          id: string
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
          indicador_id: string
          observacoes: string | null
          percentual: number
          status: Database["public"]["Enums"]["status_comissao"]
          updated_at: string
          user_id: string
          valor: number
          venda_id: string
        }
        Insert: {
          created_at?: string
          data_pagamento?: string | null
          id?: string
          indicador_id: string
          observacoes?: string | null
          percentual: number
          status?: Database["public"]["Enums"]["status_comissao"]
          updated_at?: string
          user_id: string
          valor: number
          venda_id: string
        }
        Update: {
          created_at?: string
          data_pagamento?: string | null
          id?: string
          indicador_id?: string
          observacoes?: string | null
          percentual?: number
          status?: Database["public"]["Enums"]["status_comissao"]
          updated_at?: string
          user_id?: string
          valor?: number
          venda_id?: string
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
          cliente: string
          cliente_id: string | null
          created_at: string
          data: string
          data_vencimento: string | null
          id: string
          indicador_id: string | null
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
          cliente: string
          cliente_id?: string | null
          created_at?: string
          data?: string
          data_vencimento?: string | null
          id?: string
          indicador_id?: string | null
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
          cliente?: string
          cliente_id?: string | null
          created_at?: string
          data?: string
          data_vencimento?: string | null
          id?: string
          indicador_id?: string | null
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
      status_certificado: "Emitido" | "Pendente" | "Cancelado"
      status_comissao: "Paga" | "Pendente"
      status_geral: "Ativo" | "Inativo"
      status_indicador: "Ativo" | "Inativo"
      status_pagamento: "Pendente" | "Pago" | "Vencido"
      status_venda: "Pendente" | "Emitido" | "Cancelado"
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
      status_certificado: ["Emitido", "Pendente", "Cancelado"],
      status_comissao: ["Paga", "Pendente"],
      status_geral: ["Ativo", "Inativo"],
      status_indicador: ["Ativo", "Inativo"],
      status_pagamento: ["Pendente", "Pago", "Vencido"],
      status_venda: ["Pendente", "Emitido", "Cancelado"],
      tipo_pessoa: ["PF", "PJ"],
    },
  },
} as const
