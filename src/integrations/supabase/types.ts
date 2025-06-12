export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        }
        Insert: {
          cliente: string
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
        }
        Update: {
          cliente?: string
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
        }
        Relationships: [
          {
            foreignKeyName: "vendas_indicador_id_fkey"
            columns: ["indicador_id"]
            isOneToOne: false
            referencedRelation: "indicadores"
            referencedColumns: ["id"]
          },
        ]
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
      status_indicador: "Ativo" | "Inativo"
      status_pagamento: "Pendente" | "Pago" | "Vencido"
      status_venda: "Pendente" | "Emitido" | "Cancelado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      status_certificado: ["Emitido", "Pendente", "Cancelado"],
      status_comissao: ["Paga", "Pendente"],
      status_indicador: ["Ativo", "Inativo"],
      status_pagamento: ["Pendente", "Pago", "Vencido"],
      status_venda: ["Pendente", "Emitido", "Cancelado"],
    },
  },
} as const
