-- Adicionar campo vendedor_id na tabela comissoes
ALTER TABLE public.comissoes ADD COLUMN vendedor_id UUID REFERENCES public.vendedores(id);

-- Alterar o campo indicador_id para permitir null quando for comissão de vendedor
ALTER TABLE public.comissoes ALTER COLUMN indicador_id DROP NOT NULL;

-- Corrigir o trigger para usar os campos corretos
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
  -- Criar comissão para indicador se houver indicador_id
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
      user_id,
      observacoes
    ) VALUES (
      NEW.id,
      NEW.indicador_id,
      comissao_valor,
      indicador_percentual,
      NEW.user_id,
      'Comissão do indicador'
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
    
    -- Inserir comissão do vendedor usando o campo vendedor_id
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
      'Comissão do vendedor'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS trigger_create_comissao_for_venda ON public.vendas;
CREATE TRIGGER trigger_create_comissao_for_venda
  AFTER INSERT ON public.vendas
  FOR EACH ROW
  EXECUTE FUNCTION public.create_comissao_for_venda();