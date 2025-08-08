-- Remove the duplicate trigger that's causing commission duplication
DROP TRIGGER IF EXISTS create_comissao_on_venda ON public.vendas;

-- Clean up duplicate commissions - keep only the first commission of each type per sale
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY venda_id, 
      CASE 
        WHEN indicador_id IS NOT NULL THEN 'indicador'
        WHEN vendedor_id IS NOT NULL THEN 'vendedor'
      END
      ORDER BY created_at ASC
    ) as rn
  FROM public.comissoes
  WHERE (indicador_id IS NOT NULL OR vendedor_id IS NOT NULL)
)
DELETE FROM public.comissoes 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);