-- Fase 1: Adicionar coluna custo na tabela vendas
ALTER TABLE vendas ADD COLUMN IF NOT EXISTS custo DECIMAL(10,2) DEFAULT 0;

-- Fase 2: Adicionar novo status 'A Receber' ao ENUM status_comissao
ALTER TYPE status_comissao ADD VALUE IF NOT EXISTS 'A Receber';

-- Fase 3: Adicionar coluna comissao_id em contas_a_pagar
ALTER TABLE contas_a_pagar ADD COLUMN IF NOT EXISTS comissao_id UUID REFERENCES comissoes(id);

-- Fase 4: Adicionar tipo 'Comissao' ao ENUM tipo_conta
ALTER TYPE tipo_conta ADD VALUE IF NOT EXISTS 'Comissao';

-- Fase 5: Modificar função create_comissao_for_venda para calcular sobre (valor - custo)
CREATE OR REPLACE FUNCTION public.create_comissao_for_venda()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  indicador_percentual INTEGER;
  vendedor_percentual INTEGER;
  comissao_valor DECIMAL(10,2);
  valor_base DECIMAL(10,2);
BEGIN
  -- Calcular valor base (valor - custo)
  valor_base := NEW.valor - COALESCE(NEW.custo, 0);
  
  -- Criar comissão para indicador se houver indicador_id
  IF NEW.indicador_id IS NOT NULL THEN
    -- Buscar percentual do indicador
    SELECT percentual_comissao INTO indicador_percentual
    FROM public.indicadores 
    WHERE id = NEW.indicador_id;
    
    -- Calcular valor da comissão do indicador sobre (valor - custo)
    comissao_valor := (valor_base * indicador_percentual / 100);
    
    -- Inserir comissão do indicador
    INSERT INTO public.comissoes (
      venda_id,
      indicador_id,
      valor,
      percentual,
      user_id,
      observacoes
    ) VALUES (
      NEW.id,
      NEW.indicador_id,
      comissao_valor,
      indicador_percentual,
      NEW.user_id,
      'Comissão do indicador calculada sobre (valor - custo)'
    );
  END IF;
  
  -- Criar comissão para vendedor se houver vendedor_id
  IF NEW.vendedor_id IS NOT NULL THEN
    -- Buscar percentual do vendedor
    SELECT percentual_comissao INTO vendedor_percentual
    FROM public.vendedores 
    WHERE id = NEW.vendedor_id;
    
    -- Calcular valor da comissão do vendedor sobre (valor - custo)
    comissao_valor := (valor_base * vendedor_percentual / 100);
    
    -- Inserir comissão do vendedor
    INSERT INTO public.comissoes (
      venda_id,
      vendedor_id,
      valor,
      percentual,
      user_id,
      observacoes
    ) VALUES (
      NEW.id,
      NEW.vendedor_id,
      comissao_valor,
      vendedor_percentual,
      NEW.user_id,
      'Comissão do vendedor calculada sobre (valor - custo)'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fase 6: Criar função para atualizar status da comissão quando venda for paga
CREATE OR REPLACE FUNCTION public.update_comissao_status_on_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  comissao_record RECORD;
  indicador_nome TEXT;
  vendedor_nome TEXT;
  tipo_comissao TEXT;
BEGIN
  -- Verificar se o status mudou para "Pago"
  IF OLD.status_pagamento != 'Pago' AND NEW.status_pagamento = 'Pago' THEN
    -- Atualizar todas as comissões relacionadas para "A Receber"
    FOR comissao_record IN 
      SELECT * FROM public.comissoes 
      WHERE venda_id = NEW.id AND status = 'Pendente'
    LOOP
      -- Atualizar status da comissão
      UPDATE public.comissoes 
      SET status = 'A Receber' 
      WHERE id = comissao_record.id;
      
      -- Determinar tipo e nome do beneficiário
      IF comissao_record.indicador_id IS NOT NULL THEN
        SELECT nome INTO indicador_nome FROM public.indicadores WHERE id = comissao_record.indicador_id;
        tipo_comissao := 'Indicador: ' || indicador_nome;
      ELSIF comissao_record.vendedor_id IS NOT NULL THEN
        SELECT nome INTO vendedor_nome FROM public.vendedores WHERE id = comissao_record.vendedor_id;
        tipo_comissao := 'Vendedor: ' || vendedor_nome;
      ELSE
        tipo_comissao := 'Comissão';
      END IF;
      
      -- Criar conta a pagar para a comissão
      INSERT INTO public.contas_a_pagar (
        descricao,
        valor,
        tipo,
        fornecedor,
        data_emissao,
        data_vencimento,
        status,
        comissao_id,
        venda_id,
        observacoes,
        user_id
      ) VALUES (
        'Comissão - ' || tipo_comissao || ' - Venda #' || NEW.pedido_segura,
        comissao_record.valor,
        'Comissao',
        COALESCE(indicador_nome, vendedor_nome, 'N/A'),
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '30 days',
        'Pendente',
        comissao_record.id,
        NEW.id,
        'Conta criada automaticamente ao receber pagamento da venda',
        NEW.user_id
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fase 7: Criar trigger para chamar função quando venda for atualizada
DROP TRIGGER IF EXISTS trigger_update_comissao_on_payment ON public.vendas;
CREATE TRIGGER trigger_update_comissao_on_payment
AFTER UPDATE ON public.vendas
FOR EACH ROW
EXECUTE FUNCTION public.update_comissao_status_on_payment();

-- Fase 8: Criar função para atualizar comissão quando conta for paga
CREATE OR REPLACE FUNCTION public.update_comissao_on_conta_paga()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Verificar se a conta possui comissao_id e mudou para "Pago"
  IF NEW.comissao_id IS NOT NULL AND OLD.status != 'Pago' AND NEW.status = 'Pago' THEN
    -- Atualizar comissão para "Paga"
    UPDATE public.comissoes 
    SET 
      status = 'Paga',
      data_pagamento = NEW.data_pagamento
    WHERE id = NEW.comissao_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fase 9: Criar trigger para chamar função quando conta for atualizada
DROP TRIGGER IF EXISTS trigger_update_comissao_on_conta_paga ON public.contas_a_pagar;
CREATE TRIGGER trigger_update_comissao_on_conta_paga
AFTER UPDATE ON public.contas_a_pagar
FOR EACH ROW
EXECUTE FUNCTION public.update_comissao_on_conta_paga();