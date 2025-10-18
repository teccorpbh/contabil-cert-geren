-- Adicionar campos para armazenar informações do boleto gerado pelo Asaas
ALTER TABLE vendas 
ADD COLUMN boleto_url TEXT,
ADD COLUMN invoice_url TEXT,
ADD COLUMN asaas_payment_id TEXT,
ADD COLUMN nosso_numero TEXT;

-- Adicionar comentários para documentação
COMMENT ON COLUMN vendas.boleto_url IS 'URL do boleto bancário em PDF gerado pelo Asaas';
COMMENT ON COLUMN vendas.invoice_url IS 'URL da fatura/nota fiscal gerada pelo Asaas';
COMMENT ON COLUMN vendas.asaas_payment_id IS 'ID único do pagamento no sistema Asaas';
COMMENT ON COLUMN vendas.nosso_numero IS 'Número do boleto bancário (nosso número)';