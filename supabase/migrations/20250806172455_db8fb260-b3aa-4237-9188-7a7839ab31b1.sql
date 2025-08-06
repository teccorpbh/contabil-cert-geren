-- Adicionar coluna percentual_comissao na tabela vendedores
ALTER TABLE public.vendedores 
ADD COLUMN percentual_comissao INTEGER NOT NULL DEFAULT 5;

-- Modificar a função create_comissao_for_venda para incluir comissões de vendedores
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
BEGIN
  -- Só criar comissão se houver indicador
  IF NEW.indicador_id IS NOT NULL THEN
    -- Buscar percentual do indicador
    SELECT percentual_comissao INTO indicador_percentual
    FROM public.indicadores 
    WHERE id = NEW.indicador_id;
    
    -- Calcular valor da comissão do indicador
    comissao_valor := (NEW.valor * indicador_percentual / 100);
    
    -- Inserir comissão do indicador
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
  
  -- Criar comissão para vendedor se houver vendedor_id
  IF NEW.vendedor_id IS NOT NULL THEN
    -- Buscar percentual do vendedor
    SELECT percentual_comissao INTO vendedor_percentual
    FROM public.vendedores 
    WHERE id = NEW.vendedor_id;
    
    -- Calcular valor da comissão do vendedor
    comissao_valor := (NEW.valor * vendedor_percentual / 100);
    
    -- Inserir comissão do vendedor (criar uma entrada específica para vendedores)
    INSERT INTO public.comissoes (
      venda_id,
      indicador_id, -- Usar o mesmo campo mas para vendedor
      valor,
      percentual,
      user_id,
      observacoes
    ) VALUES (
      NEW.id,
      NEW.vendedor_id, -- Usar vendedor_id no lugar de indicador_id
      comissao_valor,
      vendedor_percentual,
      NEW.user_id,
      'Comissão do vendedor'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Criar trigger para criação automática de certificados quando venda é emitida
CREATE OR REPLACE FUNCTION public.create_certificado_for_emitted_venda()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Verificar se o status mudou para "Emitido" 
  IF OLD.status != 'Emitido' AND NEW.status = 'Emitido' THEN
    -- Criar certificado automaticamente
    INSERT INTO public.certificados (
      tipo,
      documento,
      cliente,
      validade,
      status,
      venda_id,
      user_id
    ) VALUES (
      'A3', -- Tipo padrão
      NEW.pedido_segura, -- Usar pedido_segura como documento
      NEW.cliente,
      CURRENT_DATE + INTERVAL '1 year', -- Validade de 1 ano a partir de hoje
      'Emitido',
      NEW.id,
      NEW.user_id
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Criar trigger para executar a função quando uma venda é atualizada
CREATE TRIGGER trigger_create_certificado_for_emitted_venda
  BEFORE UPDATE ON public.vendas
  FOR EACH ROW
  EXECUTE FUNCTION public.create_certificado_for_emitted_venda();

-- Atualizar trigger existente para incluir comissões de vendedores
DROP TRIGGER IF EXISTS trigger_create_comissao_for_venda ON public.vendas;
CREATE TRIGGER trigger_create_comissao_for_venda
  AFTER INSERT ON public.vendas
  FOR EACH ROW
  EXECUTE FUNCTION public.create_comissao_for_venda();