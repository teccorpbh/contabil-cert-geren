-- ETAPA 1: Adicionar campo preco_custo na tabela certificados
ALTER TABLE public.certificados 
ADD COLUMN preco_custo DECIMAL(10,2);

COMMENT ON COLUMN public.certificados.preco_custo IS 'Preço de custo do certificado pago à certificadora';

-- ETAPA 2: Criar ENUMs para contas a pagar
CREATE TYPE status_conta_pagar AS ENUM ('Pendente', 'Pago', 'Vencido', 'Cancelado');
CREATE TYPE tipo_conta AS ENUM ('Certificado', 'Fornecedor', 'Despesa Operacional', 'Outros');

-- ETAPA 3: Criar tabela contas_a_pagar
CREATE TABLE public.contas_a_pagar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  tipo tipo_conta NOT NULL DEFAULT 'Certificado',
  fornecedor TEXT NOT NULL,
  
  -- Datas
  data_emissao DATE NOT NULL DEFAULT CURRENT_DATE,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  
  -- Status
  status status_conta_pagar NOT NULL DEFAULT 'Pendente',
  
  -- Relações
  certificado_id UUID REFERENCES public.certificados(id) ON DELETE SET NULL,
  venda_id UUID REFERENCES public.vendas(id) ON DELETE SET NULL,
  
  -- Observações
  observacoes TEXT,
  
  -- Auditoria
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_contas_a_pagar_certificado ON public.contas_a_pagar(certificado_id);
CREATE INDEX idx_contas_a_pagar_venda ON public.contas_a_pagar(venda_id);
CREATE INDEX idx_contas_a_pagar_status ON public.contas_a_pagar(status);
CREATE INDEX idx_contas_a_pagar_vencimento ON public.contas_a_pagar(data_vencimento);
CREATE INDEX idx_contas_a_pagar_user ON public.contas_a_pagar(user_id);

-- RLS Policies
ALTER TABLE public.contas_a_pagar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contas_a_pagar"
  ON public.contas_a_pagar FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contas_a_pagar"
  ON public.contas_a_pagar FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contas_a_pagar"
  ON public.contas_a_pagar FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contas_a_pagar"
  ON public.contas_a_pagar FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_contas_a_pagar_updated_at
  BEFORE UPDATE ON public.contas_a_pagar
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para calcular status "Vencido" automaticamente
CREATE OR REPLACE FUNCTION public.update_conta_pagar_vencido()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Pendente' AND NEW.data_vencimento < CURRENT_DATE THEN
    NEW.status := 'Vencido';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER check_vencimento_conta_pagar
  BEFORE INSERT OR UPDATE ON public.contas_a_pagar
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conta_pagar_vencido();

-- ETAPA 4: Criar Trigger para criar conta a pagar automaticamente ao inserir certificado
CREATE OR REPLACE FUNCTION public.create_conta_pagar_for_certificado()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.preco_custo IS NOT NULL AND NEW.preco_custo > 0 THEN
    INSERT INTO public.contas_a_pagar (
      descricao,
      valor,
      tipo,
      fornecedor,
      data_emissao,
      data_vencimento,
      status,
      certificado_id,
      venda_id,
      observacoes,
      user_id
    ) VALUES (
      'Certificado ' || NEW.tipo || ' - ' || NEW.documento,
      NEW.preco_custo,
      'Certificado',
      'Segura Online',
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '30 days',
      'Pendente',
      NEW.id,
      NEW.venda_id,
      'Conta a pagar criada automaticamente para certificado',
      NEW.user_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER create_conta_pagar_on_certificado
  AFTER INSERT ON public.certificados
  FOR EACH ROW
  EXECUTE FUNCTION public.create_conta_pagar_for_certificado();