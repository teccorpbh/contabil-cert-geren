
-- Criar enum para status de vendas
CREATE TYPE public.status_venda AS ENUM ('Pendente', 'Emitido', 'Cancelado');

-- Criar enum para status de pagamento
CREATE TYPE public.status_pagamento AS ENUM ('Pendente', 'Pago', 'Vencido');

-- Criar enum para status de certificado
CREATE TYPE public.status_certificado AS ENUM ('Emitido', 'Pendente', 'Cancelado');

-- Criar enum para status de indicador
CREATE TYPE public.status_indicador AS ENUM ('Ativo', 'Inativo');

-- Criar enum para status de comissao
CREATE TYPE public.status_comissao AS ENUM ('Paga', 'Pendente');

-- Tabela de indicadores
CREATE TABLE public.indicadores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT NOT NULL,
  percentual_comissao INTEGER NOT NULL DEFAULT 10,
  status status_indicador NOT NULL DEFAULT 'Ativo',
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de vendas
CREATE TABLE public.vendas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_segura TEXT NOT NULL,
  cliente TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  responsavel TEXT NOT NULL,
  indicador_id UUID REFERENCES public.indicadores(id),
  status status_venda NOT NULL DEFAULT 'Pendente',
  status_pagamento status_pagamento NOT NULL DEFAULT 'Pendente',
  data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_vencimento TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de certificados
CREATE TABLE public.certificados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL,
  documento TEXT NOT NULL,
  cliente TEXT NOT NULL,
  validade DATE NOT NULL,
  status status_certificado NOT NULL DEFAULT 'Pendente',
  dias_vencimento INTEGER,
  venda_id UUID REFERENCES public.vendas(id) NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de comissões
CREATE TABLE public.comissoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venda_id UUID REFERENCES public.vendas(id) NOT NULL,
  indicador_id UUID REFERENCES public.indicadores(id) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  percentual INTEGER NOT NULL,
  status status_comissao NOT NULL DEFAULT 'Pendente',
  data_pagamento TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.indicadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comissoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para indicadores
CREATE POLICY "Users can view their own indicadores" 
  ON public.indicadores 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own indicadores" 
  ON public.indicadores 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own indicadores" 
  ON public.indicadores 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own indicadores" 
  ON public.indicadores 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para vendas
CREATE POLICY "Users can view their own vendas" 
  ON public.vendas 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vendas" 
  ON public.vendas 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendas" 
  ON public.vendas 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vendas" 
  ON public.vendas 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para certificados
CREATE POLICY "Users can view their own certificados" 
  ON public.certificados 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own certificados" 
  ON public.certificados 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own certificados" 
  ON public.certificados 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own certificados" 
  ON public.certificados 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para comissões
CREATE POLICY "Users can view their own comissoes" 
  ON public.comissoes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own comissoes" 
  ON public.comissoes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comissoes" 
  ON public.comissoes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comissoes" 
  ON public.comissoes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Função para calcular dias até vencimento
CREATE OR REPLACE FUNCTION calculate_dias_vencimento()
RETURNS TRIGGER AS $$
BEGIN
  NEW.dias_vencimento := NEW.validade - CURRENT_DATE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular dias de vencimento automaticamente
CREATE TRIGGER update_dias_vencimento
  BEFORE INSERT OR UPDATE ON public.certificados
  FOR EACH ROW
  EXECUTE FUNCTION calculate_dias_vencimento();

-- Função para criar comissão automaticamente quando uma venda é criada com indicador
CREATE OR REPLACE FUNCTION create_comissao_for_venda()
RETURNS TRIGGER AS $$
DECLARE
  indicador_percentual INTEGER;
  comissao_valor DECIMAL(10,2);
BEGIN
  -- Só criar comissão se houver indicador
  IF NEW.indicador_id IS NOT NULL THEN
    -- Buscar percentual do indicador
    SELECT percentual_comissao INTO indicador_percentual
    FROM public.indicadores 
    WHERE id = NEW.indicador_id;
    
    -- Calcular valor da comissão
    comissao_valor := (NEW.valor * indicador_percentual / 100);
    
    -- Inserir comissão
    INSERT INTO public.comissoes (
      venda_id,
      indicador_id,
      valor,
      percentual,
      user_id
    ) VALUES (
      NEW.id,
      NEW.indicador_id,
      comissao_valor,
      indicador_percentual,
      NEW.user_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar comissão automaticamente
CREATE TRIGGER create_comissao_on_venda
  AFTER INSERT ON public.vendas
  FOR EACH ROW
  EXECUTE FUNCTION create_comissao_for_venda();
