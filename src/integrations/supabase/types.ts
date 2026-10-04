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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      clientes_fornecedores: {
        Row: {
          ativo: boolean | null
          bairro: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          cpf_cnpj: string
          created_at: string
          email: string | null
          empresa_id: string
          endereco: string | null
          id: string
          ie: string | null
          nome_fantasia: string | null
          nome_razao_social: string
          numero: string | null
          telefone: string | null
          tipo: string
          tipo_pessoa: string | null
          uf: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf_cnpj: string
          created_at?: string
          email?: string | null
          empresa_id: string
          endereco?: string | null
          id?: string
          ie?: string | null
          nome_fantasia?: string | null
          nome_razao_social: string
          numero?: string | null
          telefone?: string | null
          tipo: string
          tipo_pessoa?: string | null
          uf?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf_cnpj?: string
          created_at?: string
          email?: string | null
          empresa_id?: string
          endereco?: string | null
          id?: string
          ie?: string | null
          nome_fantasia?: string | null
          nome_razao_social?: string
          numero?: string | null
          telefone?: string | null
          tipo?: string
          tipo_pessoa?: string | null
          uf?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas_segura"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          bairro: string | null
          celular: string | null
          cep: string | null
          certificado_arquivo: string | null
          certificado_senha: string | null
          certificado_status: string | null
          certificado_validade: string | null
          cidade: string | null
          cnpj: string
          codigo: string
          complemento: string | null
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          logradouro: string | null
          nome_fantasia: string
          numero: string | null
          razao_social: string
          regime_tributario: string
          site: string | null
          status: string
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bairro?: string | null
          celular?: string | null
          cep?: string | null
          certificado_arquivo?: string | null
          certificado_senha?: string | null
          certificado_status?: string | null
          certificado_validade?: string | null
          cidade?: string | null
          cnpj: string
          codigo: string
          complemento?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          logradouro?: string | null
          nome_fantasia: string
          numero?: string | null
          razao_social: string
          regime_tributario: string
          site?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bairro?: string | null
          celular?: string | null
          cep?: string | null
          certificado_arquivo?: string | null
          certificado_senha?: string | null
          certificado_status?: string | null
          certificado_validade?: string | null
          cidade?: string | null
          cnpj?: string
          codigo?: string
          complemento?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          logradouro?: string | null
          nome_fantasia?: string
          numero?: string | null
          razao_social?: string
          regime_tributario?: string
          site?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      formas_pagamento: {
        Row: {
          aceita_parcelamento: boolean
          ativo: boolean
          codigo: string
          created_at: string
          descricao: string
          empresa_id: string
          id: string
          max_parcelas: number | null
          taxa_desconto: number | null
          updated_at: string
        }
        Insert: {
          aceita_parcelamento?: boolean
          ativo?: boolean
          codigo: string
          created_at?: string
          descricao: string
          empresa_id: string
          id?: string
          max_parcelas?: number | null
          taxa_desconto?: number | null
          updated_at?: string
        }
        Update: {
          aceita_parcelamento?: boolean
          ativo?: boolean
          codigo?: string
          created_at?: string
          descricao?: string
          empresa_id?: string
          id?: string
          max_parcelas?: number | null
          taxa_desconto?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "formas_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "formas_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas_segura"
            referencedColumns: ["id"]
          },
        ]
      }
      modulos_sistema: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          icone: string | null
          id: string
          nome: string
          ordem: number | null
          rota: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
          ordem?: number | null
          rota?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          rota?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notas_fiscais: {
        Row: {
          cliente_fornecedor_id: string
          created_at: string
          dados_fiscais: Json
          data_emissao: string
          empresa_id: string
          id: string
          natureza_operacao: string
          numero: number
          serie: number
          status: string
          tipo: string
          updated_at: string
          valor_total: number
        }
        Insert: {
          cliente_fornecedor_id: string
          created_at?: string
          dados_fiscais: Json
          data_emissao?: string
          empresa_id: string
          id?: string
          natureza_operacao: string
          numero: number
          serie?: number
          status?: string
          tipo: string
          updated_at?: string
          valor_total: number
        }
        Update: {
          cliente_fornecedor_id?: string
          created_at?: string
          dados_fiscais?: Json
          data_emissao?: string
          empresa_id?: string
          id?: string
          natureza_operacao?: string
          numero?: number
          serie?: number
          status?: string
          tipo?: string
          updated_at?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "notas_fiscais_cliente_fornecedor_id_fkey"
            columns: ["cliente_fornecedor_id"]
            isOneToOne: false
            referencedRelation: "clientes_fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas_segura"
            referencedColumns: ["id"]
          },
        ]
      }
      permissoes: {
        Row: {
          acao: Database["public"]["Enums"]["tipo_acao"]
          created_at: string | null
          id: string
          modulo_id: string
          permitido: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          acao: Database["public"]["Enums"]["tipo_acao"]
          created_at?: string | null
          id?: string
          modulo_id: string
          permitido?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          acao?: Database["public"]["Enums"]["tipo_acao"]
          created_at?: string | null
          id?: string
          modulo_id?: string
          permitido?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permissoes_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "modulos_sistema"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean
          cest: string | null
          codigo_sku: string
          created_at: string
          descricao: string
          empresa_id: string
          estoque_atual: number
          estoque_minimo: number
          id: string
          ncm: string | null
          preco_custo: number
          preco_venda: number
          unidade: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cest?: string | null
          codigo_sku: string
          created_at?: string
          descricao: string
          empresa_id: string
          estoque_atual?: number
          estoque_minimo?: number
          id?: string
          ncm?: string | null
          preco_custo?: number
          preco_venda?: number
          unidade?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cest?: string | null
          codigo_sku?: string
          created_at?: string
          descricao?: string
          empresa_id?: string
          estoque_atual?: number
          estoque_minimo?: number
          id?: string
          ncm?: string | null
          preco_custo?: number
          preco_venda?: number
          unidade?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas_segura"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos_servicos: {
        Row: {
          aliquotas: Json | null
          ativo: boolean | null
          codigo: string
          created_at: string
          descricao: string
          empresa_id: string
          id: string
          updated_at: string
          valor_unitario: number
        }
        Insert: {
          aliquotas?: Json | null
          ativo?: boolean | null
          codigo: string
          created_at?: string
          descricao: string
          empresa_id: string
          id?: string
          updated_at?: string
          valor_unitario: number
        }
        Update: {
          aliquotas?: Json | null
          ativo?: boolean | null
          codigo?: string
          created_at?: string
          descricao?: string
          empresa_id?: string
          id?: string
          updated_at?: string
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "produtos_servicos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_servicos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas_segura"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cadastrado_por: string | null
          created_at: string | null
          data_cadastro: string | null
          departamento: string | null
          email: string
          id: string
          nome_completo: string
          observacoes: string | null
          status: string | null
          telefone: string | null
          ultimo_acesso: string | null
          updated_at: string | null
        }
        Insert: {
          cadastrado_por?: string | null
          created_at?: string | null
          data_cadastro?: string | null
          departamento?: string | null
          email: string
          id: string
          nome_completo: string
          observacoes?: string | null
          status?: string | null
          telefone?: string | null
          ultimo_acesso?: string | null
          updated_at?: string | null
        }
        Update: {
          cadastrado_por?: string | null
          created_at?: string | null
          data_cadastro?: string | null
          departamento?: string | null
          email?: string
          id?: string
          nome_completo?: string
          observacoes?: string | null
          status?: string | null
          telefone?: string | null
          ultimo_acesso?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_empresas: {
        Row: {
          created_at: string | null
          empresa_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          empresa_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          empresa_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas_segura"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      empresas_segura: {
        Row: {
          bairro: string | null
          celular: string | null
          cep: string | null
          certificado_arquivo: string | null
          certificado_status: string | null
          certificado_validade: string | null
          cidade: string | null
          cnpj: string | null
          codigo: string | null
          complemento: string | null
          created_at: string | null
          email: string | null
          estado: string | null
          id: string | null
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          logradouro: string | null
          nome_fantasia: string | null
          numero: string | null
          razao_social: string | null
          regime_tributario: string | null
          site: string | null
          status: string | null
          telefone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bairro?: string | null
          celular?: string | null
          cep?: string | null
          certificado_arquivo?: string | null
          certificado_status?: string | null
          certificado_validade?: string | null
          cidade?: string | null
          cnpj?: string | null
          codigo?: string | null
          complemento?: string | null
          created_at?: string | null
          email?: string | null
          estado?: string | null
          id?: string | null
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          logradouro?: string | null
          nome_fantasia?: string | null
          numero?: string | null
          razao_social?: string | null
          regime_tributario?: string | null
          site?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bairro?: string | null
          celular?: string | null
          cep?: string | null
          certificado_arquivo?: string | null
          certificado_status?: string | null
          certificado_validade?: string | null
          cidade?: string | null
          cnpj?: string | null
          codigo?: string | null
          complemento?: string | null
          created_at?: string | null
          email?: string | null
          estado?: string | null
          id?: string | null
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          logradouro?: string | null
          nome_fantasia?: string | null
          numero?: string | null
          razao_social?: string | null
          regime_tributario?: string | null
          site?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_certificado_senha: { Args: { _empresa_id: string }; Returns: string }
      get_client_profiles_for_contador: {
        Args: never
        Returns: {
          departamento: string
          id: string
          nome_completo: string
          status: string
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      set_certificado_senha: {
        Args: { _empresa_id: string; _senha: string }
        Returns: boolean
      }
      tem_permissao: {
        Args: {
          _acao: Database["public"]["Enums"]["tipo_acao"]
          _modulo: string
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "contador" | "cliente"
      tipo_acao: "visualizar" | "criar" | "editar" | "excluir" | "exportar"
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
      app_role: ["admin", "contador", "cliente"],
      tipo_acao: ["visualizar", "criar", "editar", "excluir", "exportar"],
    },
  },
} as const
