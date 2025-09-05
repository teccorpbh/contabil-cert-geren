-- Create enum for agendamento status
CREATE TYPE public.status_agendamento AS ENUM ('Agendado', 'Realizado', 'Cancelado', 'Reagendado');

-- Create agendamentos table
CREATE TABLE public.agendamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venda_id UUID NOT NULL REFERENCES public.vendas(id) ON DELETE CASCADE,
  pedido_segura TEXT NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id),
  data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
  status public.status_agendamento NOT NULL DEFAULT 'Agendado',
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own agendamentos" 
ON public.agendamentos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agendamentos" 
ON public.agendamentos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agendamentos" 
ON public.agendamentos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agendamentos" 
ON public.agendamentos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_agendamentos_updated_at
BEFORE UPDATE ON public.agendamentos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on queries
CREATE INDEX idx_agendamentos_venda_id ON public.agendamentos(venda_id);
CREATE INDEX idx_agendamentos_pedido_segura ON public.agendamentos(pedido_segura);
CREATE INDEX idx_agendamentos_data ON public.agendamentos(data_agendamento);
CREATE INDEX idx_agendamentos_user_id ON public.agendamentos(user_id);