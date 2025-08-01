-- Primeiro criar a função update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar enum para tipo de pessoa
CREATE TYPE tipo_pessoa AS ENUM ('PF', 'PJ');

-- Criar enum para status geral
CREATE TYPE status_geral AS ENUM ('Ativo', 'Inativo');

-- Criar tabela vendedores
CREATE TABLE public.vendedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  status status_geral NOT NULL DEFAULT 'Ativo',
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em vendedores
ALTER TABLE public.vendedores ENABLE ROW LEVEL SECURITY;

-- Políticas para vendedores
CREATE POLICY "Users can view their own vendedores" 
ON public.vendedores 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vendedores" 
ON public.vendedores 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendedores" 
ON public.vendedores 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vendedores" 
ON public.vendedores 
FOR DELETE 
USING (auth.uid() = user_id);

-- Criar tabela clientes
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_razao_social TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  tipo_pessoa tipo_pessoa NOT NULL,
  email TEXT,
  telefone TEXT,
  cep TEXT,
  endereco TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  inscricao_municipal TEXT,
  inscricao_estadual TEXT,
  status status_geral NOT NULL DEFAULT 'Ativo',
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cpf_cnpj, user_id)
);

-- Habilitar RLS em clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Políticas para clientes
CREATE POLICY "Users can view their own clientes" 
ON public.clientes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clientes" 
ON public.clientes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clientes" 
ON public.clientes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clientes" 
ON public.clientes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Adicionar relacionamentos na tabela vendas
ALTER TABLE public.vendas 
ADD COLUMN vendedor_id UUID REFERENCES public.vendedores(id),
ADD COLUMN cliente_id UUID REFERENCES public.clientes(id);

-- Criar trigger para updated_at em vendedores
CREATE TRIGGER update_vendedores_updated_at
BEFORE UPDATE ON public.vendedores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar trigger para updated_at em clientes
CREATE TRIGGER update_clientes_updated_at
BEFORE UPDATE ON public.clientes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para performance
CREATE INDEX idx_vendedores_user_id ON public.vendedores(user_id);
CREATE INDEX idx_vendedores_status ON public.vendedores(status);
CREATE INDEX idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX idx_clientes_cpf_cnpj ON public.clientes(cpf_cnpj);
CREATE INDEX idx_clientes_status ON public.clientes(status);
CREATE INDEX idx_vendas_vendedor_id ON public.vendas(vendedor_id);
CREATE INDEX idx_vendas_cliente_id ON public.vendas(cliente_id);