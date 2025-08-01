-- Corrigir a função update_updated_at_column com search_path seguro
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Corrigir a função calculate_dias_vencimento com search_path seguro
CREATE OR REPLACE FUNCTION public.calculate_dias_vencimento()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.dias_vencimento := NEW.validade - CURRENT_DATE;
  RETURN NEW;
END;
$$;

-- Corrigir a função create_comissao_for_venda com search_path seguro
CREATE OR REPLACE FUNCTION public.create_comissao_for_venda()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;